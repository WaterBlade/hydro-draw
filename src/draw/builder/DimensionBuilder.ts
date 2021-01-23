import { CompositeItem, Content, DimAligned } from "../drawItem";
import { vec, Vector } from "../misc";
import { Builder } from "./Builder.interface";

export class DimensionBuilder implements Builder<CompositeItem> {
  protected _textHeight: number;
  constructor(public unitScale = 1, public drawScale = 1) {
    this._textHeight = (2.5 * drawScale) / unitScale;
  }
  protected _dims: DimAligned[] = [];
  generate(): CompositeItem {
    const c = new CompositeItem();
    c.push(...this._dims);
    return c;
  }
  protected _dir: Vector = vec(1, 0);
  protected _normOut: Vector = vec(0, 1);
  protected _pt: Vector = vec(0, 0);
  protected _start: Vector = vec(0, 0);
  hBottom(x: number, y: number): this {
    this._dir = vec(1, 0);
    this._start = vec(x, y);
    this._pt = this._start;
    this._normOut = vec(0, -1);
    return this;
  }
  hTop(x: number, y: number): this {
    this._dir = vec(1, 0);
    this._start = vec(x, y);
    this._pt = this._start;
    this._normOut = vec(0, 1);
    return this;
  }
  vLeft(x: number, y: number): this {
    this._dir = vec(0, -1);
    this._start = vec(x, y);
    this._pt = this._start;
    this._normOut = vec(-1, 0);
    return this;
  }
  vRight(x: number, y: number): this {
    this._dir = vec(0, -1);
    this._start = vec(x, y);
    this._pt = this._start;
    this._normOut = vec(1, 0);
    return this;
  }
  dim(dist: number, override?: Content | string): this {
    const start = this._pt;
    const end = this._pt.add(this._dir.mul(dist));
    const textPt = start
      .add(end)
      .mul(0.5)
      .add(this._normOut.mul(this._textHeight));
    this._dims.push(
      new DimAligned(
        start,
        end,
        textPt,
        this.unitScale,
        this.drawScale,
        override
      )
    );
    this._pt = end;
    return this;
  }
  next(): this {
    this._start = this._start.add(this._normOut.mul(this._textHeight * 2));
    this._pt = this._start;
    return this;
  }
  skip(dist: number): this{
    this._pt = this._pt.add(this._dir.mul(dist));
    return this;
  }
}
