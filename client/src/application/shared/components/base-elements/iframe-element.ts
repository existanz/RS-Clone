import DOMElement from './dom-element';
import { IFrameOptions } from '../../models/base-elements';

export default class IFrameElement extends DOMElement {
  constructor(parentNode: HTMLElement | null, options: IFrameOptions) {
    super(parentNode, {
      tagName: options.tagName,
      classList: options.classList,
      content: options.content,
    });

    this.node.setAttribute('frameborder', '0');

    if (options.id) {
      this.node.id = options.id;
    }

    if (options.src) {
      this.node.setAttribute('src', options.src);
    }
  }
}
