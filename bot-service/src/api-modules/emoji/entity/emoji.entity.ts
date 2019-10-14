import {
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { TeamEntity } from '../../team/entity/team.entity';

@Entity('emoji')
export class EmojiEntity {
  @PrimaryColumn()
  name: string;

  @Column({ nullable: true })
  url: string;

  @Column()
  isCustom: boolean;

  @Column()
  scorePoints: number;

  @PrimaryColumn({ nullable: false })
  teamId: string;

  @ManyToOne(type => TeamEntity, team => team.emojiis, { onDelete: 'CASCADE' })
  team: TeamEntity;

  @CreateDateColumn()
  public created: Date;

  @UpdateDateColumn()
  public updated: Date;
}
