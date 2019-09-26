import { Module } from '@nestjs/common';
import CommonBotConnector from '../../common/common.bot.connector';
import FaqDialog from './faq.dialog';
import { FaqModule } from '../../../api-modules/faq/faq.module';
import FaqDialogService from './faq.dialog.service';
import { CommonBotModule } from '../../common/common.bot.module';

@Module({
  imports: [FaqModule, CommonBotModule],
  providers: [FaqDialog, FaqDialogService],
})
export class FaqDialogModule {}
