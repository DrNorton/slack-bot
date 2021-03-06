import { Injectable } from '@nestjs/common';
import { RoomsService } from '../../../../../api-modules/booking/meetingRooms/rooms/rooms.service';
import selectRoomView from './views/selectRoomView';
import { DurationPicker } from './views/durationPicker';
import SlotsView from './views/slotsView';
import { AppointmentService } from '../../../../../api-modules/booking/appointments/appointment.service';
import AdditionalPropertiesView from './views/additionalPropertiesView';
import AppointmentDto from '../../../../../api-modules/booking/appointments/dto/appointment.dto';
import { ResultView } from './views/resultView';

export interface BookingDialogModel {
  teamId: string;
  roomId?: number;
  duration?: number;
  date?: Date;
  start?: Date;
  end?: Date;
  responseUrl: string;
}

@Injectable()
export default class BookingByPickedRoomController {
  constructor(
    private readonly roomService: RoomsService,
    private readonly appointmentService: AppointmentService,
  ) {
  }

  public async getRoomsDialog(model: BookingDialogModel) {
    const rooms = await this.roomService.getAll(model.teamId);
    return selectRoomView(rooms, model);
  }

  public async getDatePicker(model: BookingDialogModel) {
    const room = await this.roomService.getById(model.teamId, model.roomId);
    return DurationPicker({ room, model });
  }

  public async getResultView(teamId: string, appointment: AppointmentDto) {
    const room = await this.roomService.getById(teamId, appointment.roomId);
    return ResultView({ room, appointment });
  }

  public async getSlotsPicker(model: BookingDialogModel) {
    const slots = await this.appointmentService.getSlots(
      model.teamId,
      model.roomId,
      model.date,
      model.duration,
    );
    return SlotsView({ slots, model });
  }

  public async getAdditionalPropertiesPicker(model: BookingDialogModel) {
    return AdditionalPropertiesView(model);
  }

  public createAppointment(teamId: string, dto: AppointmentDto) {
    return this.appointmentService.createAppoinment(teamId, dto);
  }
}
