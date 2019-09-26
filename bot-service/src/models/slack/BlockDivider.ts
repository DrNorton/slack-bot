import BaseBlock from './BaseBlock';

export default class BlockDivider extends BaseBlock {
  type: string;

  constructor() {
    super();
    this.type = 'divider';
  }
}
