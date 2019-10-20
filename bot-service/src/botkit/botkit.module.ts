import { Module } from '@nestjs/common';
import { FaqDialogModule } from './dialogs/faq/faqDialog.module';
import { ReactionModule } from './dialogs/reaction/reaction.module';
import { BookingDialogModule } from './dialogs/booking/booking.dialog.module';

@Module({
  imports: [FaqDialogModule, ReactionModule, BookingDialogModule],
})
export class BotkitModule {}
