import { BlockBaseElement } from './BlockBaseElement';
import ConfirmDialogElement from './ConfirmDialogElement';
import BlockText from '../BlockText';

export default class BlockButtonElement extends BlockBaseElement {
  text: BlockText | string;
  url?: string;
  value?: string;
  style?: string;
  confirm: ConfirmDialogElement;
  type: string;

  constructor(text: BlockText | string, value?: string, action_id?: string) {
    super();
    this.type = 'button';
    this.value = value;
    this.action_id = action_id;
  }
}
