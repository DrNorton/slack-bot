import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BlockActionsEvent } from '../../../../../global/commands/blockActions.event';
import { SlackBotWorker } from 'botbuilder-adapter-slack';
import BookingByPickedRoomController, { BookingDialogModel } from '../bookingByPickedRoom.controller';
import moment = require('moment');

@EventsHandler(BlockActionsEvent)
export class BookingsFourthEventHandler
  implements IEventHandler<BlockActionsEvent> {
  constructor(
    private readonly bookingDialogService: BookingByPickedRoomController,
  ) {
  }

  async handle(slashEvent: BlockActionsEvent) {
    const { action, value, message, bot } = slashEvent;

    if (action.includes('selected_slot')) {
      const privateMetadata = JSON.parse(message.view.private_metadata);
      const selectedSlot = JSON.parse(value);
      const model: BookingDialogModel = {
        teamId: message.team.id,
        roomId: parseInt(privateMetadata.roomId, 10),
        duration: parseInt(privateMetadata.duration, 10),
        date: new Date(privateMetadata.date),
        start: moment(selectedSlot.start, 'DD-MM-YYYY HH:mm').toDate(),
        end: moment(selectedSlot.end, 'DD-MM-YYYY HH:mm').toDate(),
        responseUrl: privateMetadata.responseUrl,
      };

      const dialog = await this.bookingDialogService.getAdditionalPropertiesPicker(
        model,
      );

      const response = await (bot as SlackBotWorker).api.views.update({
        view_id: message.container.view_id,
        view: dialog,
      });
    }
  }
}
