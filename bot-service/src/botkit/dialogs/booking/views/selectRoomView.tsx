/** @jsx JSXSlack.h */
import RoomDto from '../../../../api-modules/booking/meetingRooms/rooms/dto/room.dto';
import { Actions, Button, Divider, Fragment, JSXSlack, Modal, Section } from '@speee-js/jsx-slack';
import { RoomFragment } from './roomFragment';

export default function selectRoomView(rooms: RoomDto[]) {
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
            <Button actionId={`select_room_${room.id}`} value={room.id.toString()}>
              Выбрать
            </Button>
          </Actions>
          <Divider/>
        </Fragment>
      ))}
    </Modal>,
  );
}
