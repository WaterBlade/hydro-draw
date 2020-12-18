import {
  Paper,
  PaperContent,
  PaperContentSpecial,
  PaperContentString,
  SpecialSymbol,
} from "./Paper.interface";

export class Content implements PaperContent {
  contents: (ContentString | ContentSpecial)[] = [];
  get length(): number {
    return this.contents.map((c) => c.length).reduce((pre, cur) => pre + cur);
  }
  accept(paper: Paper): string {
    return paper.visitContent(this);
  }
  text(t: string): this {
    this.contents.push(new ContentString(t));
    return this;
  }
  special(t: SpecialSymbol): this {
    this.contents.push(new ContentSpecial(t));
    return this;
  }
}

export class ContentString implements PaperContentString {
  constructor(public content: string) {}
  get length(): number {
    return this.content.length;
  }
  accept(paper: Paper): string {
    return paper.visitString(this);
  }
}

export class ContentSpecial implements PaperContentSpecial {
  constructor(public content: SpecialSymbol) {}
  get length(): number {
    return 1;
  }
  accept(paper: Paper): string {
    return paper.visitSpecial(this);
  }
}
