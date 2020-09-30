import { Arc, Arrow, Circle, DimAligned, Line, Text } from "../drawItem";
import { LineType } from "../LineType";
import { RotateDirection } from "../RotateDirection";
import { TextAlign } from "../TextAlign";
import { polar, Vector } from "../Vector";
import { Paper } from "./Paper";

export class ScriptPaper extends Paper {
  static ESCChar = "\u001b";

  scriptList: string[] = [];
  pack(): string {
    this.initLayer();
    this.initTextStyle();
    const pt = new Vector(0, 0);
    for (const item of this.itemList) {
      item.accept(this, pt);
    }
    this.finishScript();
    return this.scriptList.join("\r\n");
  }

  private finishScript(): void {
    this.scriptList.push("zoom", "E", "");
  }

  private initLayer(): void {
    this.addLayer(LineType.Thin, "green");
    this.addLayer(LineType.Middle, "yellow");
    this.addLayer(LineType.Thick, "red");
    this.addLayer(LineType.Thicker, "magenta");
    this.addLayer(LineType.Dashed, "blue");
    this.addLayer(LineType.Centered, "cyan");
    this.addLayer(LineType.Grey, "9");
  }

  private addLayer(name: string, color: string): void {
    this.scriptList.push("-layer", "m", name, "c", color, name, "");
  }

  private setLayer(lineType: LineType): void {
    this.scriptList.push(ScriptPaper.ESCChar + "-layer", "S", lineType, "");
  }

  dimStyleNameList: string[] = [];
  private genDimStyleName(
    unitscale: number,
    borderscale: number,
    drawscale: number
  ): string {
    if (borderscale === drawscale) {
      return `${unitscale.toFixed(0)}-${borderscale.toFixed(0)}`;
    } else {
      return `${unitscale.toFixed(0)}-${borderscale.toFixed(
        0
      )}-${drawscale.toFixed(0)}`;
    }
  }

  private isUsedDimStyle(
    unitscale: number,
    borderscale: number,
    drawscale: number
  ): boolean {
    return (
      this.dimStyleNameList.indexOf(
        this.genDimStyleName(unitscale, borderscale, drawscale)
      ) > -1
    );
  }

  private setDimStyle(
    unitscale: number,
    borderscale: number,
    drawscale: number
  ): void {
    this.scriptList.push(
      "-dimstyle",
      "r",
      this.genDimStyleName(unitscale, borderscale, drawscale)
    );
  }

  private addDimStyle(
    unitscale: number,
    borderscale: number,
    drawscale: number
  ): void {
    const linearFactor = (unitscale * drawscale) / borderscale;
    const scaleFactor = borderscale / unitscale;
    this.scriptList.push(
      "dimasz",
      "2.5",
      "dimtxsty",
      "HZ",
      "dimtxt",
      "2.5",
      "dimclrd",
      "256",
      "dimclre",
      "256",
      "dimclrt",
      "256",
      "dimdec",
      "0",
      "dimfrac",
      "0",
      "dimtfill",
      "0",
      "dimtmove",
      "1",
      "dimlfac",
      linearFactor.toFixed(4),
      "dimscale",
      scaleFactor.toFixed(4),
      "-dimstyle",
      "s",
      this.genDimStyleName(unitscale, borderscale, drawscale),
      ScriptPaper.ESCChar
    );
  }

  private initTextStyle(): void {
    this.scriptList.push(
      "-style",
      "hz",
      "simp1.shx,hztxt.shx",
      "0",
      "0.7",
      "0",
      "n",
      "n",
      "n"
    );
  }

  private setTextAlign(textAlign: TextAlign) {
    let align: string;
    switch (textAlign) {
      case TextAlign.LeftBottom:
        align = "LB";
        break;
      case TextAlign.LeftCenter:
        align = "LC";
        break;
      case TextAlign.LeftTop:
        align = "LT";
        break;
      case TextAlign.MiddleBottom:
        align = "MB";
        break;
      case TextAlign.MiddleCenter:
        align = "MC";
        break;
      case TextAlign.MiddleTop:
        align = "MT";
        break;
      case TextAlign.RightBottom:
        align = "RB";
        break;
      case TextAlign.RightCenter:
        align = "RC";
        break;
      case TextAlign.RightTop:
        align = "RT";
        break;
    }
    this.scriptList.push("j", align);
  }

  visitArc(arc: Arc, insertPoint: Vector): void {
    this.setLayer(arc.lineType);
    const c = arc.center.add(insertPoint);
    this.scriptList.push(ScriptPaper.ESCChar + "arc", "c", c.toFixed(4));
    if (arc.direction === RotateDirection.counterclockwise) {
      this.scriptList.push(
        c.add(polar(arc.radius, arc.startAngle)).toFixed(4),
        c.add(polar(arc.radius, arc.endAngle)).toFixed(4)
      );
    } else {
      this.scriptList.push(
        c.add(polar(arc.radius, arc.endAngle)).toFixed(4),
        c.add(polar(arc.radius, arc.startAngle)).toFixed(4)
      );
    }
  }

  visitArrow(arrow: Arrow, insertPoint: Vector): void {
    arrow;
    insertPoint;
    this.setLayer(arrow.lineType);
    this.scriptList.push(
      ScriptPaper.ESCChar + "pline",
      arrow.start.add(insertPoint).toFixed(4),
      "w",
      "0",
      arrow.width.toFixed(4),
      arrow.end.add(insertPoint).toFixed(4),
      "",
      "plinewid",
      "0"
    );
  }

  visitCircle(circle: Circle, insertPoint: Vector): void {
    this.setLayer(circle.lineType);
    this.scriptList.push(
      ScriptPaper.ESCChar + "circle",
      circle.center.add(insertPoint).toFixed(4),
      circle.radius.toFixed(4)
    );
  }

  visitDimAligned(dim: DimAligned, insertPoint: Vector): void {
    this.setLayer(dim.lineType);

    if (this.isUsedDimStyle(dim.unitScale, dim.borderScale, dim.drawScale)) {
      this.setDimStyle(dim.unitScale, dim.borderScale, dim.drawScale);
    } else {
      this.addDimStyle(dim.unitScale, dim.borderScale, dim.drawScale);
    }

    this.scriptList.push(
      ScriptPaper.ESCChar + "dimaligned",
      dim.start.add(insertPoint).toFixed(4),
      dim.end.add(insertPoint).toFixed(4)
    );

    if (dim.override) {
      this.scriptList.push("T", dim.override);
    }

    this.scriptList.push(dim.textPoint.add(insertPoint).toFixed(4));
  }

  visitLine(line: Line, insertPoint: Vector): void {
    this.setLayer(line.lineType);
    this.scriptList.push(
      ScriptPaper.ESCChar + "line",
      line.start.add(insertPoint).toFixed(4),
      line.end.add(insertPoint).toFixed(4),
      ""
    );
  }

  visitText(text: Text, insertPoint: Vector): void {
    this.setLayer(text.lineType);
    this.scriptList.push(ScriptPaper.ESCChar + "-text", "s", "hz");
    this.setTextAlign(text.textAlign);
    this.scriptList.push(
      text.insertPoint.add(insertPoint).toFixed(4),
      text.height.toFixed(4),
      text.rotateAngle.toFixed(4),
      text.content
    );
  }
}
