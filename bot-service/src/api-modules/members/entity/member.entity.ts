import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { TeamEntity } from '../../team/entity/team.entity';
import MemberDto from '../dto/member.dto';

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

  public toDto() {
    const dto = new MemberDto();
    dto.avatarUrl = this.avatarUrl;
    dto.id = this.id;
    dto.name = this.name;
    dto.realName = this.realName;
    return dto;
  }

  public static fromDto(teamId: string, dto: MemberDto) {
    const memberEntity = new MemberEntity();
    memberEntity.avatarUrl = dto.avatarUrl;
    memberEntity.id = dto.id;
    memberEntity.name = dto.name;
    memberEntity.realName = dto.realName;
    return memberEntity;
  }
}
