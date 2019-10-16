import { Injectable } from '@nestjs/common';
import ICrudService from '../../base/crud.interface.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentEntity } from './entity/appointment.entity';
import AppointmentDto from './dto/appointment.dto';

@Injectable()
export class AppointmentService
  implements ICrudService<AppointmentDto> {
  add(teamId: string, dto: AppointmentDto): Promise<AppointmentDto> {
    return undefined;
  }

  deleteById(teamId: string, id: number): Promise<boolean> {
    return undefined;
  }

  deleteItems(teamId: string, id: number[]): Promise<boolean> {
    return undefined;
  }

  getAll(teamId: string): Promise<AppointmentDto[]> {
    return undefined;
  }

  getById(teamId: string, id: number): Promise<AppointmentDto> {
    return undefined;
  }
  constructor(
    @InjectRepository(AppointmentEntity)
    private readonly roomAttributeTypesRepository: Repository<AppointmentEntity>,
  ) {
  }
}
