import { Marpit, RenderResult } from '@marp-team/marpit';
import { marpitPlugin } from '@marp-team/marpit/plugin';
import markdownItMermaid from '@liradb2000/markdown-it-mermaid';

const CustomMarkdownPlugin = marpitPlugin((md) => {
  // Compatible with markdown-it plugin
  md.use(markdownItMermaid, {
    startOnLoad: false,
    securityLevel: true,
    theme: 'dark',
    flowchart: {
      htmlLabels: false,
      useMaxWidth: true,
    },
  });
});

export default class SlideView {
  marpit: Marpit;

  theme: string;

  constructor(theme: string) {
    this.marpit = new Marpit({
      inlineSVG: true,
    });
    this.theme = theme;

    this.marpit.use(CustomMarkdownPlugin);

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
