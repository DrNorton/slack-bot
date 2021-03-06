import { ApiBearerAuth, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import AppointmentDto from './dto/appointment.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../../decorators/user.decorator';
import InstalledUserDto from '../../install/dto/installedUser.dto';
import BaseApiResponse from '../../base/base.api.response';
import { BaseController } from '../../base/base.controller';
import { SlotDto } from './dto/slot.dto';

@ApiBearerAuth()
@ApiUseTags('appointment')
@Controller('appointment')
export default class AppointmentController extends BaseController {
  constructor(private readonly appointmentService: AppointmentService) {
    super();
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Добавить запись' })
  @Put()
  public async add(
    @User() user: InstalledUserDto,
    @Body() added: AppointmentDto,
  ): Promise<BaseApiResponse<AppointmentDto>> {
    const result = await this.appointmentService.createAppoinment(
      user.teamId,
      added,
    );
    return this.successResponse(result);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Получить все активные бронирования' })
  @Get()
  public async getAll(
    @User() user: InstalledUserDto,
  ): Promise<BaseApiResponse<AppointmentDto[]>> {
    const result = await this.appointmentService.getAll(user.teamId);
    return this.successResponse(result);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Получить слоты' })
  @Get('/slots/:date/:period')
  public async getSlots(
    @User() user: InstalledUserDto,
    @Param('roomId') roomId: number,
    @Param('date') date: Date,
    @Param('period') period: number,
  ): Promise<BaseApiResponse<SlotDto[]>> {
    const result = await this.appointmentService.getSlots(
      user.teamId,
      roomId,
      date,
      period,
    );
    return this.successResponse(result);
  }
}
