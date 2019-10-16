import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoomAttributeTypeEntity } from '../../attributeTypes/entity/room.attributeType.entity';
import { RoomEntity } from '../../rooms/entity/room.entity';
import { RoomAttributeDto } from '../dto/roomAttribute.dto';

@Entity('room_attribute')
export class RoomAttributeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => RoomEntity, roomEntity => roomEntity.attributes, {
    onDelete: 'CASCADE',
  })
  room: RoomEntity;

  @Column()
  attributeTypeId: number;

  @ManyToOne(
    type => RoomAttributeTypeEntity,
    roomAtributeType => roomAtributeType.attributes,
  )
  attributeType: RoomAttributeTypeEntity;

  @Column()
  value: string;

  public toDto() {
    const attribute = new RoomAttributeDto();
    attribute.id = this.id;
    attribute.value = this.value;
    if (this.attributeType) {
      attribute.attributeType = this.attributeType.toDto();
    }
    if (this.room) {
      attribute.room = this.room.toDto();
    }

    return attribute;
  }

  public static fromDto(dto: RoomAttributeDto) {
    const attribute = new RoomAttributeEntity();
    attribute.value = dto.value;
    attribute.attributeTypeId = dto.attributeType.id;
    return attribute;
  }
}
