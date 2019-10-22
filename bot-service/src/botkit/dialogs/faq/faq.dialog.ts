import { Injectable } from '@nestjs/common';
import CommonBotConnector from '../../common/common.bot.connector';
import FaqDialogService from './faq.dialog.service';

@Injectable()
export default class FaqDialog {
  constructor(
    private readonly connector: CommonBotConnector,
    private readonly faqDialogService: FaqDialogService,
  ) {
  }

  public onModuleInit() {
    const controller = this.connector.get();
    controller.hears('faq', 'message,direct_message', async (bot, message) => {
      const blocks = await this.faqDialogService.getQuestionsDialog();
      await bot.reply(message, { blocks });
    });
  }
}
