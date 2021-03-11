import { PaperCircle } from "@/draw/drawItem";
import { CodeItem, GroupCode } from "../../GroupCode";
import { HandleItem } from "../../Handle";
import { Layer } from "../Tables/Layer";

export class DXFCircle implements HandleItem, CodeItem {
  constructor(
    public circle: PaperCircle,
    public handle: string,
    public layer: Layer
  ) {}
  toCode(root: GroupCode): void {
    const arc = this.circle;
    root.push(
      0,
      "CIRCLE",
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
      this.circle.radius
    );
  }
}
