import { LineType, Vector, BoundingBox } from "@/draw/misc";
import { Paper, PaperDrawItem } from "./Paper.interface";

export abstract class DrawItem implements PaperDrawItem {
  lineType = LineType.Thin;
  abstract accept(paper: Paper): void;
  scale(factor: number): void {
    if (this._boundingBox) this._boundingBox.scale(factor);
    this.scaleItem(factor);
  }
  protected abstract scaleItem(factor: number): void;
  move(vec: Vector): void {
    if (this._boundingBox) this._boundingBox.move(vec);
    this.moveItem(vec);
  }
  abstract mirrorByVAxis(x: number): DrawItem;
  protected abstract moveItem(v: Vector): void;
  getBoundingBox(): BoundingBox {
    if (this._boundingBox) return this._boundingBox;
    const box = this.calcBoundingBox();
    this._boundingBox = box;
    return box;
  }
  protected abstract calcBoundingBox(): BoundingBox;
  protected _boundingBox?: BoundingBox;
  protected moveBoundingBox(v: Vector): void {
    if (this._boundingBox) this._boundingBox.move(v);
  }
  protected scaleBoundingBox(factor: number): void {
    if (this._boundingBox) this._boundingBox.scale(factor);
  }
  moveCenterTo(pt: Vector): this {
    this.move(pt.sub(this.getBoundingBox().Center));
    return this;
  }
  moveBottomCenterTo(pt: Vector): this {
    this.move(pt.sub(this.getBoundingBox().BottomCenter));
    return this;
  }
  moveTopCenterTo(pt: Vector): this {
    this.move(pt.sub(this.getBoundingBox().TopCenter));
    return this;
  }
  thinLine(): this {
    this.lineType = LineType.Thin;
    return this;
  }
  middleLine(): this {
    this.lineType = LineType.Middle;
    return this;
  }
  thickLine(): this {
    this.lineType = LineType.Thick;
    return this;
  }
  thickerLine(): this {
    this.lineType = LineType.Thicker;
    return this;
  }
  dashedLine(): this {
    this.lineType = LineType.Dashed;
    return this;
  }
  centeredLine(): this {
    this.lineType = LineType.Centered;
    return this;
  }
  greyLine(): this {
    this.lineType = LineType.Grey;
    return this;
  }
}
