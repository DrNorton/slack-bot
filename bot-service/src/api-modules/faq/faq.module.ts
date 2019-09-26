import { FaqService } from './faq.service';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FaqController } from './faq.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionEntity } from './entity/question.entity';
import { AnswerEntity } from './entity/answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionEntity, AnswerEntity])],
  providers: [FaqService],
  controllers: [FaqController],
  exports: [FaqService],
})
export class FaqModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {}
}
