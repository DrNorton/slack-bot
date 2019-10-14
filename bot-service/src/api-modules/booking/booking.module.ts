import { Module } from '@nestjs/common';
import { MeetingRoomsModule } from './meetingRooms/meetingRooms.module';

@Module({
  imports: [MeetingRoomsModule],
})
export class BookingModule {}
