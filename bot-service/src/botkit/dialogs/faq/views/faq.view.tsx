/** @jsx JSXSlack.h */

import { FaqItemDto } from '../../../../api-modules/faq/dto/faqItem.dto';
import JSXSlack, { Blocks, Divider, Section } from '@speee-js/jsx-slack';
import MrkdwnConverter from '../../../../utils/mrkdwnConverter';

export default function faqView(questions: FaqItemDto[]) {
  return JSXSlack(
    <Blocks>
      <Section>:question: *Вопросы и ответы*</Section>
      <Divider/>
      {questions.map(question => (
        <Section>
          {MrkdwnConverter.convertFromMarkdown(
            question.question + '\n' + question.answer,
          )}
        </Section>
      ))}
    </Blocks>,
  );
}
