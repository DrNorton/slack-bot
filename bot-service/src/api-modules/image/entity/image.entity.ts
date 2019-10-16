import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from 'typeorm';

@Entity('image')
export class ImageEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;


  @Column()
  url: string;

  @CreateDateColumn()
  public created: Date;

  @UpdateDateColumn()
  public updated: Date;

}
