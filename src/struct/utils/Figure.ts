import { BorderItem, Content } from "@/draw";
import { ContextBuilder } from "@/draw/preset/Context";

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

export class FigureRoot {
  protected figures: Figure[] = [];
  init(): void {
    const specId = new SpecIdGen();
    const sectId = new SectIdGen();
    this.figures.forEach((f) => f.init(specId, sectId));
  }
  genBorderItems(): BorderItem[] {
    return this.figures.reduce(
      (pre: BorderItem[], cur) => pre.concat(cur.genBorderItems()),
      []
    );
  }
  protected add<S extends Figure>(fig: S): S {
    this.figures.push(fig);
    return fig;
  }
}

export class FigureConfig {
  constructor(
    public centerAligned = false,
    public titlePosKeep = false,
    public baseAligned = false
  ) {}
}

export interface FigureInterface {
  id: string;
}

export abstract class Figure {
  protected _id?: string;
  get id(): string {
    if (!this._id) throw Error("figure id not init");
    return this._id;
  }
  protected abstract unitScale: number;
  protected abstract drawScale: number;
  protected abstract title: string | Content;
  protected abstract config: FigureConfig;

  protected fig = new ContextBuilder();
  init(specId: SpecIdGen, sectId: SectIdGen): void {
    if (this.isExist()) {
      this.fig.reset(this.unitScale, this.drawScale);
      this.initSpec(specId);
      this.initSect(sectId);
    }
  }
  genBorderItems(): BorderItem[] {
    if (this.isExist()) {
      this.draw();
      const { centerAligned, baseAligned, titlePosKeep } = this.config;
      return [
        new BorderItem(
          this.fig.content,
          this.fig.title(this.title),
          this.unitScale,
          this.drawScale,
          centerAligned,
          titlePosKeep,
          baseAligned
        ),
      ];
    }
    return [];
  }
  protected abstract draw(): void;
  protected isExist(): boolean {
    return true;
  }
  protected initSpec(specId: SpecIdGen): void {
    // to override
    specId;
  }
  protected initSect(sectId: SectIdGen): void {
    // to override
    sectId;
  }
}

export abstract class SectFigure extends Figure {
  protected title = "";
  protected initSect(sectId: SectIdGen): void {
    const { id, title } = sectId.gen();
    this._id = id;
    this.title = title;
  }
}

export abstract class SpecFigure extends Figure {
  protected title = "";
  protected initSpec(specId: SpecIdGen): void {
    const { id, title } = specId.gen();
    this._id = id;
    this.title = title;
  }
}
