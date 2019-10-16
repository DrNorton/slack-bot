export default interface RoomAttributeDto {
  id?: number;
  attributeType: RoomAttributeTypeDto;
  value: string;
}

export interface RoomAttributeTypeDto {
  id: number;
  name: string;
  defaultValue: string;
}
