import { PaperMText } from "@/draw/drawItem";
import { CodeItem, GroupCode } from "../../GroupCode";
import { HandleItem } from "../../Handle";
import { Layer } from "../Tables";
import { Style } from "../Tables/Style";

export class DXFMText implements HandleItem, CodeItem {
  constructor(
    public text: PaperMText,
    public handle: string,
    public layer: Layer,
    public style: Style,
  ) { }
  toCode(root: GroupCode): void {
    const text = this.text;
    const content = text.content.join('\\P');
    root.push(
      0, 'MTEXT',
      5, this.handle,
      8, this.layer.name,
      7, this.style.name,
      100, 'AcDbEntity',
      100, 'AcDbMText',
      40, text.height,
      10, text.insertPoint.x,
      20, text.insertPoint.y,
      30, 0,
      41, text.width,
      71, 1);
    if (content.length < 250) {
      root.push(1, content);
    }
    else {
      for (let i = 0; i < content.length - 250; i += 250) {
        const subText = content.slice(i, i + 250);
        root.push(3, subText);
      }
      root.push(1, content.slice(-content.length % 250));
    }
  }
}