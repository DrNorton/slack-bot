import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';
import { TeamEntity } from '../../../../team/entity/team.entity';
import { RoomAttributeEntity } from '../../attributes/entity/roomAttribute.entity';
import RoomDto from '../dto/room.dto';
import { AppointmentEntity } from '../../../appointments/entity/appointment.entity';

@Entity('room')
export class RoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image: string;

  @Column()
  name: string;

  @Column({ nullable: false })
  teamId: string;

  @ManyToOne(type => TeamEntity, team => team.rooms)
  team: TeamEntity;

  @Column({ default: '#00D084' })
  color: string;

  @OneToMany(type => RoomAttributeEntity, roomAttribute => roomAttribute.room, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  attributes: RoomAttributeEntity[];

  @OneToMany(type => AppointmentEntity, appointment => appointment.id)
  appointments: AppointmentEntity[];

  public toDto(): RoomDto {
    const dto = new RoomDto();
    dto.id = this.id;
    dto.image = this.image;
    dto.name = this.name;
    dto.color = this.color;
    if (this.attributes) {
      dto.attributes = this.attributes.map(x => x.toDto());
    }
    return dto;
  }
}
