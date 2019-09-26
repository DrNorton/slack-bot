import { ApiModelProperty } from '@nestjs/swagger';

export class FaqItemDto {
  id?: number;
  @ApiModelProperty({ description: 'Вопрос' })
  question: string;
  @ApiModelProperty({ description: 'Ответ' })
  answer: string;
}
