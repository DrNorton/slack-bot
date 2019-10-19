import { Module } from '@nestjs/common';
import { FaqModule } from './faq/faq.module';
import { ImageModule } from './image/image.module';
import { InstallModule } from './install/install.module';
import { TeamModule } from './team/team.module';
import { AuthModule } from './auth/auth.module';
import { MembersModule } from './members/members.module';
import { EmojiModule } from './emoji/emoji.module';
import { ScoreModule } from './score/score.module';
import { MeetingRoomsModule } from './booking/meetingRooms/meetingRooms.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [
    FaqModule,
    ImageModule,
    InstallModule,
    TeamModule,
    AuthModule,
    MembersModule,
    EmojiModule,
    ScoreModule,
    BookingModule,
  ],
})
export class ApiModule {}
