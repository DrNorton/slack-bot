import { BlockBaseElement } from './BlockBaseElement';
import BlockText from '../BlockText';

export default class StaticSelect extends BlockBaseElement {
  type: string;
  label: BlockText;
  placeholder: BlockText;
  options: { text: BlockText; value: string }[];

  constructor() {
    super();
    this.type = 'static_select';
    this.options = [];
  }
}
