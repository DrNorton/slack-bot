/** @jsx JSXSlack.h */

import { Blocks, Context, Divider, JSXSlack, Section } from '@speee-js/jsx-slack';
import RoomDto from '../../../../../../api-modules/booking/meetingRooms/rooms/dto/room.dto';
import { RoomFragment } from './fragments/roomFragment';
import AppointmentDto from '../../../../../../api-modules/booking/appointments/dto/appointment.dto';
import moment = require('moment');

interface Props {
  room: RoomDto;
  appointment: AppointmentDto;
  children?: any;
}

export const ResultView = (props: Props) => {
  return JSXSlack(
    <Blocks>
      <Section>
        <b>✔ Переговорка забронирована</b>
      </Section>
      <Divider/>
      <RoomFragment room={props.room}></RoomFragment>
      <Divider/>
      <Section>
        <b>{formatDate(props.appointment)}</b>
        <br/>
        <p>Участники</p>
        <br/>
        {props.appointment.members.map(member => member.name)}
      </Section>

      <Context>
        {props.appointment.members.map(member => (
          <img src={member.avatarUrl} alt={member.name}/>
        ))}
        {`${props.appointment.members.length} участников`}
      </Context>
    </Blocks>,
  );
};

function formatDate(appointment: AppointmentDto) {
  const momentStart = moment(appointment.start);
  const momentEnd = moment(appointment.end);
  const date = momentStart.format('DD MMMM');
  const startTime = momentStart.format('hh:mm');
  const endTime = momentEnd.format('hh:mm');
  return `${date} ${startTime} - ${endTime}`;
}

const fix = JSXSlack;
