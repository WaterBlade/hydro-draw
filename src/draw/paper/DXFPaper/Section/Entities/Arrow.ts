import { PaperArrow } from "@/draw/drawItem";
import { CodeItem, GroupCode } from "../../GroupCode";
import { HandleItem } from "../../Handle";
import { Layer } from "../Tables";

export class DXFArrow implements HandleItem, CodeItem {
  constructor(
    public arrow: PaperArrow,
    public handle: string,
    public layer: Layer
  ) {}
  toCode(root: GroupCode): void {
    const arrow = this.arrow;

    root.push(
      0,
      "LWPOLYLINE",
      5,
      this.handle,
      8,
      this.layer.name,
      100,
      "AcDbEntity",
      100,
      "AcDbPolyline",
      90,
      2,
      10,
      arrow.start.x,
      20,
      arrow.start.y,
      40,
      0,
      41,
      arrow.width,
      10,
      arrow.end.x,
      20,
      arrow.end.y
    );
  }
}
