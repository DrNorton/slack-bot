import { Module } from '@nestjs/common';
import { CommonBotModule } from '../../common/common.bot.module';
import ReactionDialog from './reaction.dialog';
import { InternalModule } from '../../../internal/internal.module';
import { EmojiModule } from '../../../api-modules/emoji/emoji.module';

@Module({
  imports: [CommonBotModule, InternalModule, EmojiModule],
  providers: [ReactionDialog],
})
export class ReactionModule {}
