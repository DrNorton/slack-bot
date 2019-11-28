/** @jsx JSXSlack.h */
import { Actions, Button, Divider, Input, JSXSlack, Modal, Section } from '@speee-js/jsx-slack';
import { SlotDto } from '../../../../../../api-modules/booking/appointments/dto/slot.dto';
import { BookingDialogModel } from '../bookingByPickedRoom.controller';
import moment = require('moment');

interface Props {
  slots: SlotDto[];
  model: BookingDialogModel;
}

export default function SlotsView(props: Props) {
  return JSXSlack(
    <Modal
      callbackId="booking_pick_room"
      title="Бронирование переговорки"
      close="Закрыть"
    >
      <Section>
        <b>Выберите время:</b>
      </Section>
      <Divider/>
      <Input type="hidden" name="roomId" value={props.model.roomId}/>
      <Input type="hidden" name="duration" value={props.model.duration}/>
      <Input type="hidden" name="date" value={props.model.date}/>
      <Input type="hidden" name="responseUrl" value={props.model.responseUrl}/>
      <Actions>
        {props.slots.map((slot, index) => (
          <Button
            actionId={`selected_slot_${index}`}
            value={JSON.stringify(slot)}
          >{`${getTimeFromDate(slot.start)} - ${getTimeFromDate(
            slot.end,
          )}`}</Button>
        ))}
      </Actions>
    </Modal>,
  );
}

function getTimeFromDate(date: string) {
  const dateWithTime = moment(date, 'DD-MM-YYYY HH:mm');
  return dateWithTime.format('HH:mm');
}
