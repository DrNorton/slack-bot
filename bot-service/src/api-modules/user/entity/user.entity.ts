import {
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Column,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { TeamEntity } from '../../team/entity/team.entity';

@Entity('user')
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  realName: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column()
  isAdmin: boolean;

  @ManyToOne(type => TeamEntity, team => team.users, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  team: TeamEntity;

  @CreateDateColumn()
  public created: Date;

  @UpdateDateColumn()
  public updated: Date;
}
