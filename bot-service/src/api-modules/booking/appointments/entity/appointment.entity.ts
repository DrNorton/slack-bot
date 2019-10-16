import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TeamEntity } from '../../../team/entity/team.entity';
import { RoomEntity } from '../../meetingRooms/rooms/entity/room.entity';

@Entity('appointment')
export class AppointmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => TeamEntity, team => team.appointments)
  team: TeamEntity;

  @ManyToOne(type => RoomEntity, team => team.appointments)
  room: RoomEntity;

  @Column()
  title: string;

  @Column()
  desc: string;

  @Column()
  start: Date;

  @Column()
  end: Date;
}
