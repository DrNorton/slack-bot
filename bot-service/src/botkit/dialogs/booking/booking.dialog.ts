import { Injectable } from '@nestjs/common';
import CommonBotConnector from '../../common/common.bot.connector';
import BookingDialogService from './booking.dialog.service';
import { SlackBotWorker, SlackDialog } from 'botbuilder-adapter-slack';

@Injectable()
export default class BookingDialog {
  constructor(
    private readonly connector: CommonBotConnector,
    private readonly bookingDialogService: BookingDialogService,
  ) {}

  public onModuleInit() {
    const controller = this.connector.get();
    controller.on('slash_command', async (bot, message) => {
      if (message.command === '/booking') {
        const dialog = await this.bookingDialogService.getRoomsDialog(
          message.team_id,
        );
        console.log(JSON.stringify(dialog));
        (bot as SlackBotWorker).reply(message, dialog);
      }
    });
    controller.on('block_actions', async (bot, message) => {
      const action = message.incoming_message.channelData.actions[0];
      let dialog;
      switch (action.action_id) {
        case 'picked_room':
          dialog = await this.bookingDialogService.getTimePicker(
            message.team.id,
            parseInt(action.value, 10),
          );
          (bot as SlackBotWorker).replyInteractive(message, dialog);
          break;

        case 'picked_date':
          break;
      }
    });
  }
}
