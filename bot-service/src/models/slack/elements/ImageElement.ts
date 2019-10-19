import { BlockBaseElement } from './BlockBaseElement';

export default class ImageElement extends BlockBaseElement {
  type: string;
  image_url: string;
  alt_text: string;

  constructor(image_url?: string, alt_text?: string) {
    super();
    this.type = 'image';
    this.image_url = image_url;
    this.alt_text = alt_text;
  }
}
