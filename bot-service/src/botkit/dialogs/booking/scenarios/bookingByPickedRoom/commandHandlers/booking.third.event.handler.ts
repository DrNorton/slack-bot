import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ViewSubmissionEvent } from '../../../../../global/commands/viewSubmission.event';
import BookingByPickedRoomController, { BookingDialogModel } from '../bookingByPickedRoom.controller';

@EventsHandler(ViewSubmissionEvent)
export class BookingThirdEventHandler
  implements IEventHandler<ViewSubmissionEvent> {
  constructor(
    private readonly bookingDialogService: BookingByPickedRoomController,
  ) {
  }

  async handle(submissionEvent: ViewSubmissionEvent) {
    const { callbackId, message, bot } = submissionEvent;

    if (callbackId === 'booking_selected_time') {
      const values = message.view.state.values;
      const duration = parseInt(
        values.duration.period.selected_option.value,
        10,
      );
      const date = new Date(values.date.date.selected_date);
      const privateMetadata = JSON.parse(message.view.private_metadata);
      const roomId = parseInt(privateMetadata.selectedRoom, 10);
      const responseUrl = privateMetadata.responseUrl;
      const model: BookingDialogModel = {
        teamId: message.team.id,
        roomId,
        duration,
        date,
        responseUrl,
      };

      const blocks = await this.bookingDialogService.getSlotsPicker(model);
      bot.httpBody({
        response_action: 'update',
        view: blocks,
      });
    }
  }
}
