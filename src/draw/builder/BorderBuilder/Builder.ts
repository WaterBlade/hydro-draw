import { DrawItem } from "../..";
import { CompositeItem } from "../../drawItem";
import { BoundingBox } from "../../misc";
import { Builder } from "../Builder.interface";
import { Border, Boundary } from "./Border";

class BorderItem {
  constructor(
    public item: DrawItem,
    public unitScale: number,
    public drawScale: number
  ) {}
  getBoundingBox(): BoundingBox {
    return this.item.getBoundingBox();
  }
}

export abstract class BorderBuilder implements Builder<DrawItem[]> {
  borderItems: BorderItem[] = [];
  unitScale = 1;
  drawScale = 1;
  constructor(public width: number, public height: number) {}
  addItem(item: DrawItem, unitScale: number, drawScale: number): void {
    this.borderItems.push(new BorderItem(item, unitScale, drawScale));
  }
  abstract getBoundary(): Boundary;
  abstract composeBorder(rawContentList: CompositeItem[]): void;
  generate(): DrawItem[] {
    this.unitScale = this.borderItems[0].unitScale;
    this.drawScale = this.borderItems[0].drawScale;
    let border = new Border(this.getBoundary());

    const res: DrawItem[] = [];
    const rawContentList: CompositeItem[] = [];
    for (const borderItem of this.borderItems) {
      const box = borderItem.getBoundingBox();
      const item = borderItem.item;

      const factor =
        ((this.drawScale / borderItem.drawScale) * borderItem.unitScale) /
        this.unitScale;
      box.scale(factor);
      item.scale(factor);

      if (border.fillBox(box)) {
        border.fillItem(item);
        continue;
      }

      if (!border.isEmpty()) {
        border.plan();
        const rawContent = new CompositeItem();
        rawContent.push(...border.items);
        rawContentList.push(rawContent);
        res.push(rawContent);
      }

      border = new Border(this.getBoundary());
      if (border.fillBox(box)) {
        border.fillItem(item);
        continue;
      }

      res.push(borderItem.item);
    }

    if (!border.isEmpty()) {
      border.plan();
      const rawContent = new CompositeItem();
      rawContent.push(...border.items);
      rawContentList.push(rawContent);
      res.push(rawContent);
    }

    this.composeBorder(rawContentList);

    return res;
  }
}
