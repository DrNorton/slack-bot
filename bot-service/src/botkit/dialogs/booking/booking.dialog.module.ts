import { Module } from '@nestjs/common';
import { CommonBotModule } from '../../common/common.bot.module';
import BookingDialog from './booking.dialog';
import BookingDialogService from './booking.dialog.service';
import { MeetingRoomsModule } from '../../../api-modules/booking/meetingRooms/meetingRooms.module';

@Module({
  imports: [CommonBotModule, MeetingRoomsModule],
  providers: [BookingDialog, BookingDialogService],
})
export class BookingDialogModule {}
