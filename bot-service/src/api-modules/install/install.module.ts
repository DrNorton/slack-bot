import { Module } from '@nestjs/common';
import InstallController from './install.controller';
import { CommonBotModule } from '../../botkit/common/common.bot.module';
import { InstallService } from './install.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { MembersModule } from '../members/members.module';
import { EmojiModule } from '../emoji/emoji.module';

@Module({
  imports: [
    CommonBotModule,
    UserModule,
    AuthModule,
    MembersModule
  ],
  controllers: [InstallController],
  providers: [InstallService],
})
export class InstallModule {}
