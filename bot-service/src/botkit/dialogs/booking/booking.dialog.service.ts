import { Injectable } from '@nestjs/common';
import { RoomsService } from '../../../api-modules/booking/meetingRooms/rooms/rooms.service';
import selectRoomView from './views/selectRoomView';
import { BookingTimeView } from './views/bookingTimeView';
import SlotsView from './views/slotsView';
import { AppointmentService } from '../../../api-modules/booking/appointments/appointment.service';
import AdditionalPropertiesView from './views/additionalPropertiesView';

export interface BookingDialogModel {
  teamId: string;
  roomId?: number;
  duration?: number;
  date?: Date;
}

@Injectable()
export default class BookingDialogService {
  constructor(
    private readonly roomService: RoomsService,
    private readonly appointmentService: AppointmentService,
  ) {
  }

  public async getRoomsDialog(model: BookingDialogModel) {
    const rooms = await this.roomService.getAll(model.teamId);
    return selectRoomView(rooms);
  }

  public async getDatePicker(model: BookingDialogModel) {
    const room = await this.roomService.getById(model.teamId, model.roomId);
    return BookingTimeView({ room });
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
}
