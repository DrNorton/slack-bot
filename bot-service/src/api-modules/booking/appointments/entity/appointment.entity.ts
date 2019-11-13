import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TeamEntity } from '../../../team/entity/team.entity';
import { RoomEntity } from '../../meetingRooms/rooms/entity/room.entity';
import AppointmentDto from '../dto/appointment.dto';
import { MemberEntity } from '../../../members/entity/member.entity';

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

  @ManyToMany(type => MemberEntity)
  @JoinTable()
  members: MemberEntity[];

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
    appointmentDto.members = this.members
      ? this.members.map(x => x.toDto())
      : [];
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
    appointmentEntity.members = dto.members.map(memberDto =>
      MemberEntity.fromDto(teamId, memberDto),
    );
    return appointmentEntity;
  }
}
