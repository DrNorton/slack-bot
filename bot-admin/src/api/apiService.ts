import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { FaqDto } from "./requests/faq.dto";
import { ApiError } from "../models/apiError";
import ImageDto from "./requests/image.dto";
import { EmojiDto } from "./requests/emoji.dto";
import TopItemDto from "./requests/topItemDto";
import { WinnerPeriod } from "./requests/winnerPeriod";
import RoomDto from "./requests/booking/room.dto";
import { RoomAttributeTypeDto } from "./requests/booking/roomAttribute.dto";
import AppointmentDto from "./requests/booking/appointment.dto";

export interface BaseApiResponse<T> {
  errorCode: number;
  errorMessage: string;
  validation?: any;
  result: T;
}

interface RequestOptions {
  token?: string;
}

export default class ApiService {
  constructor() {}

  public async getImages(): Promise<ImageDto[]> {
    const url = `${apiUrls.image}`;
    const result = await this.getRequest<ImageDto[]>(url);
    return result;
  }

  public async deleteImage(image: ImageDto): Promise<boolean> {
    const url = `${apiUrls.image}/${image.id}`;
    const result = await this.deleteRequest<boolean>(url);
    return result;
  }

  public async getFaqItems(): Promise<FaqDto[]> {
    const url = `${apiUrls.faq}`;
    const result = await this.getRequest<FaqDto[]>(url);
    return result;
  }

  public async getFaqItemById(faqId: number): Promise<FaqDto> {
    const url = `${apiUrls.faq}/${faqId}`;
    const result = await this.getRequest<FaqDto>(url);

    return result;
  }

  public async deleteFaqItem(faqItem: FaqDto): Promise<boolean> {
    const url = `${apiUrls.faq}/${faqItem.id}`;
    const result = await this.deleteRequest<boolean>(url);
    return result;
  }

  public async createFaqItem(faqItem: FaqDto): Promise<FaqDto> {
    const response = await this.postRequest<FaqDto>(`${apiUrls.faq}`, faqItem);
    return response;
  }

  public async uploadFile(file: File) {
    const url = apiUrls.image;
    const formData = new FormData();
    formData.append("file", new Blob([file]), file.name);
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };
    return await this.executeRequest(axios.post(url, formData, config));
  }

  public async updateFaqItem(event: FaqDto): Promise<FaqDto> {
    const response = await this.putRequest<FaqDto>(`${apiUrls.faq}`, event);
    return response;
  }

  public async getProfile(token?: string): Promise<boolean> {
    return await this.getRequest<boolean>(`${apiUrls.user}/profile`, { token });
  }

  public async getEmojies(): Promise<EmojiDto[]> {
    const url = `${apiUrls.emoji}`;
    const result = await this.getRequest<EmojiDto[]>(url);
    return result;
  }

  public async deleteEmoji(emoji: EmojiDto): Promise<boolean> {
    const url = `${apiUrls.emoji}/${emoji.name}`;
    const result = await this.deleteRequest<boolean>(url);
    return result;
  }

  public async addEmoji(emoji: EmojiDto): Promise<boolean> {
    const url = `${apiUrls.emoji}`;
    const result = await this.putRequest<boolean>(url, emoji);
    return result;
  }

  public async updateEmoji(emoji: EmojiDto[]): Promise<boolean> {
    const url = `${apiUrls.emoji}`;
    const result = await this.postRequest<boolean>(url, emoji);
    return result;
  }

  public async getPeriodWinners(
    periodType: WinnerPeriod
  ): Promise<TopItemDto[]> {
    let segment = "";
    switch (periodType) {
      case WinnerPeriod.Week:
        segment = "week";
        break;

      case WinnerPeriod.Year:
        segment = "year";
        break;

      case WinnerPeriod.Month:
        segment = "month";
        break;
    }
    const url = `${apiUrls.score}/${segment}`;
    const result = await this.getRequest<TopItemDto[]>(url);
    return result;
  }

  //booking
  public async getRooms(): Promise<RoomDto[]> {
    const url = `${apiUrls.room}`;
    const result = await this.getRequest<RoomDto[]>(url);
    return result;
  }

  //booking
  public async addRoom(data: RoomDto): Promise<RoomDto> {
    const url = `${apiUrls.room}`;
    const result = await this.putRequest<RoomDto>(url, data);
    return result;
  }

  //booking
  public async deleteRooms(ids: number[]): Promise<RoomDto> {
    const idsStr = ids.join(",");
    const url = `${apiUrls.room}/items/${idsStr}`;
    const result = await this.deleteRequest<RoomDto>(url);
    return result;
  }
  public async deleteAttributeTypes(ids: number[]): Promise<boolean> {
    const idsStr = ids.join(",");
    const url = `${apiUrls.attributeTypes}/items/${idsStr}`;
    const result = await this.deleteRequest<boolean>(url);
    return result;
  }



  public async getAttributeTypes(): Promise<RoomAttributeTypeDto[]> {
    const url = `${apiUrls.attributeTypes}`;
    const result = await this.getRequest<RoomAttributeTypeDto[]>(url);
    return result;
  }

  public async addAttributeType(
    newType: RoomAttributeTypeDto
  ): Promise<RoomAttributeTypeDto> {
    const url = `${apiUrls.attributeTypes}`;
    const result = await this.putRequest<RoomAttributeTypeDto>(url, newType);
    return result;
  }

  public async getAppointments(): Promise<AppointmentDto[]> {
    const url = `${apiUrls.appointment}`;
    const result = await this.getRequest<AppointmentDto[]>(url);
    return result;
  }

  private async getRequest<R>(
    url: string,
    options?: RequestOptions
  ): Promise<R> {
    const get = axios.get(url, this.getConfig(options));

    return await this.executeRequest(get);
  }

  private async putRequest<R>(
    url: string,
    data: any,
    options?: RequestOptions
  ): Promise<R> {
    return await this.executeRequest(
      axios.put(url, data, this.getConfig(options))
    );
  }

  private async postRequest<R>(
    url: string,
    data: any,
    options?: RequestOptions
  ): Promise<R> {
    return await this.executeRequest(
      axios.post(url, data, this.getConfig(options))
    );
  }

  private async deleteRequest<R>(
    url: string,
    options?: RequestOptions
  ): Promise<R> {
    return await this.executeRequest(
      axios.delete(url, this.getConfig(options))
    );
  }

  private getConfig(options?: RequestOptions): AxiosRequestConfig {
    let config;
    let token;
    const tokenFromStorage = localStorage.getItem("token");
    if (tokenFromStorage) {
      token = tokenFromStorage;
    }
    if (options && options.token) {
      token = options.token;
    }

    if (token) {
      config = {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 15000
      };
    }
    return config;
  }

  private async executeRequest<R>(
    request: Promise<AxiosResponse<BaseApiResponse<R>>>
  ) {
    try {
      const response = await request;
      const serverData = response.data as BaseApiResponse<R>;
      if (serverData.errorCode !== 0) {
        const error = new ApiError(
          serverData.errorCode,
          serverData.errorMessage
        );
        throw error;
      } else {
        return serverData.result;
      }
    } catch (e) {
      if (e instanceof ApiError) {
        throw e;
      } else {
        throw new ApiError(500, e.message);
      }
    }
  }
}
const apiUrls = {
  faq: "/api/faq",
  image: "/api/image",
  user: "/api/user",
  emoji: "/api/emoji",
  room: "/api/room",
  score: "/api/score",
  attributeTypes: "/api/attributetypes",
  appointment:"/api/appointment"
};
