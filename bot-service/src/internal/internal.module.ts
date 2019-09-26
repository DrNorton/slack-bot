import { Module } from '@nestjs/common';
import InternalService from './internal.service';
import { SlackApiModule } from './slack-api/slack.api.module';
import { ClickhouseModule } from './clickhouse/clickhouse.module';

@Module({
  imports: [SlackApiModule, ClickhouseModule],
  providers: [InternalService],
  exports: [SlackApiModule, ClickhouseModule],
})
export class InternalModule {}
