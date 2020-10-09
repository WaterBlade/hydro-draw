import { CompositeItem, DrawItem } from "../drawItem";
import { vec } from "../misc";
import { Builder } from "./Builder.interface";

export class HLayoutBuilder implements Builder<CompositeItem> {
  items: DrawItem[] = [];
  constructor(public space = 0) {}
  push(...items: DrawItem[]): void {
    this.items.push(...items);
  }
  generate(): CompositeItem {
    let topLeft = vec(0, 0);
    for (const item of this.items) {
      const box = item.getBoundingBox();
      const v = topLeft.sub(box.topLeft);
      item.move(v);
      topLeft = topLeft.add(vec(box.width + this.space, 0));
    }

    const comp = new CompositeItem();
    comp.push(...this.items);
    return comp;
  }
}
