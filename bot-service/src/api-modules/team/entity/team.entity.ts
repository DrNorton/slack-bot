import {
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { QuestionEntity } from '../../faq/entity/question.entity';
import { MemberEntity } from '../../members/entity/member.entity';
import { EmojiEntity } from '../../emoji/entity/emoji.entity';
import { RoomEntity } from '../../booking/meetingRooms/rooms/entity/room.entity';
import { RoomAttributeTypeEntity } from '../../booking/meetingRooms/attributeTypes/entity/room.attributeType.entity';
import { AppointmentEntity } from '../../booking/appointments/entity/appointment.entity';

@Entity('team')
export class TeamEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  access_token: string;

  @Column()
  scope: string;

  @Column()
  bot_user_id: string;
  @Column()
  team_name: string;
  @Column()
  bot_access_token: string;

  @OneToMany(type => UserEntity, user => user.id)
  users: UserEntity[];

  @OneToMany(type => MemberEntity, team => team.id)
  members: MemberEntity[];

  @OneToMany(type => QuestionEntity, question => question.id)
  questions: QuestionEntity[];

  @OneToMany(type => EmojiEntity, emoji => emoji.name, {
    cascade: true,
  })
  emojiis: EmojiEntity[];

  @OneToMany(type => RoomEntity, room => room.id)
  rooms: RoomEntity[];

  @OneToMany(type => AppointmentEntity, appointment => appointment.id)
  appointments: AppointmentEntity[];

  @OneToMany(type => RoomAttributeTypeEntity, room => room.id)
  attributeTypes: RoomAttributeTypeEntity[];

  @CreateDateColumn()
  public created: Date;

  @UpdateDateColumn()
  public updated: Date;
}
