import { Vector, BoundingBox } from "@/draw/misc";
import { DrawItem } from "./DrawItem";
import { Paper } from "./Paper.interface";

export class CompositeItem extends DrawItem {
  itemList: DrawItem[] = [];
  protected _boundingBox?: BoundingBox;
  constructor(...items: DrawItem[]) {
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
  accept(paper: Paper): void {
    for (const item of this.itemList) {
      item.accept(paper);
    }
  }
  mirrorByVAxis(x = 0): CompositeItem {
    const comp = new CompositeItem();
    comp.push(...this.itemList.map((item) => item.mirrorByVAxis(x)));
    comp.lineType = this.lineType;
    return comp;
  }
  protected scaleItem(factor: number): void {
    for (const item of this.itemList) {
      item.scale(factor);
    }
  }
  protected moveItem(vec: Vector): void {
    for(const item of this.itemList){
      item.move(vec);
    }
  }
  calcBoundingBox(): BoundingBox {
    if (this.itemList.length === 0) {
      throw Error("cannot calculate empty composite bounding box");
    }
    const boxs = this.itemList.map((item) => item.getBoundingBox());
    const box = boxs.reduce((pre, cur) => pre.merge(cur));
    this._boundingBox = box;
    return box;
  }
}
