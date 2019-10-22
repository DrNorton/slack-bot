import { Injectable } from '@nestjs/common';
import BaseBlock from '../../../models/slack/BaseBlock';
import { RoomsService } from '../../../api-modules/booking/meetingRooms/rooms/rooms.service';
import BlockTextTypes from '../../../models/slack/BlockTextTypes';
import BlockText from '../../../models/slack/BlockText';
import BlockSection from '../../../models/slack/BlockSection';
import BlockDivider from '../../../models/slack/BlockDivider';
import ImageElement from '../../../models/slack/elements/ImageElement';
import BlockDatePicker from '../../../models/slack/elements/BlockDatePicker';
import BlockInput from '../../../models/slack/BlockInput';
import StaticSelect from '../../../models/slack/elements/StaticSelect';
import bookingView from './views/bookingView';

@Injectable()
export default class BookingDialogService {
  constructor(private readonly roomService: RoomsService) {
  }

  public async getRoomsDialog(teamId: string) {
    const rooms = await this.roomService.getAll(teamId);
    return bookingView(rooms);
    /*const blocks: BaseBlock[] = [];

    blocks.push(
      new BlockSection(
        new BlockText(
          BlockTextTypes.Markdown,
          '\n\n *Выберите переговорку:*',
          true,
        ),
      ),
    );
    blocks.push(new BlockDivider());
    rooms.map(room => {
      const roomSection = this.createRoomSection(room);
      const actions = new BlockAction();
      const blockButton = new BlockButtonElement(
        new BlockText(BlockTextTypes.PlainText, 'Выбрать', true),
        room.id.toString(),
        'picked_room',
      );

      actions.elements.push(blockButton);

      blocks.push(roomSection);
      blocks.push(actions);
      blocks.push(new BlockDivider());
    });

    return blocks;*/
  }

  private createRoomSection(room) {
    const roomSection = new BlockSection(
      new BlockText(
        BlockTextTypes.Markdown,
        `*${room.name}* \n\n Описание переговорки`,
        true,
      ),
    );
    roomSection.accessory = new ImageElement(room.image, room.name);
    roomSection.fields = [];
    room.attributes.map(attribute => {
      roomSection.fields.push(
        new BlockText(
          BlockTextTypes.Markdown,
          `*${attribute.attributeType.name}:* \n ${attribute.value}`,
        ),
      );
    });
    return roomSection;
  }

  public async getDatePicker(teamId: string, roomId: number) {
    const room = await this.roomService.getById(teamId, roomId);
    const blocks: BaseBlock[] = [];

    blocks.push(this.createRoomSection(room));
    const datePicker = new BlockInput();
    datePicker.label = new BlockText();
    datePicker.label.text = 'Выберите дату:';
    datePicker.label.type = BlockTextTypes.PlainText;
    datePicker.element = new BlockDatePicker(
      '2019-10-18',
      new BlockText(BlockTextTypes.PlainText, 'Выберите дату'),
    );
    blocks.push(datePicker);

    const timeSelect = new BlockInput();
    timeSelect.block_id = 'time';
    timeSelect.label = new BlockText(
      BlockTextTypes.PlainText,
      'Выберите время:',
      true,
    );
    const select = new StaticSelect();
    timeSelect.block_id = 'period';
    select.placeholder = new BlockText(BlockTextTypes.PlainText, 'Время', true);
    select.options.push({
      text: new BlockText(BlockTextTypes.PlainText, '15 минут'),
      value: '15',
    });
    select.options.push({
      text: new BlockText(BlockTextTypes.PlainText, '30 минут'),
      value: '30',
    });
    timeSelect.element = select;
    blocks.push(timeSelect);

    const divider = new BlockDivider();
    blocks.push(divider);
    return blocks;
  }
}
