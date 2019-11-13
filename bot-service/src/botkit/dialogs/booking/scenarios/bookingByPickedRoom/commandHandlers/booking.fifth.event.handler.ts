import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ViewSubmissionEvent } from '../../../../../global/commands/viewSubmission.event';
import AppointmentDto from '../../../../../../api-modules/booking/appointments/dto/appointment.dto';
import BookingByPickedRoomController from '../bookingByPickedRoom.controller';
import MemberDto from '../../../../../../api-modules/members/dto/member.dto';

@EventsHandler(ViewSubmissionEvent)
export class BookingFifthEventHandler
  implements IEventHandler<ViewSubmissionEvent> {
  constructor(
    private readonly bookingDialogService: BookingByPickedRoomController,
  ) {
  }

  async handle(submissionEvent: ViewSubmissionEvent) {
    const { callbackId, message, bot } = submissionEvent;

    if (callbackId === 'completed_appointment') {
      const privateMetadata = JSON.parse(message.view.private_metadata);
      const values = message.view.state.values;
      const members = values.members.membersSelect.selected_users;
      const appointment = new AppointmentDto();
      appointment.title = values.titleBlock.title.value;
      appointment.desc = values.descriptionBlock.description.value;
      appointment.roomId = privateMetadata.roomId;
      appointment.start = privateMetadata.start;
      appointment.end = privateMetadata.end;
      appointment.members = members.map(member => new MemberDto(member));
      const createdAppointment = await this.bookingDialogService.createAppointment(
        message.team.id,
        appointment,
      );
      const url = privateMetadata.responseUrl;

      const blocks = await this.bookingDialogService.getResultView(
        message.team.id,
        createdAppointment,
      );
      await bot.replyInteractive(
        { incoming_message: { channelData: { response_url: url } } },
        { blocks },
      );
    }
  }
}
