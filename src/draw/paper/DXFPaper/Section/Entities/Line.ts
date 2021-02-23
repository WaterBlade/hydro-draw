import { PaperLine } from "@/draw/drawItem";
import { CodeItem, GroupCode } from "../../GroupCode";
import { HandleItem } from "../../Handle";
import { Layer } from "../Tables";

export class DXFLine implements HandleItem, CodeItem {
  constructor(
    public line: PaperLine,
    public handle: string,
    public layer: Layer
  ) { }
  toCode(root: GroupCode): void {
    const line = this.line;
    root.push(
      0, 'LINE',
      5, this.handle,
      8, this.layer.name,
      100, 'AcDbEntity',
      100, 'AcDbLine',
      10, line.start.x,
      20, line.start.y,
      30, 0,
      11, line.end.x,
      21, line.end.y,
      31, 0);
  }
}