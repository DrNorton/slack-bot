import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param, Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EmojiService } from './emoji.service';
import { BaseController } from '../base/base.controller';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { User } from '../../decorators/user.decorator';
import InstalledUserDto from '../install/dto/installedUser.dto';
import { FaqItemDto } from '../faq/dto/faqItem.dto';
import BaseApiResponse from '../base/base.api.response';
import EmojiDto from './dto/emoji.dto';

@ApiBearerAuth()
@ApiUseTags('emoji')
@Controller('emoji')
export default class EmojiController extends BaseController {
  constructor(private readonly emojiService: EmojiService) {
    super();
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Список emoji с score' })
  @Get()
  public async get(@User() user: InstalledUserDto) {
    const result = await this.emojiService.getEmoji(user.teamId);
    return this.successResponse(result);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Add emoji' })
  @Put()
  public async put(@User() user: InstalledUserDto, @Body() emoji: EmojiDto) {
    const result = await this.emojiService.addEmoji(user.teamId, emoji);
    return this.successResponse(result);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Update emoji list' })
  @Post()
  public async post(@User() user: InstalledUserDto, @Body() emoji: EmojiDto[]) {
    const result = await this.emojiService.updateEmojiList(user.teamId, emoji);
    return this.successResponse(result);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Удалить эмодзи' })
  @Delete('/:name')
  public async delete(@User() user: InstalledUserDto, @Param('name') name) {
    const result = await this.emojiService.deleteEmoji(user.teamId, name);
    return this.successResponse(result);
  }
}
