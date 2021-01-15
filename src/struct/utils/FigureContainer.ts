import { FigureInBorder } from "./Figure";

class SpecIdGen {
  protected _id = 0;
  protected _symbols = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "M",
    "N",
  ];
  gen(): { id: string; title: string } {
    const id = this._symbols[this._id++];
    return {
      id: `${id}`,
      title: `大样${id}`,
    };
  }
}

class SectIdGen {
  protected _id = 0;
  protected _symbols = ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ", "Ⅸ", "Ⅹ"];
  gen(): { id: string; title: string } {
    const id = this._symbols[this._id++];
    return {
      id: `${id}`,
      title: `${id}--${id}`,
    };
  }
}
export class FigureContainer {
  recordFigures: FigureInBorder[] = [];
  specId = new SpecIdGen();
  sectId = new SectIdGen();
  record(fig: FigureInBorder): void {
    this.recordFigures.push(fig);
  }
}
