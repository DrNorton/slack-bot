import RoomAttributeDto from "./roomAttribute.dto";

export default interface RoomDto {
    id: number;
    image?: string;
    name?: string;
    color:string;
    attributes:RoomAttributeDto[];
}
