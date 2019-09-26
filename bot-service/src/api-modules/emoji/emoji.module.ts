import { Module } from '@nestjs/common';
import { EmojiService } from './emoji.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmojiEntity } from './entity/emoji.entity';
import { SlackApiModule } from '../../internal/slack-api/slack.api.module';
import EmojiController from './emoji.controller';
import EmojiStorage from './emoji.storage';

@Module({
  imports: [TypeOrmModule.forFeature([EmojiEntity])],
  providers: [EmojiService, EmojiStorage],
  controllers: [EmojiController],
  exports: [EmojiService, EmojiStorage],
})
export class EmojiModule {}
