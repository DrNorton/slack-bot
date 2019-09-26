import { ApiModelProperty } from '@nestjs/swagger';
import { QuestionEntity } from '../entity/question.entity';

export class QuestionDto {
  id?: number;
  @ApiModelProperty({ description: 'Вопрос' })
  question: string;

}
