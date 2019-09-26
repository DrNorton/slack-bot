import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { FaqDto } from "./requests/faq.dto";
import { ApiError } from "../models/apiError";
import ImageDto from "./requests/image.dto";
import { EmojiDto } from "./requests/emoji.dto";
import TopItemDto from "./requests/topItemDto";
import { WinnerPeriod } from "./requests/winnerPeriod";

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
  private baseUrl: string;

  constructor() {
    if (process.env.REACT_APP_SERVER_URL) {
      this.baseUrl = process.env.REACT_APP_SERVER_URL;
    } else {
      // eslint-disable-next-line no-restricted-globals
      const protocol = location.protocol;
      const slashes = protocol.concat("//");
      const host = slashes.concat(
        `${window.location.hostname}:${window.location.port}`
      );
      this.baseUrl = `${host}/api`;
    }
  }

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
    const url = `${this.baseUrl}${apiUrls.image}`;
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

  private async getRequest<R>(
    url: string,
    options?: RequestOptions
  ): Promise<R> {
    const get = axios.get(`${this.baseUrl}${url}`, this.getConfig(options));

    return await this.executeRequest(get);
  }

  private async putRequest<R>(
    url: string,
    data: any,
    options?: RequestOptions
  ): Promise<R> {
    return await this.executeRequest(
      axios.put(`${this.baseUrl}${url}`, data, this.getConfig(options))
    );
  }

  private async postRequest<R>(
    url: string,
    data: any,
    options?: RequestOptions
  ): Promise<R> {
    return await this.executeRequest(
      axios.post(`${this.baseUrl}${url}`, data, this.getConfig(options))
    );
  }

  private async deleteRequest<R>(
    url: string,
    options?: RequestOptions
  ): Promise<R> {
    return await this.executeRequest(
      axios.delete(`${this.baseUrl}${url}`, this.getConfig(options))
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
        headers: { Authorization: `Bearer ${token}` }
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
  faq: "/faq",
  image: "/image",
  user: "/user",
  emoji: "/emoji",
  score: "/score"
};
