/** @jsx JSXSlack.h */
import { Divider, Input, JSXSlack, Modal, Textarea, UsersSelect } from '@speee-js/jsx-slack';
import { BookingDialogModel } from '../booking.dialog.service';
import moment = require('moment');

export default function AdditionalPropertiesView(props: BookingDialogModel) {
  return JSXSlack(
    <Modal
      callbackId="booking_pick_room"
      title="Бронирование переговорки"
      close="Закрыть"
    >
      <Divider/>
      <Input label="Название" name="title" maxLength={80} required/>
      <Textarea
        label="Описание"
        name="description"
        placeholder="Описание?"
        maxLength={280}
        required
      />
      <Divider/>
      <Input type="hidden" name="roomId" value={props.roomId}/>
      <Input type="hidden" name="duration" value={props.duration}/>
      <Input type="hidden" name="date" value={props.date}/>
      <Input label="Участники" title="Участники" required>
        <UsersSelect multiple/>
      </Input>
    </Modal>,
  );
}

function getTimeFromDate(date: string) {
  const dateWithTime = moment(date, 'DD-MM-YYYY HH:mm');
  return dateWithTime.format('HH:mm');
}
