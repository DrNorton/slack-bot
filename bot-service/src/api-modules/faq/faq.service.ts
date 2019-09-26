import { Repository } from 'typeorm';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionEntity } from './entity/question.entity';
import { plainToClass } from 'class-transformer';
import { QuestionDto } from './dto/question.dto';
import { AnswerEntity } from './entity/answer.entity';
import { FaqItemDto } from './dto/faqItem.dto';
import { TeamEntity } from '../team/entity/team.entity';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
  ) {}

  public async getQuestions() {
    const questions = await this.questionRepository.find({
      order: { id: 'ASC' },
    });
    return questions.map(x => {
      const question = new QuestionDto();
      question.id = x.id;
      question.question = x.text;
      return question;
    });
  }

  public async getById(faqId: number, teamId: string) {
    const result = await this.questionRepository.findOne(
      { id: faqId },
      { relations: ['answer', 'team'] },
    );
    if (result && result.team.id) {
      return this.convertToDto(result);
    } else {
      throw new HttpException('Item not found', 404);
    }
  }

  public async getQuestionsWithAnswers() {
    const questionsWithAnswers = await this.questionRepository.find({
      relations: ['answer'],
      order: { id: 'ASC' },
    });
    return questionsWithAnswers.map(x => this.convertToDto(x));
  }

  public async add(newFaqItem: FaqItemDto, teamId: string) {
    let questionEntity = new QuestionEntity();
    questionEntity.text = newFaqItem.question;
    questionEntity.team = new TeamEntity();
    questionEntity.team.id = teamId;
    const answerEntity = new AnswerEntity();
    answerEntity.text = newFaqItem.answer;
    questionEntity.answer = answerEntity;
    questionEntity = await this.questionRepository.save(questionEntity);
    return this.convertToDto(questionEntity);
  }

  public async delete(id: number, teamId: string) {
    await this.questionRepository.delete({ id, team: { id: teamId } });
  }

  public async update(updatedFaqItem: FaqItemDto, teamId: string) {
    const updatedItem = await this.questionRepository.findOne(
      {
        id: updatedFaqItem.id,
      },
      { relations: ['answer', 'team'] },
    );
    if (updatedItem && updatedItem.team.id) {
      updatedItem.text = updatedFaqItem.question;
      updatedItem.answer.text = updatedFaqItem.answer;
      const result = await this.questionRepository.save(updatedItem);
      return this.convertToDto(result);
    } else {
      throw new HttpException('Item not found', 404);
    }
  }

  private convertToDto = (entity: QuestionEntity) => {
    const faqItemDto = new FaqItemDto();
    faqItemDto.id = entity.id;
    faqItemDto.question = entity.text;
    faqItemDto.answer = entity.answer.text;
    return faqItemDto;
  };
}
