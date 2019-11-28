/** @jsx JSXSlack.h */
import { Divider, Input, JSXSlack, Modal, Textarea, UsersSelect } from '@speee-js/jsx-slack';
import { BookingDialogModel } from '../bookingByPickedRoom.controller';

export default function AdditionalPropertiesView(props: BookingDialogModel) {
  return JSXSlack(
    <Modal
      callbackId="completed_appointment"
      title="Бронирование переговорки"
      close="Закрыть"
    >
      <Divider/>
      <Input
        label="Название"
        name="title"
        blockId="titleBlock"
        maxLength={80}
        required
      />
      <Textarea
        label="Описание"
        name="description"
        blockId="descriptionBlock"
        placeholder="Описание?"
        maxLength={280}
        required
      />
      <Divider/>
      <Input type="hidden" name="roomId" value={props.roomId}/>
      <Input type="hidden" name="duration" value={props.duration}/>
      <Input type="hidden" name="date" value={props.date}/>
      <Input type="hidden" name="start" value={props.start}/>
      <Input type="hidden" name="end" value={props.end}/>
      <Input type="hidden" name="responseUrl" value={props.responseUrl}/>
      <Input blockId="members" label="Участники" title="Участники" required>
        <UsersSelect actionId="membersSelect" multiple/>
      </Input>
    </Modal>,
  );
}
