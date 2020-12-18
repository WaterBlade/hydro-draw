import { Vector, BoundingBox } from "@/draw/misc";
import { DrawItem } from "./DrawItem";
import { Paper } from "./Paper.interface";

export class CompositeItem extends DrawItem {
  itemList: DrawItem[] = [];
  constructor(public insertPoint = new Vector(0, 0)) {
    super();
  }
  push(...items: DrawItem[]): void {
    this.itemList.push(...items);
  }
  accept(paper: Paper, insertPoint: Vector): void {
    const pt = this.insertPoint.add(insertPoint);
    for (const item of this.itemList) {
      item.accept(paper, pt);
    }
  }
  scale(factor: number): void {
    this.insertPoint = this.insertPoint.mul(factor);
    for (const item of this.itemList) {
      item.scale(factor);
    }
  }
  move(vec: Vector): void {
    this.insertPoint = this.insertPoint.add(vec);
  }
  getBoundingBox(): BoundingBox {
    if (this.itemList.length === 0) {
      throw Error("empty composite try to compute bounding box");
    }
    const boxs = this.itemList.map((item) => item.getBoundingBox());
    boxs.forEach((b) => b.move(this.insertPoint));
    return boxs.reduce((pre, cur) => pre.merge(cur));
  }
}
