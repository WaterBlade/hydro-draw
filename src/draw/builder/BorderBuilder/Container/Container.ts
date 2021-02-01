import { CompositeItem, DrawItem } from "@/draw/drawItem";
import { last, vec } from "@/draw/misc";
import { Boundary } from "../Boundary";
import { BoxContainer } from "./BoxContainer";
import { Cell } from "./Cell";
import { Column } from "./Column";
import { Row } from "./Row";

export class Container extends BoxContainer {
  boxs: Column[] = [];
  fillBorder: Boundary;
  constructor(public border: Boundary, widthFactor = 1, heightFactor = 1) {
    super(vec(border.left, border.top));
    this.fillBorder = border.clone();
    if (widthFactor !== 1 || heightFactor !== 1) {
      this.fillBorder.scaleBy(this.topLeft, widthFactor, heightFactor);
    }
  }
  protected resetSize(): void {
    this.width = last(this.boxs).right - this.topLeft.x;
    this.height = Math.max(...this.boxs.map((c) => c.height));
  }
  add(column: Column): void {
    this.boxs.push(column);
    this.resetSize();
  }
  protected needWrapColumn = true;
  fill(
    item: DrawItem,
    title?: DrawItem,
    centerAligned = false,
    titlePosKeep = false,
    baseAligned = false
  ): boolean {
    const cell = new Cell(
      item,
      title,
      centerAligned,
      titlePosKeep,
      baseAligned
    );

    const tail = last(this.boxs);
    if (tail) {
      if (this.boxs.length === 1) {
        if (tail.fill(cell)) {
          this.needWrapColumn = false;
          this.resetSize();
          return true;
        }
      } else {
        if (this.needWrapColumn) {
          const bottomRight = this.topLeft.add(
            vec(cell.width, -this.height - cell.height)
          );
          if (this.fillBorder.insideTest(bottomRight)) {
            const col = new Column(this.topLeft, this.fillBorder);
            const row = new Row(this.topLeft, this.fillBorder);
            for (const c of this.boxs) {
              row.fill(c.boxs[0].boxs[0]);
            }
            col.add(row);
            const rowBelow = new Row(
              vec(this.left, this.bottom),
              this.fillBorder
            );
            rowBelow.fill(cell);
            col.add(rowBelow);
            this.boxs = [col];
            this.needWrapColumn = false;
            this.resetSize();
            return true;
          }
        } else {
          if (tail.fill(cell)) {
            this.resetSize();
            return true;
          }
        }
      }
    }
    if (this.needWrapColumn && cell.height < 0.75 * this.height) {
      this.needWrapColumn = false;
    }
    const col = new Column(vec(this.right, this.top), this.fillBorder);
    if (col.fill(cell)) {
      this.add(col);
      return true;
    } else {
      return false;
    }
  }
  generate(): CompositeItem {
    const c = new CompositeItem();
    this.arrange();
    c.push(...this.getItems());
    return c;
  }
  arrange(): void {
    this.hArrange(this.border);
    this.boxs.forEach((col) => col.arrange(this.border));
    this.resetSize();
  }
}
