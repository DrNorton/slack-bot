import { BlockBaseElement } from './BlockBaseElement';

export default class ImageElement extends BlockBaseElement {
  type: string;
  image_url: string;
  alt_text: string;

  constructor() {
    super();
    this.type = 'image';
  }
}
