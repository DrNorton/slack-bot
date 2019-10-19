import BlockTextTypes from './BlockTextTypes';

export default class BlockText {
  type: BlockTextTypes;
  text: string;
  emoji?: boolean;
  verbatim?: boolean;

  constructor(type?: BlockTextTypes, text?: string, emoji?: boolean) {
    this.type = type;
    this.text = text;
    this.emoji = emoji;
  }
}
