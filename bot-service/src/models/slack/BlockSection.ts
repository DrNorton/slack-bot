import BlockText from './BlockText';
import { BlockBaseElement } from './elements/BlockBaseElement';
import BaseBlock from './BaseBlock';

export default class BlockSection extends BaseBlock {
  type: string;
  text: BlockText;
  block_id?: string;
  fields: any;
  accessory: BlockBaseElement;

  constructor() {
    super();
    this.type = 'section';
  }
}
