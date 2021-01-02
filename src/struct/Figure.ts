import {
  BorderItemBuilder,
  BoundingBox,
  Builder,
  CompositeItem,
  Content,
  DrawItem,
  Line,
  Text,
  TextAlign,
  vec,
} from "@/draw";

export abstract class Figure
  implements Builder<CompositeItem>, BorderItemBuilder {
  protected _unitScale = 1;
  protected _drawScale = 1;
  protected titleHeight = 1;
  textHeight = 1;
  numberHeight = 1;
  drawRadius = 1;
  protected composite = new CompositeItem();
  push(...items: DrawItem[]): this {
    this.composite.push(...items);
    return this;
  }
  getBoundingBox(): BoundingBox {
    return this.composite.getBoundingBox();
  }

  protected resetHeight(): void {
    this.titleHeight = (5.0 * this._drawScale) / this._unitScale;
    this.textHeight = (3 * this._drawScale) / this._unitScale;
    this.numberHeight = (2.5 * this._drawScale) / this._unitScale;
    this.drawRadius = (0.2 * this._drawScale) / this._unitScale;
  }

  get drawScale(): number {
    return this._drawScale;
  }

  set drawScale(val: number) {
    this._drawScale = val;
    this.resetHeight();
  }

  get unitScale(): number {
    return this._unitScale;
  }

  set unitScale(val: number) {
    this._unitScale = val;
    this.resetHeight();
  }

  abstract generate(): CompositeItem;
  title?: DrawItem;
  setTitle(content: string | Content, displayScale = false): void {
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
    if (displayScale) {
      const h1 = this.textHeight;
      const p1 = p0.sub(vec(0, 0.45 * h0));
      comp.push(new Text(`1:${this.drawScale}`, p1, h1, TextAlign.TopCenter));
    }
    this.title = comp;
  }
}

export abstract class RebarFigure<T, U> extends Figure {
  constructor(public struct: T, public rebar: U) {
    super();
  }
}

export abstract class StructFigure<T> extends Figure {
  constructor(public struct: T) {
    super();
  }
}
