import { Injectable } from '@nestjs/common';
import CommonBotConnector from '../../common/common.bot.connector';
import BookingDialogService from './booking.dialog.service';
import { SlackBotWorker } from 'botbuilder-adapter-slack';

@Injectable()
export default class BookingDialog {
  constructor(
    private readonly connector: CommonBotConnector,
    private readonly bookingDialogService: BookingDialogService,
  ) {
  }

  public onModuleInit() {
    const controller = this.connector.get();
    controller.on('slash_command', async (bot, message) => {
      if (message.command === '/booking') {
        const blocks = await this.bookingDialogService.getRoomsDialog(
          message.team_id,
        );
        const trigger_id = message.trigger_id;
        const response = await (bot as SlackBotWorker).api.views.open({
          trigger_id,
          view: {
            type: 'modal',
            callback_id: 'modal-identifier',
            submit: {
              type: 'plain_text',
              text: 'Submit',
              emoji: true,
            },
            close: {
              type: 'plain_text',
              text: 'Cancel',
              emoji: true,
            },
            title: {
              type: 'plain_text',
              text: 'Just a modal',
            },
            blocks,
          },
        });
      }
    });
    controller.on('block_actions', async (bot, message) => {
      const action = message.incoming_message.channelData.actions[0];
      switch (action.action_id) {
        case 'picked_room':
          const blocks = await this.bookingDialogService.getDatePicker(
            message.team.id,
            parseInt(action.value, 10),
          );
          console.log(JSON.stringify(blocks));
          const trigger_id = message.trigger_id;
          const response = await (bot as SlackBotWorker).api.views.update({
            view_id: message.container.view_id,
            view: {
              type: 'modal',
              submit: {
                type: 'plain_text',
                text: 'Submit',
                emoji: true,
              },
              close: {
                type: 'plain_text',
                text: 'Cancel',
                emoji: true,
              },
              callback_id: 'modal-identifier',
              title: {
                type: 'plain_text',
                text: 'Just a modal',
              },
              blocks,
            },
          });
          break;
      }
    });
    controller.on('view_submission', async (bot, message) => {
      const blocks = await this.bookingDialogService.getDatePicker(
        message.team.id,
        10,
      );
      console.log(JSON.stringify(blocks));
      const trigger_id = message.trigger_id;
      const response = await (bot as SlackBotWorker).api.views.update({
        view_id: message.container.view_id,
        view: {
          type: 'modal',
          submit: {
            type: 'plain_text',
            text: 'Submit',
            emoji: true,
          },
          close: {
            type: 'plain_text',
            text: 'Cancel',
            emoji: true,
          },
          callback_id: 'modal-identifier',
          title: {
            type: 'plain_text',
            text: 'Just a modal',
          },
          blocks,
        },
      });
    });
  }
}
