import { Injectable } from '@nestjs/common';
import { FaqService } from '../../../api-modules/faq/faq.service';
import faqView from './views/faq.view';

@Injectable()
export default class FaqDialogService {
  constructor(private readonly faqService: FaqService) {
  }

  public async getQuestionsDialog() {
    const questions = await this.faqService.getQuestionsWithAnswers();
    return faqView(questions);
  }
}
