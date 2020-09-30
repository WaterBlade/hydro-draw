import { BoundingBox } from "../BoundingBox";
import { LineType } from "../LineType";
import { Vector } from "../Vector";

interface Paper {
  visitArc(item: DrawItem, insertPoint: Vector): void;
  visitArrow(item: DrawItem, insertPoint: Vector): void;
  visitCircle(item: DrawItem, insertPoint: Vector): void;
  visitDimAligned(item: DrawItem, insertPoint: Vector): void;
  visitLine(item: DrawItem, insertPoint: Vector): void;
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
}
