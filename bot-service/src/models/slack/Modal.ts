import BlockText from './BlockText';
import { BlockBaseElement } from './elements/BlockBaseElement';
import BaseBlock from './BaseBlock';
import BlockButtonElement from './elements/BlockButtonElement';

export default class Modal extends BaseBlock {
  type: string;
  title: BlockText;
  blocks: BaseBlock[];
  submit?: BlockButtonElement;
  close: BlockButtonElement;

  constructor() {
    super();
    this.type = 'modal';
    this.blocks = [];
  }
}
