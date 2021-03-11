import { PaperDimAligned } from "@/draw/drawItem";
import { CodeItem, GroupCode } from "../../GroupCode";
import { HandleItem } from "../../Handle";
import { DimStyle, Layer } from "../Tables";

export class DXFDimAligned implements HandleItem, CodeItem {
  constructor(
    public dim: PaperDimAligned,
    public override: string,
    public handle: string,
    public layer: Layer,
    public dimStyle: DimStyle
  ) {}
  toCode(root: GroupCode): void {
    const dim = this.dim;
    root.push(
      0,
      "DIMENSION",
      5,
      this.handle,
      8,
      this.layer.name,
      100,
      "AcDbEntity",
      100,
      "AcDbDimension",
      70,
      32,
      1,
      this.override,
      3,
      this.dimStyle.name,
      10,
      dim.textPoint.x,
      20,
      dim.textPoint.y,
      30,
      0,
      100,
      "AcDbAlignedDimension",
      50,
      dim.start.sub(dim.end).quadrantAngle(),
      13,
      dim.start.x,
      23,
      dim.start.y,
      33,
      0,
      14,
      dim.end.x,
      24,
      dim.end.y,
      34,
      0,
      100,
      "AcDbRotatedDimension"
    );
  }
}
