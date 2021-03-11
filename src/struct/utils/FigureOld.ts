import { BorderItem } from "@/draw";
import { FigureContent } from "./FigureContent";

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
  clear(): void {
    this._id = 0;
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
  clear(): void {
    this._id = 0;
  }
}
export class FigureContainer {
  protected records: BorderItem[] = [];
  protected specIdGen = new SpecIdGen();
  protected sectIdGen = new SectIdGen();
  get figures(): BorderItem[] {
    return this.records;
  }
  get specId(): { id: string; title: string } {
    return this.specIdGen.gen();
  }
  get sectId(): { id: string; title: string } {
    return this.sectIdGen.gen();
  }
  record(...figs: BorderItem[]): void {
    this.records.push(...figs);
  }
  clear(): void {
    this.specIdGen.clear();
    this.sectIdGen.clear();
    this.records.splice(0);
  }
}

export class FigureOld {
  protected _fig?: FigureContent;
  get fig(): FigureContent {
    if (!this._fig) throw Error("fig not init");
    return this._fig;
  }
  set fig(val: FigureContent) {
    this._fig = val;
  }
  constructor(protected container: FigureContainer) {}
}
