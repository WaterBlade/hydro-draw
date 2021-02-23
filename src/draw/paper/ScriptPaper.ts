import {
  Paper,
  PaperArc,
  PaperArrow,
  PaperCircle,
  PaperContent,
  PaperContentSpecial,
  PaperContentString,
  PaperDimAligned,
  PaperDrawItem,
  PaperLine,
  PaperMText,
  PaperPolyline,
  PaperText,
} from "@/draw/drawItem";
import {
  polar,
  LineType,
  RotateDirection,
  TextAlign,
} from "@/draw/misc";

export class ScriptPaper implements Paper {
  static ESCChar = "\u001b";

  itemList: PaperDrawItem[] = [];
  push(...items: PaperDrawItem[]): void {
    this.itemList.push(...items);
  }

  scriptList: string[] = [];
  generate(): string {
    this.initLayer();
    this.initTextStyle();
    for (const item of this.itemList) {
      item.accept(this);
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

  private currentLineType = LineType.Grey;
  private setLayer(lineType: LineType): void {
    if (this.currentLineType !== lineType) {
      this.scriptList.push(ScriptPaper.ESCChar + "-layer", "S", lineType, "");
      this.currentLineType = lineType;
    }
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
      case TextAlign.BottomLeft:
        align = "BL";
        break;
      case TextAlign.MiddleLeft:
        align = "ML";
        break;
      case TextAlign.TopLeft:
        align = "TL";
        break;
      case TextAlign.BottomCenter:
        align = "BC";
        break;
      case TextAlign.MiddleCenter:
        align = "MC";
        break;
      case TextAlign.TopCenter:
        align = "TC";
        break;
      case TextAlign.BottomRight:
        align = "BR";
        break;
      case TextAlign.MiddleRight:
        align = "MR";
        break;
      case TextAlign.TopRight:
        align = "TR";
        break;
    }
    this.scriptList.push("j", align);
  }

  visitArc(arc: PaperArc): void {
    this.setLayer(arc.lineType);
    const c = arc.center;
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

  visitArrow(arrow: PaperArrow): void {
    this.setLayer(arrow.lineType);
    this.scriptList.push(
      ScriptPaper.ESCChar + "pline",
      arrow.start.toFixed(4),
      "w",
      "0",
      arrow.width.toFixed(4),
      arrow.end.toFixed(4),
      "",
      "plinewid",
      "0"
    );
  }

  visitCircle(circle: PaperCircle): void {
    this.setLayer(circle.lineType);
    this.scriptList.push(
      ScriptPaper.ESCChar + "circle",
      circle.center.toFixed(4),
      circle.radius.toFixed(4)
    );
  }

  visitDimAligned(dim: PaperDimAligned): void {
    this.setLayer(dim.lineType);

    if (this.isUsedDimStyle(dim.unitScale, dim.borderScale, dim.drawScale)) {
      this.setDimStyle(dim.unitScale, dim.borderScale, dim.drawScale);
    } else {
      this.addDimStyle(dim.unitScale, dim.borderScale, dim.drawScale);
    }

    this.scriptList.push(
      ScriptPaper.ESCChar + "dimaligned",
      dim.start.toFixed(4),
      dim.end.toFixed(4)
    );

    if (dim.override) {
      this.scriptList.push("T", dim.override.accept(this));
    }

    this.scriptList.push(dim.textPoint.toFixed(4));
  }

  visitLine(line: PaperLine): void {
    this.setLayer(line.lineType);
    this.scriptList.push(
      ScriptPaper.ESCChar + "line",
      line.start.toFixed(4),
      line.end.toFixed(4),
      ""
    );
  }

  visitMText(mtext: PaperMText): void {
    this.setLayer(mtext.lineType);
    this.scriptList.push(
      ScriptPaper.ESCChar + "-mtext",
      mtext.insertPoint.toFixed(4),
      "s",
      "hz",
      "h",
      mtext.height.toFixed(4),
      "l",
      "e",
      mtext.rowSpace.toFixed(4),
      "w",
      mtext.width.toFixed(4),
      ...mtext.content,
      "",
      ""
    );
  }

  visitPolyline(pline: PaperPolyline): void {
    for (const seg of pline.segments) {
      seg.accept(this);
    }
  }

  visitText(text: PaperText): void {
    this.setLayer(text.lineType);
    this.scriptList.push(ScriptPaper.ESCChar + "-text", "s", "hz");
    this.setTextAlign(text.textAlign);
    this.scriptList.push(
      text.insertPoint.toFixed(4),
      text.height.toFixed(4),
      text.rotateAngle.toFixed(4),
      text.content.accept(this)
    );
  }

  visitString(content: PaperContentString): string {
    return content.content;
  }

  visitSpecial(content: PaperContentSpecial): string {
    switch (content.content) {
      case "HPB300":
        return "%%c";
      case "HRB400":
        return "%%133";
      default:
        return "";
    }
  }

  visitContent(content: PaperContent): string {
    return content.contents
      .map((c) => c.accept(this))
      .reduce((pre, cur) => pre + cur);
  }
}
