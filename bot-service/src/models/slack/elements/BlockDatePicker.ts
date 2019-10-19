import { BlockBaseElement } from './BlockBaseElement';
import ConfirmDialogElement from './ConfirmDialogElement';
import BlockText from '../BlockText';

export default class BlockDatePicker extends BlockBaseElement {
  type: string;
  initial_date: string;
  placeholder: BlockText;

  constructor(initial_date?: string, placeholder?: BlockText) {
    super();
    this.type = 'datepicker';
    this.initial_date = initial_date;
    this.placeholder = placeholder;
  }
}
