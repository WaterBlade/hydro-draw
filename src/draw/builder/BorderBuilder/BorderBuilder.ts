import { CompositeItem, DrawItem } from "@/draw/drawItem";
import { Builder } from "../Builder.interface";
import { Container } from "./Container/Container";

export interface BorderItemBuilder {
  generate(): CompositeItem;
  unitScale: number;
  drawScale: number;
  title?: DrawItem;
}

class ItemWrapper {
  constructor(
    public item: DrawItem,
    public unitScale: number,
    public drawScale: number,
    public title?: DrawItem,
    public centerAligned = false,
    public titlePosKeep = false,
    public baseAligned = false
  ) {}
}

export abstract class BorderBuilder implements Builder<DrawItem[]> {
  itemWrappers: ItemWrapper[] = [];
  unitScale = 1;
  drawScale = 1;
  constructor(public width: number, public height: number) {}
  addItem(
    item: DrawItem,
    unitScale: number,
    drawScale: number,
    title?: DrawItem,
    centerAligned = false,
    titlePosKeep = false,
    baseAligned = false,
  ): void {
    this.itemWrappers.push(
      new ItemWrapper(
        item,
        unitScale,
        drawScale,
        title,
        centerAligned,
        titlePosKeep,
        baseAligned
      )
    );
  }
  abstract genContainer(): Container;
  abstract genBorder(itemsInContainer: CompositeItem[]): void;
  generate(): DrawItem[] {
    this.unitScale = this.itemWrappers[0].unitScale;
    this.drawScale = this.itemWrappers[0].drawScale;
    let container = this.genContainer();

    const allItems: DrawItem[] = [];
    const itemsInContainer: CompositeItem[] = [];
    for (const itemWrapper of this.itemWrappers) {
      const factor =
        ((this.drawScale / itemWrapper.drawScale) * itemWrapper.unitScale) /
        this.unitScale;
      const item = itemWrapper.item;
      const title = itemWrapper.title;
      const centerAligned = itemWrapper.centerAligned;
      const titlePosKeep = itemWrapper.titlePosKeep;
      const baseAligned = itemWrapper.baseAligned;

      if (Math.abs(factor - 1) > 1e-6) {
        item.scale(factor);
        if (title) title.scale(factor);
      }

      if (container.fill(item, title, centerAligned, titlePosKeep, baseAligned)) {
        continue;
      } else {
        if (!container.isEmpty()) {
          const comp = container.generate();
          itemsInContainer.push(comp);
          allItems.push(comp);
        }
        container = this.genContainer();
        if (container.fill(item, title, centerAligned, titlePosKeep, baseAligned)) {
          continue;
        } else {
          allItems.push(item);
        }
      }
    }

    if (!container.isEmpty()) {
      const comp = container.generate();
      itemsInContainer.push(comp);
      allItems.push(comp);
    }

    this.genBorder(itemsInContainer);

    return allItems;
  }
}
