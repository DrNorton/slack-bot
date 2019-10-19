import { Injectable } from '@nestjs/common';
import ICrudService from '../../base/crud.interface.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentEntity } from './entity/appointment.entity';
import AppointmentDto from './dto/appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepository: Repository<AppointmentEntity>,
  ) {}

  public async createAppoinment(
    teamId: string,
    dto: AppointmentDto,
  ): Promise<AppointmentDto> {
    const newAppointment = AppointmentEntity.fromDto(teamId, dto);
    const appointment = await this.appointmentRepository.save(newAppointment);
    return appointment.toDto();
  }

  public async getAll(teamId: string): Promise<AppointmentDto[]> {
    const appointments = await this.appointmentRepository.find();
    return appointments.map(appointment => appointment.toDto());
  }
}
