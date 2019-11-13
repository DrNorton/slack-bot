import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import BookingByPickedRoomController from '../bookingByPickedRoom.controller';
import { SlashEvent } from '../../../../../global/commands/slash.event';

@EventsHandler(SlashEvent)
export class BookingFirstEventHandler implements IEventHandler<SlashEvent> {
  constructor(
    private readonly bookingDialogService: BookingByPickedRoomController,
  ) {
  }

  async handle(slashEvent: SlashEvent) {
    const { command, message, bot } = slashEvent;

    if (command === '/booking') {
      const dialog = await this.bookingDialogService.getRoomsDialog({
        teamId: message.team_id,
        responseUrl: slashEvent.message.response_url,
      });
      const trigger_id = message.trigger_id;
      await bot.api.views.open({
        trigger_id,
        view: dialog,
      });
    }
  }
}
