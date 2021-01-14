import { Vector, BoundingBox } from "@/draw/misc";
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
  mirrorByVAxis(x = 0): CompositeItem {
    const comp = new CompositeItem();
    comp.insertPoint = this.insertPoint.mirrorByVAxis(x);
    comp.push(...this.itemList.map((item) => item.mirrorByVAxis(0)));
    comp.lineType = this.lineType;
    return comp;
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
      throw Error("cannot calculate empty composite bounding box");
    }
    const boxs = this.itemList.map((item) => item.getBoundingBox());
    boxs.forEach((b) => b.move(this.insertPoint));
    const box = boxs.reduce((pre, cur) => pre.merge(cur));
    this._boundingBox = box;
    return box;
  }
}
