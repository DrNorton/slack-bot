import {
  Post,
  Body,
  Controller,
  Get,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  Put,
  UseGuards,
} from '@nestjs/common';

import { ApiUseTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BaseController } from '../base/base.controller';
import { FaqService } from './faq.service';
import { FaqItemDto } from './dto/faqItem.dto';
import { QuestionDto } from './dto/question.dto';
import { TransofrmEntityToDtoInterceptor } from '../../interceptors/transform.interceptor';
import BaseApiResponse from '../base/base.api.response';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../decorators/user.decorator';
import InstalledUserDto from '../install/dto/installedUser.dto';

@ApiBearerAuth()
@ApiUseTags('faq')
@Controller('faq')
export class FaqController extends BaseController {
  constructor(private readonly faqService: FaqService) {
    super();
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Список вопросов' })
  @Get('/questions')
  public async getOnlyQuestions(@User() user: InstalledUserDto) {
    const result = await this.faqService.getQuestions();
    return this.successResponse(result);
  }
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Удалить  вопрос' })
  @Delete('/:id')
  public async delete(
    @User() user: InstalledUserDto,
    @Param('id') id,
  ): Promise<BaseApiResponse<any>> {
    await this.faqService.delete(id, user.teamId);
    return this.successResponse(null);
  }
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Список вопросов c ответами' })
  @Get()
  public async getQuestionsWithAnswers(@User() user: InstalledUserDto) {
    const result = await this.faqService.getQuestionsWithAnswers();
    return this.successResponse(result);
  }
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Список вопросов c ответами' })
  @Get()
  public async get(@User() user: InstalledUserDto) {
    const result = await this.faqService.getQuestionsWithAnswers();
    return this.successResponse(result);
  }
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Запрос вопроса' })
  @Get('/:faqId')
  public async getByStreamId(
    @User() user: InstalledUserDto,
    @Param('faqId') faqId,
  ) {
    const result = await this.faqService.getById(faqId, user.teamId);
    return this.successResponse(result);
  }
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Добавить новый вопрос' })
  @Post()
  public async insert(
    @User() user: InstalledUserDto,
    @Body() newItemFaq: FaqItemDto,
  ) {
    const result = await this.faqService.add(newItemFaq, user.teamId);
    return this.successResponse(result);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Обновить вопрос' })
  @Put()
  public async put(
    @User() user: InstalledUserDto,
    @Body() editStreamDto: FaqItemDto,
  ): Promise<BaseApiResponse<FaqItemDto>> {
    const result = await this.faqService.update(editStreamDto, user.teamId);
    return this.successResponse(result);
  }
}
