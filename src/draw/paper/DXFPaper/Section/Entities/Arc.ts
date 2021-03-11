import { PaperArc } from "@/draw/drawItem";
import { RotateDirection } from "@/draw/misc";
import { CodeItem, GroupCode } from "../../GroupCode";
import { HandleItem } from "../../Handle";
import { Layer } from "../Tables/Layer";

export class DXFArc implements HandleItem, CodeItem {
  constructor(
    public arc: PaperArc,
    public handle: string,
    public layer: Layer
  ) {}
  toCode(root: GroupCode): void {
    const arc = this.arc;
    const isCounter = arc.direction === RotateDirection.counterclockwise;
    const startAngle = isCounter ? arc.startAngle : arc.endAngle;
    const endAngle = isCounter ? arc.endAngle : arc.startAngle;
    root.push(
      0,
      "ARC",
      5,
      this.handle,
      100,
      "AcDbEntity",
      100,
      "AcDbCircle",
      8,
      this.layer.name,
      10,
      arc.center.x,
      20,
      arc.center.y,
      30,
      0,
      40,
      this.arc.radius,
      100,
      "AcDbArc",
      50,
      startAngle,
      51,
      endAngle
    );
  }
}
