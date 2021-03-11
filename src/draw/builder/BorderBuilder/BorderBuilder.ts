import { CompositeItem, DrawItem } from "@/draw/drawItem";
import { Builder } from "../Builder.interface";
import { Container } from "./Container/Container";

export class BorderItem {
  constructor(
    public content: DrawItem,
    public title?: DrawItem,
    public unitScale = 1,
    public drawScale = 1,
    public centerAligned = false,
    public titlePosKeep = false,
    public baseAligned = false
  ) {}
}

export abstract class BorderBuilder implements Builder<DrawItem[]> {
  items: BorderItem[] = [];
  unitScale = 1;
  drawScale = 1;
  constructor(public widthFactor: number, public heightFactor: number) {}
  add(...items: BorderItem[]): void {
    this.items.push(...items);
  }
  addContent(content: DrawItem): void {
    this.items.push(new BorderItem(content));
  }
  abstract genContainer(): Container;
  abstract drawBorder(itemsInContainer: CompositeItem[]): void;
  generate(): DrawItem[] {
    this.unitScale = this.items[0].unitScale;
    this.drawScale = this.items[0].drawScale;
    let container = this.genContainer();

    const allItems: DrawItem[] = [];
    const itemsInContainer: CompositeItem[] = [];
    for (const item of this.items) {
      const factor =
        ((this.drawScale / item.drawScale) * item.unitScale) / this.unitScale;
      const content = item.content;
      const title = item.title;
      const centerAligned = item.centerAligned;
      const titlePosKeep = item.titlePosKeep;
      const baseAligned = item.baseAligned;

      if (Math.abs(factor - 1) > 1e-6) {
        content.scale(factor);
        if (title) title.scale(factor);
      }

      if (
        container.fill(content, title, centerAligned, titlePosKeep, baseAligned)
      ) {
        continue;
      } else {
        if (!container.isEmpty()) {
          const comp = container.generate();
          itemsInContainer.push(comp);
          allItems.push(comp);
        }
        container = this.genContainer();
        if (
          container.fill(
            content,
            title,
            centerAligned,
            titlePosKeep,
            baseAligned
          )
        ) {
          continue;
        } else {
          allItems.push(content);
        }
      }
    }

    if (!container.isEmpty()) {
      const comp = container.generate();
      itemsInContainer.push(comp);
      allItems.push(comp);
    }

    this.drawBorder(itemsInContainer);

    return allItems;
  }
}
