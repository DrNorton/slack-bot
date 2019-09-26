import { Controller, Get, Injectable, UseGuards } from '@nestjs/common';
import { BaseController } from '../base/base.controller';
import ScoreService from './score.service';
import { ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../decorators/user.decorator';
import InstalledUserDto from '../install/dto/installedUser.dto';
import BaseApiResponse from '../base/base.api.response';
import WeekTopItemDto from './dto/weekTopItem.dto';
import { PeriodType } from './dto/periodType.enum';

@Injectable()
@Controller('score')
export default class ScoreController extends BaseController {
  constructor(private readonly scoreService: ScoreService) {
    super();
  }

  @ApiOperation({ title: 'Получение победителей недели' })
  @UseGuards(AuthGuard('jwt'))
  @Get('week')
  public async week(
    @User() user: InstalledUserDto,
  ): Promise<BaseApiResponse<WeekTopItemDto[]>> {
    const winners = await this.scoreService.getTop(
      PeriodType.week,
      user.teamId,
    );
    return this.successResponse(winners);
  }

  @ApiOperation({ title: 'Получение победителей месяца' })
  @UseGuards(AuthGuard('jwt'))
  @Get('month')
  public async month(
    @User() user: InstalledUserDto,
  ): Promise<BaseApiResponse<WeekTopItemDto[]>> {
    const winners = await this.scoreService.getTop(
      PeriodType.month,
      user.teamId,
    );
    return this.successResponse(winners);
  }

  @ApiOperation({ title: 'Получение победителей года' })
  @UseGuards(AuthGuard('jwt'))
  @Get('year')
  public async year(
    @User() user: InstalledUserDto,
  ): Promise<BaseApiResponse<WeekTopItemDto[]>> {
    const winners = await this.scoreService.getTop(
      PeriodType.year,
      user.teamId,
    );
    return this.successResponse(winners);
  }
}
