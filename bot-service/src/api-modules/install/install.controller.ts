import { Body, Controller, Get, Injectable, Query, Res } from '@nestjs/common';
import CommonBotConnector from '../../botkit/common/common.bot.connector';
import * as express from 'express';
import { ApiOperation } from '@nestjs/swagger';
import { TeamService } from '../team/team.service';
import { InstallService } from './install.service';
import InstallDto from './dto/install.dto';

@Injectable()
@Controller('install')
export default class InstallController {
  constructor(
    private readonly connector: CommonBotConnector,
    private readonly installService: InstallService,
  ) {}

  @ApiOperation({ title: 'Получение урла на установку бота' })
  @Get('')
  public async install(@Body() dto: InstallDto, @Res() res: express.Response) {
    res.redirect(this.connector.get().adapter.getInstallLink());
  }

  @ApiOperation({ title: 'Редирект после авторизации' })
  @Get('/auth')
  public async auth(@Query() query, @Res() res: express.Response) {
    const code = query.code;
    const token = await this.installService.install(code);
    res.redirect(`${process.env.redirectSiteUri}/${token}`);
  }
}
