import { Module } from '@nestjs/common';
import CommonBotConnector from './common.bot.connector';
import { TeamModule } from '../../api-modules/team/team.module';

@Module({
  imports: [TeamModule],
  providers: [CommonBotConnector],
  exports: [CommonBotConnector],
})
export class CommonBotModule {}
