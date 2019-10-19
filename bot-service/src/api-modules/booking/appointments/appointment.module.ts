import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import AppointmentController from './appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentEntity } from './entity/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentEntity])],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}
