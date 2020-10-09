import {
  Arc,
  Arrow,
  Circle,
  DimAligned,
  DrawItem,
  Line,
  VisitComposite,
  Text,
} from "../drawItem";
import { MText } from "../drawItem/MText";
import { Vector } from "../misc";

export abstract class Paper implements VisitComposite {
  itemList: DrawItem[] = [];
  push(...items: DrawItem[]): void {
    this.itemList.push(...items);
  }
  abstract pack(): string;
  abstract visitArc(arc: Arc, insertPoint: Vector): void;
  abstract visitArrow(arrow: Arrow, insertPoint: Vector): void;
  abstract visitCircle(circle: Circle, insertPoint: Vector): void;
  abstract visitDimAligned(dim: DimAligned, insertPoint: Vector): void;
  abstract visitLine(line: Line, insertPoint: Vector): void;
  abstract visitMText(mtext: MText, insertPoint: Vector): void;
  abstract visitText(text: Text, insertPoint: Vector): void;
}
