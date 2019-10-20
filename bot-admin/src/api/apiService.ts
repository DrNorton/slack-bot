import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiError } from '../models/apiError';
import { IAppointmentDto } from './requests/booking/appointment.dto';
import { IRoomDto } from './requests/booking/room.dto';
import { IRoomAttributeTypeDto } from './requests/booking/roomAttribute.dto';
import { IEmojiDto } from './requests/emoji.dto';
import { IFaqDto } from './requests/faq.dto';
import { IImageDto } from './requests/image.dto';
import { ITopItemDto } from './requests/topItemDto';
import { EWinnerPeriod } from './requests/winnerPeriod';

export interface IBaseApiResponse<T> {
    errorCode: number;
    errorMessage: string;
    validation?: any;
    result: T;
}

interface IRequestOptions {
    token?: string;
}

export default class ApiService {
    public async getImages (): Promise<IImageDto[]> {
        const url = `${apiUrls.image}`;
        return await this.getRequest<IImageDto[]>(url);
    }

    public async deleteImage (image: IImageDto): Promise<boolean> {
        const url = `${apiUrls.image}/${image.id}`;
        return await this.deleteRequest<boolean>(url);
    }

    public async getFaqItems (): Promise<IFaqDto[]> {
        const url = `${apiUrls.faq}`;
        return await this.getRequest<IFaqDto[]>(url);
    }

    public async getFaqItemById (faqId: number): Promise<IFaqDto> {
        const url = `${apiUrls.faq}/${faqId}`;
        return await this.getRequest<IFaqDto>(url);
    }

    public async deleteFaqItem (faqItem: IFaqDto): Promise<boolean> {
        const url = `${apiUrls.faq}/${faqItem.id}`;
        return await this.deleteRequest<boolean>(url);
    }

    public async createFaqItem (faqItem: IFaqDto): Promise<IFaqDto> {
        return await this.postRequest<IFaqDto>(`${apiUrls.faq}`, faqItem);
    }

    public async uploadFile (file: File): Promise<any> {
        const url = apiUrls.image;
        const formData = new FormData();
        formData.append('file', new Blob([file]), file.name);
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            },
        };
        return await this.executeRequest(axios.post(url, formData, config));
    }

    public async updateFaqItem (event: IFaqDto): Promise<IFaqDto> {
        const response = await this.putRequest<IFaqDto>(`${apiUrls.faq}`, event);
        return response;
    }

    public async getProfile (token?: string): Promise<boolean> {
        return await this.getRequest<boolean>(`${apiUrls.user}/profile`, {
            token,
        });
    }

    public async getEmojies (): Promise<IEmojiDto[]> {
        const url = `${apiUrls.emoji}`;
        return await this.getRequest<IEmojiDto[]>(url);
    }

    public async deleteEmoji (emoji: IEmojiDto): Promise<boolean> {
        const url = `${apiUrls.emoji}/${emoji.name}`;
        return await this.deleteRequest<boolean>(url);
    }

    public async addEmoji (emoji: IEmojiDto): Promise<boolean> {
        const url = `${apiUrls.emoji}`;
        return await this.putRequest<boolean>(url, emoji);
    }

    public async updateEmoji (emoji: IEmojiDto[]): Promise<boolean> {
        const url = `${apiUrls.emoji}`;
        return await this.postRequest<boolean>(url, emoji);
    }

    public async getPeriodWinners (periodType: EWinnerPeriod): Promise<ITopItemDto[]> {
        let segment = '';
        switch (periodType) {
            case EWinnerPeriod.Week:
                segment = 'week';
                break;

            case EWinnerPeriod.Year:
                segment = 'year';
                break;

            case EWinnerPeriod.Month:
                segment = 'month';
                break;
            default:
                break;
        }
        const url = `${apiUrls.score}/${segment}`;
        return await this.getRequest<ITopItemDto[]>(url);
    }

    // booking
    public async getRooms (): Promise<IRoomDto[]> {
        const url = `${apiUrls.room}`;
        return await this.getRequest<IRoomDto[]>(url);
    }

    // booking
    public async addRoom (data: IRoomDto): Promise<IRoomDto> {
        const url = `${apiUrls.room}`;
        return await this.putRequest<IRoomDto>(url, data);
    }

    // booking
    public async deleteRooms (ids: number[]): Promise<IRoomDto> {
        const idsStr = ids.join(',');
        const url = `${apiUrls.room}/items/${idsStr}`;
        return await this.deleteRequest<IRoomDto>(url);
    }

    public async deleteAttributeTypes (ids: number[]): Promise<boolean> {
        const idsStr = ids.join(',');
        const url = `${apiUrls.attributeTypes}/items/${idsStr}`;
        return await this.deleteRequest<boolean>(url);
    }

    public async getAttributeTypes (): Promise<IRoomAttributeTypeDto[]> {
        const url = `${apiUrls.attributeTypes}`;
        return await this.getRequest<IRoomAttributeTypeDto[]>(url);
    }

    public async addAttributeType (newType: IRoomAttributeTypeDto): Promise<IRoomAttributeTypeDto> {
        const url = `${apiUrls.attributeTypes}`;
        return await this.putRequest<IRoomAttributeTypeDto>(url, newType);
    }

    public async getAppointments (): Promise<IAppointmentDto[]> {
        const url = `${apiUrls.appointment}`;
        return await this.getRequest<IAppointmentDto[]>(url);
    }

    private async getRequest<R> (url: string, options?: IRequestOptions): Promise<R> {
        const get = axios.get(url, this.getConfig(options));

        return await this.executeRequest(get);
    }

    private async putRequest<R> (url: string, data: any, options?: IRequestOptions): Promise<R> {
        return await this.executeRequest(axios.put(url, data, this.getConfig(options)));
    }

    private async postRequest<R> (url: string, data: any, options?: IRequestOptions): Promise<R> {
        return await this.executeRequest(axios.post(url, data, this.getConfig(options)));
    }

    private async deleteRequest<R> (url: string, options?: IRequestOptions): Promise<R> {
        return await this.executeRequest(axios.delete(url, this.getConfig(options)));
    }

    private getConfig (options?: IRequestOptions): AxiosRequestConfig {
        let config;
        let token;
        const tokenFromStorage = localStorage.getItem('token');
        if (tokenFromStorage) {
            token = tokenFromStorage;
        }
        if (options && options.token) {
            token = options.token;
        }

        if (token) {
            config = {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 15000,
            };
        }
        return config;
    }

    private async executeRequest<R> (request: Promise<AxiosResponse<IBaseApiResponse<R>>>): Promise<R> {
        try {
            const response = await request;
            const serverData = response.data as IBaseApiResponse<R>;
            if (serverData.errorCode !== 0) {
                throw new ApiError(serverData.errorCode, serverData.errorMessage);
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
    faq: '/api/faq',
    image: '/api/image',
    user: '/api/user',
    emoji: '/api/emoji',
    room: '/api/room',
    score: '/api/score',
    attributeTypes: '/api/attributetypes',
    appointment: '/api/appointment',
};
