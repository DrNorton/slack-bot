import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import BookingByPickedRoomController, { BookingDialogModel } from '../bookingByPickedRoom.controller';
import { BlockActionsEvent } from '../../../../../global/commands/blockActions.event';

@EventsHandler(BlockActionsEvent)
export class BookingSecondEventHandler
  implements IEventHandler<BlockActionsEvent> {
  constructor(
    private readonly bookingDialogService: BookingByPickedRoomController,
  ) {
  }

  async handle(actionsEvent: BlockActionsEvent) {
    const { action, value, message, bot } = actionsEvent;
    const privateMetadata = JSON.parse(message.view.private_metadata);
    if (action.includes('selected_room')) {
      const model: BookingDialogModel = {
        teamId: message.team.id,
        roomId: parseInt(value, 10),
        responseUrl: privateMetadata.responseUrl,
      };
      const dialog = await this.bookingDialogService.getDatePicker(model);
      await bot.api.views.update({
        view_id: message.container.view_id,
        view: dialog,
      });
    }
  }
}
