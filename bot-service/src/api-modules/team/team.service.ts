import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamEntity } from './entity/team.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
  ) {}

  public async getTokenForTeam(teamId: string) {
    const findedItem = await this.teamRepository.findOne({
      id: teamId,
    });

    return findedItem.access_token;
  }

  public async getBotUserByTeam(teamId: string) {
    const findedItem = await this.teamRepository.findOne({
      id: teamId,
    });

    return findedItem.bot_user_id;
  }
}
