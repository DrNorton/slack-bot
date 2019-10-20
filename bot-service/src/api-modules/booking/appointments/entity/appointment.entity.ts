import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TeamEntity } from '../../../team/entity/team.entity';
import { RoomEntity } from '../../meetingRooms/rooms/entity/room.entity';
import { RoomAttributeDto } from '../../meetingRooms/attributes/dto/roomAttribute.dto';
import AppointmentDto from '../dto/appointment.dto';

@Entity('appointment')
export class AppointmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => TeamEntity, team => team.appointments)
  team: TeamEntity;

  @Column({ nullable: false })
  teamId: string;

  @Column({ nullable: false })
  roomId: number;



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

  public toDto() {
    const appointmentDto = new AppointmentDto();
    appointmentDto.id = this.id;
    appointmentDto.end = this.end;
    appointmentDto.start = this.start;
    appointmentDto.roomId = this.roomId;
    appointmentDto.title = this.title;
    appointmentDto.desc = this.desc;
    return appointmentDto;
  }

  public static fromDto(teamId: string, dto: AppointmentDto) {
    const appointmentEntity = new AppointmentEntity();
    appointmentEntity.title = dto.title;
    appointmentEntity.desc = dto.desc;
    appointmentEntity.roomId = dto.roomId;
    appointmentEntity.teamId = teamId;
    appointmentEntity.start = dto.start;
    appointmentEntity.end = dto.end;
    return appointmentEntity;
  }
}
