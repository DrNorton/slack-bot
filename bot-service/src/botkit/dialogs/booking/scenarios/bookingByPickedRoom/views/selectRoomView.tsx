/** @jsx JSXSlack.h */
import RoomDto from '../../../../../../api-modules/booking/meetingRooms/rooms/dto/room.dto';
import { Actions, Button, Divider, Fragment, Input, JSXSlack, Modal, Section } from '@speee-js/jsx-slack';
import { RoomFragment } from './fragments/roomFragment';
import { BookingDialogModel } from '../bookingByPickedRoom.controller';

export default function selectRoomView(
  rooms: RoomDto[],
  model: BookingDialogModel,
) {
  return JSXSlack(
    <Modal
      callbackId="booking_pick_room"
      title="Бронирование переговорки"
      close="Закрыть"
    >
      <Section>
        <b>Выберите переговорку:</b>
      </Section>
      <Divider/>

      {rooms.map(room => (
        <Fragment>
          <RoomFragment room={room}></RoomFragment>
          <Actions>
            <Button
              actionId={`selected_room_${room.id}`}
              value={room.id.toString()}
            >
              Выбрать
            </Button>
          </Actions>
          <Divider/>
        </Fragment>
      ))}
      <Input type="hidden" name="responseUrl" value={model.responseUrl}/>
    </Modal>,
  );
}
