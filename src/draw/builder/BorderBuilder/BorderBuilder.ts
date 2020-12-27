import { CompositeItem, DrawItem } from "@/draw/drawItem";
import { BoundingBox, vec } from "@/draw/misc";
import { Builder } from "../Builder.interface";
import { Container } from "./Container";


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
    public title?: DrawItem
  ) {}
}

class CenteredItemWrapper extends ItemWrapper{
  constructor(
    item: DrawItem,
    unitScale: number,
    drawScale: number,
    title?: DrawItem
  ){
    super(new CenterAlignedComposite(vec(0, 0), item), unitScale, drawScale, title);
  }
}

class CenterAlignedComposite extends CompositeItem {
  calcBoundingBox(): BoundingBox {
    const box = super.calcBoundingBox();
    const w = Math.max(Math.abs(box.left), Math.abs(box.right));
    box.left = -w;
    box.right = w;
    return box;
  }
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
    centerAligned = false,
    title?: DrawItem,
  ): void {
    if (centerAligned) {
      this.itemWrappers.push(
        new CenteredItemWrapper(item, unitScale, drawScale, title)
      );
    } else {
      this.itemWrappers.push(new ItemWrapper(item, unitScale, drawScale, title));
    }
  }
  addItemBuilder(builder: BorderItemBuilder, centerAligned = false): void {
    this.addItem(
      builder.generate(),
      builder.unitScale,
      builder.drawScale,
      centerAligned,
      builder.title
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
        this.drawScale / itemWrapper.drawScale 
        * itemWrapper.unitScale / this.unitScale;
      const item = itemWrapper.item;
      const title = itemWrapper.title;
      if(Math.abs(factor - 1) > 1e-6){
        item.scale(factor);
        if(title) title.scale(factor);
      }

      if (container.fill(item, title)) {
        continue;
      }else{
        if(!container.isEmpty()){
          const comp = container.generate();
          itemsInContainer.push(comp);
          allItems.push(comp);
        }
        container = this.genContainer();
        if(container.fill(item, title)){
          continue;
        }else{
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
