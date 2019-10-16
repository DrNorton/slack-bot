import { Module } from '@nestjs/common';
import { MeetingRoomsModule } from './meetingRooms/meetingRooms.module';
import { AppointmentModule } from './appointments/appointment.module';

@Module({
  imports: [MeetingRoomsModule, AppointmentModule],
})
export class BookingModule {}
