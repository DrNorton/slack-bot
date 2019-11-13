import { Injectable } from '@nestjs/common';
import SlackApiService from '../../internal/slack-api/slack.api.service';
import { MemberEntity } from './entity/member.entity';
import { TeamEntity } from '../team/entity/team.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
    private readonly slackApiService: SlackApiService,
  ) {
  }

  public async loadMembers(acessToken: string, teamId: string) {
    const membersFromSlack: any[] = await this.slackApiService.getUsersList(
      acessToken,
    );
    const teamEntity = new TeamEntity();
    teamEntity.id = teamId;
    const members: MemberEntity[] = membersFromSlack
      .filter(x => !x.is_bot)
      .map(item => {
        const memberEntity = new MemberEntity();
        memberEntity.avatarUrl = item.profile.image_original;
        memberEntity.name = item.name;
        memberEntity.realName = item.real_name;
        memberEntity.id = item.id;
        memberEntity.team = teamEntity;
        return memberEntity;
      });

    await this.memberRepository.save(members);
  }

  public async getMembers(teamId: string) {
    const team = new TeamEntity();
    team.id = teamId;
    const members = await this.memberRepository.find({ team });
    return members.map(member => member.toDto());
  }
}
