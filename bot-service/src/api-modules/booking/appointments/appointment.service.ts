import { Injectable } from '@nestjs/common';
import ICrudService from '../../base/crud.interface.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentEntity } from './entity/appointment.entity';
import AppointmentDto from './dto/appointment.dto';
import moment = require('moment');

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

  public async getSlots(
    teamId: string,
    period: number,
  ): Promise<AppointmentDto[]> {
    const intervals = this.intervals(
      '2016-08-10 4:35:00 PM',
      '2016-08-10 8:06:00 PM',
    );
    return null;
  }

  private intervals(startString: string, endString: string) {
    const start = moment(startString, 'YYYY-MM-DD hh:mm a');
    const end = moment(endString, 'YYYY-MM-DD hh:mm a');

    // round starting minutes up to nearest 15 (12 --> 15, 17 --> 30)
    // note that 59 will round up to 60, and moment.js handles that correctly
    start.minutes(Math.ceil(start.minutes() / 15) * 15);

    const result = [];

    const current = moment(start);

    while (current <= end) {
      result.push(current.format('YYYY-MM-DD HH:mm'));
      current.add(15, 'minutes');
    }

    return result;
  }
}
