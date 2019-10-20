import BlockText from './BlockText';
import { BlockBaseElement } from './elements/BlockBaseElement';
import BaseBlock from './BaseBlock';

export default class BlockInput extends BaseBlock {
  type: string;
  element: BlockBaseElement;
  label: BlockText;
  constructor() {
    super();
    this.type = 'input';
  }
}
