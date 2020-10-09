import { LineType } from "../LineType";
import { Vector, BoundingBox } from "../misc";

interface Paper {
  visitArc(item: DrawItem, insertPoint: Vector): void;
  visitArrow(item: DrawItem, insertPoint: Vector): void;
  visitCircle(item: DrawItem, insertPoint: Vector): void;
  visitDimAligned(item: DrawItem, insertPoint: Vector): void;
  visitLine(item: DrawItem, insertPoint: Vector): void;
  visitMText(item: DrawItem, insertPoint: Vector): void;
  visitText(item: DrawItem, insertPoint: Vector): void;
}

export abstract class DrawItem {
  lineType = LineType.Thin;
  abstract accept(paper: Paper, insertPoint: Vector): void;
  abstract scale(factor: number): void;
  abstract move(vec: Vector): void;
  getBoundingBox(): BoundingBox {
    return new BoundingBox(0, 0, 0, 0);
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
