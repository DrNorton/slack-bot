/** @jsx JSXSlack.h */

import RoomDto from '../../../../../../api-modules/booking/meetingRooms/rooms/dto/room.dto';
import { DatePicker, Divider, Input, JSXSlack, Modal, Option, Section, Select } from '@speee-js/jsx-slack';
import { BookingDialogModel } from '../bookingByPickedRoom.controller';

interface Props {
  room: RoomDto;
  children?: any;
  model: BookingDialogModel;
}

export const DurationPicker = (props: Props) => {
  return JSXSlack(
    <Modal
      callbackId="booking_selected_time"
      title="Бронирование переговорки"
      close="Закрыть"
    >
      <Section>
        <b>Выберите дату:</b>
      </Section>
      <Divider/>
      <DatePicker blockId="date" required={true} label="Дата" name="date"/>
      <Select
        label="Продолжительность"
        placeholder="Продолжительность совещания"
        name="period"
        blockId="duration"
        title="Выберите продолжительность совещания"
        required
      >
        <Option value="30">30 минут</Option>
        <Option value="60">1</Option>
        <Option value="90">1.5 часа</Option>
        <Option value="120">2 часа</Option>
      </Select>
      <Input type="hidden" name="selectedRoom" value={props.room.id}/>
      <Input type="hidden" name="responseUrl" value={props.model.responseUrl}/>
    </Modal>,
  );
};

const fix = JSXSlack;
