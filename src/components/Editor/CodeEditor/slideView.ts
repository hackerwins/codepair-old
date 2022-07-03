import { Marpit, RenderResult } from '@marp-team/marpit';

export default class SlideView {
  marpit: Marpit;

  theme: string;

  constructor(theme: string) {
    this.marpit = new Marpit({
      inlineSVG: true,
    });
    this.theme = theme;

    const slideTheme = `
    /* @theme example */
      section {
      background-color: #000;
      color: #fff;
      font-size: 30px;
      padding: 40px;
      margin: 10px;
      border: 10px solid black;
    }

    h1, h2 {
      text-align: center;
      margin: 0;
    }

    h1 {
      color: #fff;
    }
    `;
    this.marpit.themeSet.default = this.marpit.themeSet.add(slideTheme);
  }

  public render(markdown: string): RenderResult {
    return this.marpit.render(markdown);
  }
}
