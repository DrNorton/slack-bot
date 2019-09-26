import { BlockBaseElement } from './BlockBaseElement';
import ConfirmDialogElement from './ConfirmDialogElement';
import BlockText from '../BlockText';

export default class BlockButtonElement extends BlockBaseElement {
  text: BlockText;
  action_id: string;
  url?: string;
  value?: string;
  style?: string;
  confirm: ConfirmDialogElement;
  type: string;

  constructor() {
    super();
    this.type = 'button';
  }
}
