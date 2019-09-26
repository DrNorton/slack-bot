import { Injectable } from '@nestjs/common';
import MembersStorage from '../members/members.storage';
import ClickhouseService from '../../internal/clickhouse/clickhouse.service';
import WeekTopItemDto from './dto/weekTopItem.dto';
import { PeriodType } from './dto/periodType.enum';

@Injectable()
export default class ScoreService {
  constructor(
    private readonly membersStorage: MembersStorage,
    private readonly clickhouseService: ClickhouseService,
  ) {}

  public async getTop(
    periodType: PeriodType,
    teamId: string,
  ): Promise<WeekTopItemDto[]> {
    const members = await this.membersStorage.getMembers(teamId);
    if (members && members.length > 0) {
      let scoreByUsersId;
      switch (periodType) {
        case PeriodType.week:
          scoreByUsersId = await this.clickhouseService.getWinnerForCurrentWeek(
            teamId,
          );
          break;

        case PeriodType.month:
          scoreByUsersId = await this.clickhouseService.getWinnerForCurrentMonth(
            teamId,
          );
          break;

        case PeriodType.year:
          scoreByUsersId = await this.clickhouseService.getWinnerForCurrentYear(
            teamId,
          );
          break;
      }

      const top = scoreByUsersId.map(scoreByUserId => {
        const topItem = new WeekTopItemDto();
        topItem.score = scoreByUserId.score;
        topItem.winner = members.find(
          member => member.id === scoreByUserId.ownerUserId,
        );
        return topItem;
      });
      return top.filter(x => x.winner);
    } else {
      return [];
    }
  }
}
