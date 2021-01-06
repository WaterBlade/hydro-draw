import { CompositeItem, Line, Text, MText } from "@/draw/drawItem";
import { vec, TextAlign } from "@/draw/misc";
import { Boundary } from "./Boundary";
import { BorderBuilder } from "./BorderBuilder";
import { Container } from "./Container";

function presetA0A1Title(
  company: string,
  project: string,
  drawingTitle: string,
  design: string,
  section: string,
  date: string,
  drawingNumber: string,
  certificateNumber: string
): CompositeItem {
  const comp = new CompositeItem();
  comp.push(
    new Line(vec(-180, 0), vec(-180, 71)).thickerLine(),
    new Line(vec(-180, 71), vec(0, 71)).thickerLine(),
    new Line(vec(-180, 56), vec(0, 56)),
    new Line(vec(-180, 49), vec(-110, 49)),
    new Line(vec(-180, 42), vec(0, 42)),
    new Line(vec(-180, 35), vec(-110, 35)),
    new Line(vec(-180, 28), vec(-110, 28)),
    new Line(vec(-180, 21), vec(-110, 21)),
    new Line(vec(-180, 14), vec(0, 14)),
    new Line(vec(-180, 7), vec(0, 7)),
    new Line(vec(-55, 49), vec(0, 49)),
    new Line(vec(-160, 56), vec(-160, 0)),
    new Line(vec(-125, 56), vec(-125, 7)),
    new Line(vec(-110, 56), vec(-110, 0)),
    new Line(vec(-55, 56), vec(-55, 42)),
    new Line(vec(-90, 14), vec(-90, 0)),
    new Line(vec(-55, 14), vec(-55, 7)),
    new Line(vec(-35, 14), vec(-35, 7)),
    new Text(company, vec(-90, 63.5), 5, TextAlign.MiddleCenter),
    new Text("批 准", vec(-170, 52.5), 3.5, TextAlign.MiddleCenter),
    new Text("核 定", vec(-170, 45.5), 3.5, TextAlign.MiddleCenter),
    new Text("审 查", vec(-170, 38.5), 3.5, TextAlign.MiddleCenter),
    new Text("校 核", vec(-170, 31.5), 3.5, TextAlign.MiddleCenter),
    new Text("设 计", vec(-170, 24.5), 3.5, TextAlign.MiddleCenter),
    new Text("制 图", vec(-170, 17.5), 3.5, TextAlign.MiddleCenter),
    new Text("描 图", vec(-170, 10.5), 3.5, TextAlign.MiddleCenter),
    new Text("CAD", vec(-142.5, 10.5), 3.5, TextAlign.MiddleCenter),
    new Text("设计证号", vec(-170, 3.5), 3.5, TextAlign.MiddleCenter),
    new Text(certificateNumber, vec(-135, 3.5), 3.5, TextAlign.MiddleCenter),
    new Text(project, vec(-82.5, 49), 4, TextAlign.MiddleCenter),
    new Text(`${design} 设计`, vec(-27.5, 52.5), 3.5, TextAlign.MiddleCenter),
    new Text(`${section} 部分`, vec(-27.5, 45.5), 3.5, TextAlign.MiddleCenter),
    new Text(drawingTitle, vec(-55, 28), 5, TextAlign.MiddleCenter),
    new Text("比例", vec(-100, 10.5), 3.5, TextAlign.MiddleCenter),
    new Text("如图", vec(-72.5, 10.5), 3.5, TextAlign.MiddleCenter),
    new Text("日期", vec(-45, 10.5), 3.5, TextAlign.MiddleCenter),
    new Text(date, vec(-17.5, 10.5), 3.5, TextAlign.MiddleCenter),
    new Text("图号", vec(-100, 3.5), 3.5, TextAlign.MiddleCenter),
    new Text(drawingNumber, vec(-45, 3.5), 3.5, TextAlign.MiddleCenter)
  );
  return comp;
}

function presetA2A3Title(
  company: string,
  project: string,
  drawingTitle: string,
  design: string,
  section: string,
  date: string,
  drawingNumber: string,
  certificateNumber: string
): CompositeItem {
  const comp = new CompositeItem();
  comp.push(
    new Line(vec(-120, 0), vec(-120, 68)).thickerLine(),
    new Line(vec(-120, 68), vec(0, 68)).thickerLine(),
    new Line(vec(-120, 56), vec(0, 56)),
    new Line(vec(-120, 49), vec(-70, 49)),
    new Line(vec(-120, 42), vec(0, 42)),
    new Line(vec(-120, 35), vec(-70, 35)),
    new Line(vec(-120, 28), vec(-70, 28)),
    new Line(vec(-120, 21), vec(-70, 21)),
    new Line(vec(-120, 14), vec(0, 14)),
    new Line(vec(-120, 7), vec(0, 7)),
    new Line(vec(-30, 49), vec(0, 49)),
    new Line(vec(-105, 56), vec(-105, 0)),
    new Line(vec(-80, 56), vec(-80, 7)),
    new Line(vec(-70, 56), vec(-70, 0)),
    new Line(vec(-30, 56), vec(-30, 42)),
    new Line(vec(-55, 14), vec(-55, 0)),
    new Line(vec(-35, 14), vec(-35, 7)),
    new Line(vec(-20, 14), vec(-20, 7)),
    new Text(company, vec(-60, 62), 5, TextAlign.MiddleCenter),
    new Text("批 准", vec(-112.5, 52.5), 3.5, TextAlign.MiddleCenter),
    new Text("核 定", vec(-112.5, 45.5), 3.5, TextAlign.MiddleCenter),
    new Text("审 查", vec(-112.5, 38.5), 3.5, TextAlign.MiddleCenter),
    new Text("校 核", vec(-112.5, 31.5), 3.5, TextAlign.MiddleCenter),
    new Text("设 计", vec(-112.5, 24.5), 3.5, TextAlign.MiddleCenter),
    new Text("制 图", vec(-112.5, 17.5), 3.5, TextAlign.MiddleCenter),
    new Text("描 图", vec(-112.5, 10.5), 3.5, TextAlign.MiddleCenter),
    new Text("CAD", vec(-92.5, 10.5), 3.5, TextAlign.MiddleCenter),
    new Text("设计证号", vec(-112.5, 3.5), 3.5, TextAlign.MiddleCenter),
    new Text(certificateNumber, vec(-87.5, 3.5), 3.5, TextAlign.MiddleCenter),
    new Text(project, vec(-50, 49), 4, TextAlign.MiddleCenter),
    new Text(`${design} 设计`, vec(-15, 52.5), 3.5, TextAlign.MiddleCenter),
    new Text(`${section} 部分`, vec(-15, 45.5), 3.5, TextAlign.MiddleCenter),
    new Text(drawingTitle, vec(-35, 28), 5, TextAlign.MiddleCenter),
    new Text("比例", vec(-62.5, 10.5), 3.5, TextAlign.MiddleCenter),
    new Text("如图", vec(-45, 10.5), 3.5, TextAlign.MiddleCenter),
    new Text("日期", vec(-27.5, 10.5), 3.5, TextAlign.MiddleCenter),
    new Text(date, vec(-10, 10.5), 3.5, TextAlign.MiddleCenter),
    new Text("图号", vec(-62.5, 3.5), 3.5, TextAlign.MiddleCenter),
    new Text(drawingNumber, vec(-27.5, 3.5), 3.5, TextAlign.MiddleCenter)
  );
  return comp;
}

export abstract class HydroBorderBuilder extends BorderBuilder {
  company = "（单位名称）";
  project = "（工程名）";
  drawingTitle = "（图名）";
  design = "技施";
  section = "水工";
  date = "（20XX.XX）";
  drawingNumberPrefix = "（XX-XX）";
  drawingNumberStart = 1;
  certificateNumber = "(设计证号)";

  note: string[] = ["图纸说明"];

  constructor(
    public height: number,
    public width: number,
    public space: number,
    public bindSpace: number,
    public titleHeight: number,
    public titleWidth: number
  ) {
    super(0, 0);
  }

  protected genFirstNote(): MText{
    const textHeight = 3.5;
    const maxNoteWidth = 100;
    const mtext = new MText(
      ["说明：", ...this.note.map((n, i) => `${i + 1}.` + n)],
      vec(0, 0),
      textHeight,
      maxNoteWidth
    );
    const box = mtext.getBoundingBox();
    const w = this.width;
    const c = this.space;
    const th = this.titleHeight;
    const tw = this.titleWidth;
    if (box.height < th) {
      mtext.move(
        vec(w - c - tw - textHeight, c + textHeight).sub(box.BottomRight)
      );
    } else {
      mtext.move(
        vec(w - c - textHeight, th + textHeight).sub(box.BottomRight)
      );
    }
    return mtext;
  }

  protected genOtherNote(): MText{
    const textHeight = 3.5;
    const maxNoteWidth = 100;
    const mtext = new MText(
      ["说明：", "1.详见本套图中第一张图纸说明；"],
      vec(0, 0),
      textHeight,
      maxNoteWidth
    );
    const box = mtext.getBoundingBox();
    const w = this.width;
    const c = this.space;
    const tw = this.titleWidth;
    mtext.move(
      vec(w - c - tw - textHeight, c + textHeight).sub(box.BottomRight)
    );
    return mtext;
  }

  protected isFirstBoundary = true;
  protected genBoundary(): Boundary {
    const h = this.height;
    const w = this.width;
    const a = this.bindSpace;
    const c = this.space;
    const th = this.titleHeight;
    const tw = this.titleWidth;
    const boundary = new Boundary(vec(a, c));
    if (this.isFirstBoundary) {
      this.isFirstBoundary = false;
      const box = this.genFirstNote().getBoundingBox();
      if (box.top < c + this.titleHeight) {
        boundary.corner(box.left - a, box.top - c);
        boundary.corner(w-tw-c-box.left, th+c - box.top);
        boundary.corner(tw, h - 2 * c - th);
      } else {
        boundary.corner(w - a - c - tw, th);
        boundary.corner(box.left - (w - tw - c), box.top - (c+th));
        boundary.corner( w-c-box.left, h-c - box.top);
      }
    } else {
      const box = this.genOtherNote().getBoundingBox();
      boundary.corner(box.left - a, box.top - c);
      boundary.corner(w - tw - c - box.left, th + c - box.top);
      boundary.corner(tw, h - 2 * c - th);
    }

    boundary.scale(this.drawScale / this.unitScale);

    return boundary;
  }

  genContainer(): Container {
    return new Container(this.genBoundary());
  }

  protected isMultipleBorder = false;
  protected totalBorderCount = 0;
  protected borderCount = 1;
  genBorder(itemsInContainer: CompositeItem[]): void {
    let isFirstBorder = true;
    this.totalBorderCount = itemsInContainer.length;
    this.isMultipleBorder = this.totalBorderCount > 1;

    const h = this.height;
    const w = this.width;
    const a = this.bindSpace;
    const c = this.space;

    const factor = this.drawScale / this.unitScale;

    for (let i = 0; i < itemsInContainer.length; i++) {
      const comp = itemsInContainer[i];
      comp.push(
        new Line(vec(0, 0), vec(w * factor, 0)),
        new Line(vec(w * factor, 0), vec(w * factor, h * factor)),
        new Line(vec(w * factor, h * factor), vec(0, h * factor)),
        new Line(vec(0, h * factor), vec(0, 0)),
        new Line(
          vec(a * factor, c * factor),
          vec((w - c) * factor, c * factor)
        ).thickerLine(),
        new Line(
          vec((w - c) * factor, c * factor),
          vec((w - c) * factor, (h - c) * factor)
        ).thickerLine(),
        new Line(
          vec((w - c) * factor, (h - c) * factor),
          vec(a * factor, (h - c) * factor)
        ).thickerLine(),
        new Line(
          vec(a * factor, (h - c) * factor),
          vec(a * factor, c * factor)
        ).thickerLine()
      );
      if (isFirstBorder) {
        isFirstBorder = false;
        const mtext = this.genFirstNote();
        mtext.scale(factor);
        comp.push(mtext);
      } else {
        const mtext = this.genOtherNote();
        mtext.scale(factor);
        comp.push(mtext);
      }
      const title = this.getTitle();
      title.move(vec(w - c, c));
      title.scale(factor);
      comp.push(title);
    }
  }

  abstract getTitle(): CompositeItem;
}

export class HydroA1Builder extends HydroBorderBuilder {
  constructor() {
    super(594, 841, 10, 25, 71, 180);
  }
  getTitle(): CompositeItem {
    const title = this.isMultipleBorder
      ? this.drawingTitle + `(${this.borderCount++}/${this.totalBorderCount})`
      : this.drawingTitle;
    return presetA0A1Title(
      this.company,
      this.project,
      title,
      this.design,
      this.section,
      this.date,
      `${this.drawingNumberPrefix}${this.drawingNumberStart++}`,
      this.certificateNumber
    );
  }
}

export class HydroA2Builder extends HydroBorderBuilder {
  constructor() {
    super(420, 594, 10, 25, 68, 120);
  }
  getTitle(): CompositeItem {
    const title = this.isMultipleBorder
      ? this.drawingTitle + `(${this.borderCount++}/${this.totalBorderCount})`
      : this.drawingTitle;
    return presetA2A3Title(
      this.company,
      this.project,
      title,
      this.design,
      this.section,
      this.date,
      `${this.drawingNumberPrefix}${this.drawingNumberStart++}`,
      this.certificateNumber
    );
  }
}

export class HydroA3Builder extends HydroBorderBuilder {
  constructor() {
    super(297, 420, 10, 25, 68, 120);
  }
  getTitle(): CompositeItem {
    const title = this.isMultipleBorder
      ? this.drawingTitle + `(${this.borderCount++}/${this.totalBorderCount})`
      : this.drawingTitle;
    return presetA2A3Title(
      this.company,
      this.project,
      title,
      this.design,
      this.section,
      this.date,
      `${this.drawingNumberPrefix}${this.drawingNumberStart++}`,
      this.certificateNumber
    );
  }
}
