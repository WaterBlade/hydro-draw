import { Vector, BoundingBox, EmptyBox } from "@/draw/misc";
import { DrawItem } from "./DrawItem";
import { Paper } from "./Paper.interface";

export class CompositeItem extends DrawItem {
  itemList: DrawItem[] = [];
  protected _boundingBox?: BoundingBox;
  constructor(public insertPoint = new Vector(0, 0), ...items: DrawItem[]) {
    super();
    this.push(...items);
  }
  push(...items: DrawItem[]): void {
    this.itemList.push(...items);
    if (this._boundingBox) {
      this._boundingBox = items.reduce(
        (pre, cur) => pre.merge(cur.getBoundingBox()),
        this._boundingBox
      );
    }
  }
  accept(paper: Paper, insertPoint: Vector): void {
    const pt = this.insertPoint.add(insertPoint);
    for (const item of this.itemList) {
      item.accept(paper, pt);
    }
  }
  protected scaleItem(factor: number): void {
    this.insertPoint = this.insertPoint.mul(factor);
    for (const item of this.itemList) {
      item.scale(factor);
    }
  }
  protected moveItem(vec: Vector): void {
    this.insertPoint = this.insertPoint.add(vec);
  }
  calcBoundingBox(): BoundingBox {
    if (this.itemList.length === 0) {
      return new EmptyBox();
    }
    const boxs = this.itemList.map((item) => item.getBoundingBox());
    boxs.forEach((b) => b.move(this.insertPoint));
    const box = boxs.reduce((pre, cur) => pre.merge(cur));
    this._boundingBox = box;
    return box;
  }
}
