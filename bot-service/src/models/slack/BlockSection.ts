import BlockText from './BlockText';
import { BlockBaseElement } from './elements/BlockBaseElement';
import BaseBlock from './BaseBlock';

export default class BlockSection extends BaseBlock {
  type: string;
  text: BlockText;
  fields?: BlockBaseElement[];
  accessory: BlockBaseElement;

  constructor(text: BlockText) {
    super();
    this.type = 'section';
    this.text = text;
  }
}
