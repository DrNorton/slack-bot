import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentEntity } from './entity/appointment.entity';
import AppointmentDto from './dto/appointment.dto';
import { SlotDto } from './dto/slot.dto';
import moment = require('moment');

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepository: Repository<AppointmentEntity>,
  ) {
  }

  public async createAppoinment(
    teamId: string,
    dto: AppointmentDto,
  ): Promise<AppointmentDto> {
    const newAppointment = AppointmentEntity.fromDto(teamId, dto);
    const appointment = await this.appointmentRepository.save(newAppointment);
    const findedAppointment = await this.appointmentRepository.findOne(
      { id: appointment.id },
      { relations: ['members'] },
    );
    return findedAppointment.toDto();
  }

  public async getAll(teamId: string): Promise<AppointmentDto[]> {
    const appointments = await this.appointmentRepository.find({
      relations: ['members'],
    });
    return appointments.map(appointment => appointment.toDto());
  }

  public async getSlots(
    teamId: string,
    roomId: number,
    date: Date,
    period: number,
  ): Promise<SlotDto[]> {
    const intervals = this.intervals(period, date);
    return intervals;
  }

  private intervals(interval: number, day: Date): SlotDto[] {
    const start = moment(day, 'YYYY-MM-DD hh:mm a');
    const end = moment(day, 'YYYY-MM-DD hh:mm a');
    start.set({ hour: 0, minutes: 0 });
    end.set({ hour: 23, minutes: 59 });

    // round starting minutes up to nearest 15 (12 --> 15, 17 --> 30)
    // note that 59 will round up to 60, and moment.js handles that correctly
    start.minutes(Math.ceil(start.minutes() / 15) * 15);

    const result: SlotDto[] = [];

    const current = moment(start);

    while (current <= end) {
      const period = new SlotDto();
      period.start = current.format('DD-MM-YYYY HH:mm');
      current.add(interval, 'minutes');
      period.end = current.format('DD-MM-YYYY HH:mm');
      result.push(period);
    }

    return result;
  }
}
