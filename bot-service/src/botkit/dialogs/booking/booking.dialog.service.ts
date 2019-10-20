import { Injectable } from '@nestjs/common';
import BaseBlock from '../../../models/slack/BaseBlock';
import { RoomsService } from '../../../api-modules/booking/meetingRooms/rooms/rooms.service';
import BlockTextTypes from '../../../models/slack/BlockTextTypes';
import BlockText from '../../../models/slack/BlockText';
import BlockSection from '../../../models/slack/BlockSection';
import BlockDivider from '../../../models/slack/BlockDivider';
import ImageElement from '../../../models/slack/elements/ImageElement';
import BlockAction from '../../../models/slack/BlockAction';
import BlockButtonElement from '../../../models/slack/elements/BlockButtonElement';
import BlockDatePicker from '../../../models/slack/elements/BlockDatePicker';
import BlockInput from '../../../models/slack/BlockInput';
import StaticSelect from '../../../models/slack/elements/StaticSelect';

@Injectable()
export default class BookingDialogService {
  constructor(private readonly roomService: RoomsService) {}

  public async getRoomsDialog(teamId: string) {
    const rooms = await this.roomService.getAll(teamId);
    const blocks: BaseBlock[] = [];
    const blockSection = new BlockSection();
    blockSection.text = new BlockText();
    blockSection.text.text = '\n\n *Выберите переговорку:*';
    blockSection.text.type = BlockTextTypes.Markdown;
    blocks.push(blockSection);
    const divider = new BlockDivider();
    blocks.push(divider);
    rooms.map(room => {
      const roomSection = this.createRoomSection(room);
      const actions = new BlockAction();
      const blockButton = new BlockButtonElement();
      blockButton.text = new BlockText();
      blockButton.value = room.id.toString();
      blockButton.text.text = 'Выбрать';
      blockButton.text.type = BlockTextTypes.PlainText;
      blockButton.action_id = 'picked_room';
      actions.elements.push(blockButton);

      blocks.push(roomSection);
      blocks.push(actions);
      blocks.push(divider);
    });

    return blocks;
  }

  private createRoomSection(room) {
    const roomSection = new BlockSection();
    roomSection.text = new BlockText();
    roomSection.text.type = BlockTextTypes.Markdown;
    roomSection.text.text = `*${room.name}* \n\n Описание переговорки`;
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
    timeSelect.label = new BlockText(
      BlockTextTypes.PlainText,
      'Выберите время:',
      true,
    );
    const select = new StaticSelect();
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
