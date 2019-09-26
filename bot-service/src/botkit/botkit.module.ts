import { Module } from '@nestjs/common';
import { FaqDialogModule } from './dialogs/faq/faqDialog.module';
import { ReactionModule } from './dialogs/reaction/reaction.module';

@Module({
  imports: [FaqDialogModule, ReactionModule],
})
export class BotkitModule {}
