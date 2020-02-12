export class FileViewerElement extends HTMLElement {
  static readonly elementName = 'cpu-fileviewer';
  static readonly observedAttributes = ['src'];

  get src(): string {
    return this.getAttribute('src') || '';
  }

  set src(value: string) {
    this.setAttribute('src', value);
  }

  constructor() {
    super();

    this.attachShadow({ mode: 'open' }).innerHTML = ``;
  }

  attributeChangedCallback(name: typeof FileViewerElement.observedAttributes[number], oldValue: string | null, newValue: string | null) {
    switch (name) {
      case 'src':
        this.loadContent();
        break;
    }
  }

  private loadContent(): void {

  }
}
