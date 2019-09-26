import { Injectable } from '@nestjs/common';
import { FaqService } from '../../../api-modules/faq/faq.service';
import BlockSection from '../../../models/slack/BlockSection';
import BlockText from '../../../models/slack/BlockText';
import BlockTextTypes from '../../../models/slack/BlockTextTypes';
import BaseBlock from '../../../models/slack/BaseBlock';
import { FaqItemDto } from '../../../api-modules/faq/dto/faqItem.dto';
import BlockDivider from '../../../models/slack/BlockDivider';
import MrkdwnConverter from '../../../utils/mrkdwnConverter';

@Injectable()
export default class FaqDialogService {
  constructor(private readonly faqService: FaqService) {}

  public async getQuestionsDialog() {
    const questions = await this.faqService.getQuestionsWithAnswers();
    const sections = this.createDialog(questions);
    const blocks = { blocks: sections };
    console.log(JSON.stringify(blocks));
    return blocks;
  }

  private createDialog(
    questions: FaqItemDto[],
    faqItem?: FaqItemDto,
  ): BaseBlock[] {
    const blocks: BaseBlock[] = [];
    blocks.push(this.createTitle());
    blocks.push(this.createDivider());
    questions.forEach(question => {
      blocks.push(this.createQuestionSection(question));
      blocks.push(this.createDivider());
    });

    return blocks;
  }

  private createTitle = (): BlockSection => {
    const titleSection = new BlockSection();
    titleSection.text = {
      text: ':question: *Вопросы и ответы* ',
      type: BlockTextTypes.Markdown,
    };
    return titleSection;
  }

  private createQuestionSection = (dto: FaqItemDto): BlockSection => {
    const questionSection = new BlockSection();
    questionSection.text = new BlockText();
    questionSection.text.text = MrkdwnConverter.convertFromMarkdown(
      dto.question + '\n' + dto.answer,
    );
    questionSection.text.type = BlockTextTypes.Markdown;
    questionSection.block_id = dto.id.toString();
    return questionSection;
  }

  private createDivider = (): BlockDivider => {
    return new BlockDivider();
  }
}
