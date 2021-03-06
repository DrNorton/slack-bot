import { IRoomAttributeDto } from './roomAttribute.dto';

export interface IRoomDto {
    id: number;
    image?: string;
    name?: string;
    color: string;
    attributes: IRoomAttributeDto[];
}
