export interface IRoomAttributeDto {
    id?: number;
    attributeType: IRoomAttributeTypeDto;
    value: string;
}

export interface IRoomAttributeTypeDto {
    id: number;
    name: string;
    defaultValue: string;
}
