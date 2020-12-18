import { LineType, Vector, BoundingBox } from "@/draw/misc";
import { Paper, PaperDrawItem } from "./Paper.interface";

export abstract class DrawItem implements PaperDrawItem {
  lineType = LineType.Thin;
  abstract accept(paper: Paper, insertPoint: Vector): void;
  abstract scale(factor: number): void;
  abstract move(vec: Vector): void;
  abstract getBoundingBox(): BoundingBox;
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
