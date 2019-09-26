import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { TeamEntity } from '../../../team/entity/team.entity';

@Entity('room')
export class RoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image: string;

  @Column()
  name: string;

  @PrimaryColumn({ nullable: false })
  teamId: string;

  @ManyToOne(type => TeamEntity, team => team.rooms)
  team: TeamEntity;
}
