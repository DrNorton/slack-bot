import BlockTextTypes from './BlockTextTypes';

export default class BlockText {
  type: BlockTextTypes;
  text: string;
  emoji?: boolean;
  verbatim?: boolean;
}
