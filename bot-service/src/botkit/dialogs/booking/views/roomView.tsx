/** @jsx JSXSlack.h */

import RoomDto from '../../../../api-modules/booking/meetingRooms/rooms/dto/room.dto';
import { Actions, Button, Divider, Field, Fragment, Image, JSXSlack, Section } from '@speee-js/jsx-slack';

interface Props {
  room: RoomDto;
  children?: any;
}

export const RoomView = (props: Props) => (
  <Fragment>
    <Section>
      <b>{props.room.name}</b>
      <br/>
      Описание переговорки
      <Image src={props.room.image} alt={props.room.name}/>
      {props.room.attributes.map(attribute => (
        <Field>
          <b>{attribute.attributeType.name}</b>:<br/>
          {attribute.value}
        </Field>
      ))}
    </Section>
    <Actions>
      <Button actionId="picked_room">Выбрать</Button>
    </Actions>
    <Divider/>
  </Fragment>
);

const fix = JSXSlack;
