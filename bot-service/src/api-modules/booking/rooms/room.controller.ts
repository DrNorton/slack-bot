import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { BaseController } from '../../base/base.controller';
import { RoomsService } from './rooms.service';
import InstalledUserDto from '../../install/dto/installedUser.dto';
import { User } from '../../../decorators/user.decorator';
import RoomDto from './dto/room.dto';
import BaseApiResponse from '../../base/base.api.response';

@ApiBearerAuth()
@ApiUseTags('room')
@Controller('room')
export default class RoomController extends BaseController {
  constructor(private readonly roomService: RoomsService) {
    super();
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Список комнат' })
  @Get()
  public async get(
    @User() user: InstalledUserDto,
  ): Promise<BaseApiResponse<RoomDto[]>> {
    const result = await this.roomService.getAll(user.teamId);
    return this.successResponse(result);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Список комнат' })
  @Get('/:id')
  public async getById(
    @User() user: InstalledUserDto,
    @Param('id') id,
  ): Promise<BaseApiResponse<RoomDto>> {
    const result = await this.roomService.getById(id, user.teamId);
    return this.successResponse(result);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Добавить комнату' })
  @Put()
  public async add(
    @User() user: InstalledUserDto,
    @Body() newRoom: RoomDto,
  ): Promise<BaseApiResponse<RoomDto>> {
    const result = await this.roomService.add(newRoom, user.teamId);
    return this.successResponse(result);
  }
}
