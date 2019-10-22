/** @jsx JSXSlack.h */
import RoomDto from '../../../../api-modules/booking/meetingRooms/rooms/dto/room.dto';
import { Blocks, Divider, JSXSlack, Section } from '@speee-js/jsx-slack';
import { RoomView } from './roomView';

export default function bookingView(rooms: RoomDto[]) {
  return JSXSlack(
    <Blocks>
      <Section><b>Выберите переговорку:</b></Section>
      <Divider/>
      {rooms.map(room => (
        <RoomView room={room}></RoomView>
      ))}
    </Blocks>,
  );
}
