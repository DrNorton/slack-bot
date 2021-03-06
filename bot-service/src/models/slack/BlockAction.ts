import BlockText from './BlockText';
import { BlockBaseElement } from './elements/BlockBaseElement';
import BaseBlock from './BaseBlock';

export default class BlockAction extends BaseBlock {
  type: string;
  elements: BlockBaseElement[];
  block_id: string;

  constructor() {
    super();
    this.type = 'actions';
    this.elements = [];
  }
}
