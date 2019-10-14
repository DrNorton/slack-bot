import {
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Column,
  PrimaryColumn,
  ManyToOne,
} from 'typeorm';
import { TeamEntity } from '../../team/entity/team.entity';

@Entity('member')
export class MemberEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  realName: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @ManyToOne(type => TeamEntity, team => team.members, { onDelete: 'CASCADE' })
  team: TeamEntity;

  @CreateDateColumn()
  public created: Date;

  @UpdateDateColumn()
  public updated: Date;
}
