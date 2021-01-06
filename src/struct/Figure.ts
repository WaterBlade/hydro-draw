import {
  BoundingBox,
  CompositeItem,
  Content,
  DrawItem,
  Line,
  vec,
  Text,
  TextAlign,
  BorderBuilder,
  RebarTable,
  RebarSpec,
  MaterialTable,
} from "@/draw";


export interface FigureInBorder {
  pushTo(border: BorderBuilder): this;
}
export class Figure implements FigureInBorder {
  protected _unitScale = 1;
  protected _drawScale = 1;
  protected _titleHeight = 1;
  protected _textHeight = 1;
  protected _numberHeight = 1;
  protected _drawRadius = 1;
  protected _centerAligned = false;
  protected _displayScale = false;
  protected _titlePosKeep = false;
  protected _content?: string | Content;
  centerAligned(): this {
    this._centerAligned = true;
    return this;
  }
  displayScale(): this {
    this._displayScale = true;
    return this;
  }
  keepTitlePos(): this {
    this._titlePosKeep = true;
    return this;
  }
  title(
    content: string | Content,
  ): this {
    this._content = content;
    return this;
  }
  reset(unitScale = 1, drawScale = 1): this {
    this._unitScale = unitScale;
    this._drawScale = drawScale;
    this._titleHeight = (5.0 * drawScale) / unitScale;
    this._textHeight = (3 * drawScale) / unitScale;
    this._numberHeight = (2.5 * drawScale) / unitScale;
    this._drawRadius = (0.25 * drawScale) / unitScale;
    return this;
  }
  get unitScale(): number {
    return this._unitScale;
  }
  get drawScale(): number {
    return this._drawScale;
  }
  get titleHeight(): number {
    return this._titleHeight;
  }
  get textHeight(): number {
    return this._textHeight;
  }
  get numberHeight(): number {
    return this._numberHeight;
  }
  get drawRadius(): number {
    return this._drawRadius;
  }

  protected composite = new CompositeItem();
  push(...items: DrawItem[]): this {
    this.composite.push(...items);
    return this;
  }
  getBoundingBox(): BoundingBox {
    return this.composite.getBoundingBox();
  }
  pushTo(border: BorderBuilder): this {
    const title = this.genTitle();
    border.addItem(
      this.composite,
      this.unitScale,
      this.drawScale,
      title,
      this._centerAligned,
      this._titlePosKeep
    );
    return this;
  }

  genTitle(): CompositeItem | undefined {
    const content = this._content;
    if (content) {
      const comp = new CompositeItem();
      const pt = vec(0, 0);
      const h0 = this.titleHeight;
      const p0 = pt.sub(vec(0, 4 * h0));
      const l = content.length * h0;
      const s0 = p0.sub(vec(l / 2, 0)).sub(vec(0, 0.1 * h0));
      const s1 = s0.sub(vec(0, 0.25 * h0));
      comp.push(
        new Text(content, p0, h0, TextAlign.BottomCenter),
        new Line(s0, s0.add(vec(l, 0))).thickLine(),
        new Line(s1, s1.add(vec(l, 0)))
      );
      if (this._displayScale) {
        const h1 = this.textHeight;
        const p1 = p0.sub(vec(0, 0.45 * h0));
        comp.push(new Text(`1:${this.drawScale}`, p1, h1, TextAlign.TopCenter));
      }
      return comp;
    } else {
      return undefined;
    }
  }
}

export class RebarTableFigure implements FigureInBorder {
  protected table = new RebarTable();
  push(...specs: RebarSpec[]): this {
    this.table.push(...specs);
    return this;
  }
  pushTo(border: BorderBuilder): this {
    border.addItem(this.table.generate(), 1, 1);
    return this;
  }
}

export class MaterialTableFigure implements FigureInBorder {
  protected table = new MaterialTable();
  push(...specs: RebarSpec[]): this {
    this.table.push(...specs);
    return this;
  }
  pushTo(border: BorderBuilder): this {
    border.addItem(this.table.generate(), 1, 1);
    return this;
  }
}

export abstract class FigureContainer<T>{
  constructor(protected struct: T){}
  figures: FigureInBorder[] = [];
  push(...figs: FigureInBorder[]): this{
    this.figures.push(...figs);
    return this;
  }
  abstract build(): this;
}
