import BaseApiResponse from './base.api.response';
import { BaseController } from './base.controller';
import { Body, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { User } from '../../decorators/user.decorator';
import InstalledUserDto from '../install/dto/installedUser.dto';
import ICrudService from './crud.interface.service';

export abstract class BaseCrudController<DTO> extends BaseController {
  private service: ICrudService<DTO>;

  constructor(service: ICrudService<DTO>) {
    super();
    this.service = service;
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Список сущностей' })
  @Get()
  public async get(
    @User() user: InstalledUserDto,
  ): Promise<BaseApiResponse<DTO[]>> {
    const result = await this.service.getAll(user.teamId);
    return this.successResponse(result);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Получение сущности по идентификатору' })
  @Get('/:id')
  public async getById(
    @User() user: InstalledUserDto,
    @Param('id') id,
  ): Promise<BaseApiResponse<DTO>> {
    const result = await this.service.getById(user.teamId, id);
    return this.successResponse(result);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Добавить сущность' })
  @Put()
  public async add(
    @User() user: InstalledUserDto,
    @Body() added: DTO,
  ): Promise<BaseApiResponse<DTO>> {
    const result = await this.service.add(user.teamId, added);
    return this.successResponse(result);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Удалить сущность' })
  @Delete('/:id')
  public async delete(
    @User() user: InstalledUserDto,
    @Param('id') id,
  ): Promise<BaseApiResponse<boolean>> {
    const result = await this.service.deleteById(user.teamId, id);
    return this.successResponse(result);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Удалить сущности' })
  @Delete('items/:ids')
  public async deleteList(
    @User() user: InstalledUserDto,
    @Param('ids') ids: string,
  ): Promise<BaseApiResponse<boolean>> {
    const idsList = ids.split(',').map(x => parseInt(x, 10));
    const result = await this.service.deleteItems(user.teamId, idsList);
    return this.successResponse(result);
  }
}
