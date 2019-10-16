import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';
import { RoomAttributeEntity } from '../../attributes/entity/roomAttribute.entity';
import { TeamEntity } from '../../../../team/entity/team.entity';
import { RoomAttributeTypeDto } from '../dto/roomAttributeTypeDto';

@Entity('room_attribute_type')
export class RoomAttributeTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  defaultValue: string;

  @Column({ nullable: true })
  teamId: string;

  @ManyToOne(type => TeamEntity, team => team.attributeTypes)
  team: TeamEntity;

  @OneToMany(type => RoomAttributeEntity, roomAttribute => roomAttribute.id)
  attributes: RoomAttributeEntity[];

  public toDto() {
    const attributeTypesDto = new RoomAttributeTypeDto();
    attributeTypesDto.id = this.id;
    attributeTypesDto.defaultValue = this.defaultValue;
    attributeTypesDto.name = this.name;
    return attributeTypesDto;
  }

  public static fromDto(dto: RoomAttributeTypeDto) {
    const type = new RoomAttributeTypeEntity();
    type.id = dto.id;
    type.defaultValue = dto.defaultValue;
    type.name = dto.name;
    return type;
  }
}
