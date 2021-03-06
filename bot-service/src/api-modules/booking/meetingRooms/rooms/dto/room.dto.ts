import { RoomAttributeDto } from '../../attributes/dto/roomAttribute.dto';

export default class RoomDto {
  id: number;
  image: string;
  name: string;
  color: string;
  attributes: RoomAttributeDto[];
}
