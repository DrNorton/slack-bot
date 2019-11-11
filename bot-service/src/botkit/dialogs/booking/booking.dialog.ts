import { Injectable } from '@nestjs/common';
import CommonBotConnector from '../../common/common.bot.connector';
import BookingDialogService, { BookingDialogModel } from './booking.dialog.service';
import { SlackBotWorker } from 'botbuilder-adapter-slack';
import { BotkitMessage } from 'botkit';
import AppointmentDto from '../../../api-modules/booking/appointments/dto/appointment.dto';
import moment = require('moment');

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
        const dialog = await this.bookingDialogService.getRoomsDialog({
          teamId: message.team_id,
        });
        const trigger_id = message.trigger_id;
        const response = await (bot as SlackBotWorker).api.views.open({
          trigger_id,
          view: dialog,
        });
      }
    });
    controller.on('block_actions', async (bot: SlackBotWorker, message) => {
      const action = message.incoming_message.channelData.actions[0];
      if (action.action_id.includes('select_room')) {
        const model: BookingDialogModel = {
          teamId: message.team.id,
          roomId: parseInt(action.value, 10),
        };
        const dialog = await this.bookingDialogService.getDatePicker(model);
        const response = await bot.api.views.update({
          view_id: message.container.view_id,
          view: dialog,
        });
      } else if (action.action_id.includes('select_slot')) {
        const privateMetadata = JSON.parse(message.view.private_metadata);
        const selectedSlot = JSON.parse(action.value);
        const model: BookingDialogModel = {
          teamId: message.team.id,
          roomId: parseInt(privateMetadata.roomId, 10),
          duration: parseInt(privateMetadata.duration, 10),
          date: new Date(privateMetadata.date),
          start: moment(selectedSlot.start, 'DD-MM-YYYY HH:mm').toDate(),
          end: moment(selectedSlot.end, 'DD-MM-YYYY HH:mm').toDate(),
        };

        const dialog = await this.bookingDialogService.getAdditionalPropertiesPicker(
          model,
        );

        const response = await (bot as SlackBotWorker).api.views.update({
          view_id: message.container.view_id,
          view: dialog,
        });
      }
    });

    controller.on(
      'view_submission',
      async (bot: SlackBotWorker, message: BotkitMessage) => {
        if (message.view.callback_id === 'booking_select_time') {
          const values = message.view.state.values;
          const duration = parseInt(
            values.duration.period.selected_option.value,
            10,
          );
          const date = new Date(values.date.date.selected_date);
          const roomId = parseInt(
            JSON.parse(message.view.private_metadata).selectedRoom,
            10,
          );
          const model: BookingDialogModel = {
            teamId: message.team.id,
            roomId,
            duration,
            date,
          };

          const blocks = await this.bookingDialogService.getSlotsPicker(model);
          bot.httpBody({
            response_action: 'update',
            view: blocks,
          });
        }

        if (message.view.callback_id === 'booking_pick_room') {
          const privateMetadata = JSON.parse(message.view.private_metadata);
          const values = message.view.state.values;
          const members = values.members.membersSelect.selected_users;
          const appointment = new AppointmentDto();
          appointment.title = values.titleBlock.title.value;
          appointment.desc = values.descriptionBlock.description.value;
          appointment.roomId = privateMetadata.roomId;
          appointment.start = privateMetadata.start;
          appointment.end = privateMetadata.end;
          await this.bookingDialogService.createAppointment(
            message.team.id,
            appointment,
          );
        }
      },
    );
  }
}
