import { Module } from '@nestjs/common';
import { CommonBotModule } from '../../common/common.bot.module';
import BookingDialog from './booking.dialog';
import { MeetingRoomsModule } from '../../../api-modules/booking/meetingRooms/meetingRooms.module';
import { AppointmentModule } from '../../../api-modules/booking/appointments/appointment.module';
import { BookingCommandHandlers } from './scenarios/bookingByPickedRoom/commandHandlers';
import BookingByPickedRoomController from './scenarios/bookingByPickedRoom/bookingByPickedRoom.controller';

@Module({
  imports: [CommonBotModule, MeetingRoomsModule, AppointmentModule],
  providers: [
    BookingDialog,
    BookingByPickedRoomController,
    ...BookingCommandHandlers,
  ],
})
export class BookingDialogModule {
}
