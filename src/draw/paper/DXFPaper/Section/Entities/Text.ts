import { PaperText } from "@/draw/drawItem";
import { CodeItem, GroupCode } from "../../GroupCode";
import { HandleItem } from "../../Handle";
import { Layer } from "../Tables";
import { Style } from "../Tables/Style";

export class DXFText implements HandleItem, CodeItem {
  constructor(
    public text: PaperText,
    public content: string,
    public handle: string,
    public layer: Layer,
    public style: Style,
    public hJustify: number,
    public vJustify: number
  ) { }
  toCode(root: GroupCode): void {
    const text = this.text;
    root.push(
      0, 'TEXT',
      5, this.handle,
      8, this.layer.name,
      100, 'AcDbEntity',
      100, 'AcDbText',
      1, this.content,
      50, text.rotateAngle,
      40, text.height,
      41, 0.7,
      72, this.hJustify,
      10, text.insertPoint.x,
      20, text.insertPoint.y,
      30, 0,
      11, text.insertPoint.x,
      21, text.insertPoint.y,
      31, 0,
      7, this.style.name,
      100, 'AcDbText',
      73, this.vJustify);
  }

}