import {
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Column,
} from 'typeorm';

@Entity('answer')
export class AnswerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @CreateDateColumn()
  public created: Date;

  @UpdateDateColumn()
  public updated: Date;
}
