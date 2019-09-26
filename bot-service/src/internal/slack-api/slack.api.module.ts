import { Module } from '@nestjs/common';
import SlackApiService from './slack.api.service';

@Module({
  providers: [SlackApiService],
  exports: [SlackApiService],
})
export class SlackApiModule {}
