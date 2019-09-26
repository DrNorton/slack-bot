import {
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Column,
  OneToOne,
  JoinColumn, OneToMany, ManyToOne,
} from 'typeorm';
import { AnswerEntity } from './answer.entity';
import { Transform } from 'class-transformer';
import { UserEntity } from '../../user/entity/user.entity';
import { TeamEntity } from '../../team/entity/team.entity';

@Entity('question')
export class QuestionEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  text: string;
  @OneToOne(type => AnswerEntity, { cascade: true })
  @JoinColumn()
  answer: AnswerEntity;
  @CreateDateColumn()
  public created: Date;

  @ManyToOne(type => TeamEntity, team => team.questions, { cascade: true })
  team: TeamEntity;
}
