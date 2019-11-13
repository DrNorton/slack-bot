import { Module } from '@nestjs/common';
import { FaqDialogModule } from './dialogs/faq/faqDialog.module';
import { ReactionModule } from './dialogs/reaction/reaction.module';
import { BookingDialogModule } from './dialogs/booking/booking.dialog.module';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import CommonBotConnector from './common/common.bot.connector';
import { CommonBotModule } from './common/common.bot.module';
import { SlackBotWorker } from 'botbuilder-adapter-slack';
import { BlockActionsEvent } from './global/commands/blockActions.event';
import { SlashEvent } from './global/commands/slash.event';
import { ViewSubmissionEvent } from './global/commands/viewSubmission.event';

@Module({
  imports: [
    CqrsModule,
    FaqDialogModule,
    ReactionModule,
    BookingDialogModule,
    CommonBotModule,
  ],
})
export class BotkitModule {
  constructor(
    private readonly connector: CommonBotConnector,
    private readonly commandBus: EventBus,
  ) {
  }

  public onModuleInit() {
    const controller = this.connector.get();
    controller.on('slash_command', async (bot: SlackBotWorker, message) => {
      await this.commandBus.publish(
        new SlashEvent(message.command, message, bot),
      );
    });

    controller.on('block_actions', async (bot: SlackBotWorker, message) => {
      const action = message.incoming_message.channelData.actions[0];
      await this.commandBus.publish(
        new BlockActionsEvent(action.action_id, action.value, message, bot),
      );
    });

    controller.on('view_submission', async (bot: SlackBotWorker, message) => {
      await this.commandBus.publish(
        new ViewSubmissionEvent(message.view.callback_id, message, bot),
      );
    });
  }
}
