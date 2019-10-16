import { RoomAttributeTypeDto } from '../../attributeTypes/dto/roomAttributeTypeDto';
import RoomDto from '../../rooms/dto/room.dto';

export class RoomAttributeDto {
  id: number;
  attributeType: RoomAttributeTypeDto;
  room: RoomDto;
  value: string;
}
