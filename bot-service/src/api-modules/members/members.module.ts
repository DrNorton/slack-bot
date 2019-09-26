import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { SlackApiModule } from '../../internal/slack-api/slack.api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberEntity } from './entity/member.entity';
import MembersStorage from './members.storage';

@Module({
  imports: [TypeOrmModule.forFeature([MemberEntity]), SlackApiModule],
  providers: [MembersService, MembersStorage],
  exports: [MembersService, MembersStorage],
})
export class MembersModule {}
