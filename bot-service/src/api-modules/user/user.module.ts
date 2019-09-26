import { Module } from '@nestjs/common';
import UserService from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import UserController from './user.controller';
import { TeamEntity } from '../team/entity/team.entity';
import { SlackApiModule } from '../../internal/slack-api/slack.api.module';
import { EmojiModule } from '../emoji/emoji.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, TeamEntity]),
    SlackApiModule,
    EmojiModule,
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
