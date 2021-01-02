import {
  BoundingBox,
  CompositeItem,
  Content,
  DrawItem,
  Line,
  vec,
  Text,
  TextAlign,
  BorderBuilder,
  HydroBorderBuilder,
  HydroA1Builder,
  HydroA2Builder,
  HydroA3Builder,
  Builder,
  RebarTable,
  RebarSpec,
  MaterialTable,
} from "@/draw";

export class IdGenerator {
  protected _id = 1;
  gen(): number {
    return this._id++;
  }
}

export abstract class RebarBuilder<T, U, P> {
  protected idGen = new IdGenerator();
  protected name = "";
  constructor(
    protected struct: T,
    protected rebars: U,
    protected figures: P,
    protected container?: CompositeRebarBuilder<T, U, P>
  ) {
    if (container) {
      container.push(this);
      this.idGen = container.idGen;
      if (container.name !== "") this.name = container.name;
    }
  }
  abstract buildRebar(): this;
  abstract buildFigure(): this;
  id(): string {
    return `${this.idGen.gen()}`;
  }
}

export abstract class CompositeRebarBuilder<T, U, P> extends RebarBuilder<
  T,
  U,
  P
> {
  protected builders: RebarBuilder<T, U, P>[] = [];
  push(builder: RebarBuilder<T, U, P>): void {
    this.builders.push(builder);
  }
  buildRebar(): this {
    this.builders.forEach((f) => f.buildRebar());
    return this;
  }
  buildFigure(): this {
    this.builders.forEach((f) => f.buildFigure());
    return this;
  }
}

interface FigureInBorder {
  pushTo(border: BorderBuilder): this;
}
export class Figure implements FigureInBorder {
  protected _unitScale = 1;
  protected _drawScale = 1;
  protected _titleHeight = 1;
  protected _textHeight = 1;
  protected _numberHeight = 1;
  protected _drawRadius = 1;
  reset(unitScale = 1, drawScale = 1): this {
    this._unitScale = unitScale;
    this._drawScale = drawScale;
    this._titleHeight = (5.0 * drawScale) / unitScale;
    this._textHeight = (3 * drawScale) / unitScale;
    this._numberHeight = (2.5 * drawScale) / unitScale;
    this._drawRadius = (0.2 * drawScale) / unitScale;
    return this;
  }
  get unitScale(): number {
    return this._unitScale;
  }
  get drawScale(): number {
    return this._drawScale;
  }
  get titleHeight(): number {
    return this._titleHeight;
  }
  get textHeight(): number {
    return this._textHeight;
  }
  get numberHeight(): number {
    return this._numberHeight;
  }
  get drawRadius(): number {
    return this._drawRadius;
  }

  protected composite = new CompositeItem();
  push(...items: DrawItem[]): this {
    this.composite.push(...items);
    return this;
  }
  getBoundingBox(): BoundingBox {
    return this.composite.getBoundingBox();
  }
  pushTo(border: BorderBuilder): this {
    border.addItem(
      this.composite,
      this.unitScale,
      this.drawScale,
      this._centerAligned,
      this._title
    );
    return this;
  }

  protected _centerAligned = false;
  centerAligned(): this {
    this._centerAligned = true;
    return this;
  }

  protected _title?: DrawItem;
  title(content: string | Content, displayScale = false): this {
    const comp = new CompositeItem();
    const pt = vec(0, 0);
    const h0 = this.titleHeight;
    const p0 = pt.sub(vec(0, 4 * h0));
    const l = content.length * h0;
    const s0 = p0.sub(vec(l / 2, 0)).sub(vec(0, 0.1 * h0));
    const s1 = s0.sub(vec(0, 0.25 * h0));
    comp.push(
      new Text(content, p0, h0, TextAlign.BottomCenter),
      new Line(s0, s0.add(vec(l, 0))).thickLine(),
      new Line(s1, s1.add(vec(l, 0)))
    );
    if (displayScale) {
      const h1 = this.textHeight;
      const p1 = p0.sub(vec(0, 0.45 * h0));
      comp.push(new Text(`1:${this.drawScale}`, p1, h1, TextAlign.TopCenter));
    }
    this._title = comp;
    return this;
  }
}

export class RebarTableFigure implements FigureInBorder {
  protected table = new RebarTable();
  push(...specs: RebarSpec[]): this {
    this.table.push(...specs);
    return this;
  }
  pushTo(border: BorderBuilder): this {
    border.addItem(this.table.generate(), 1, 1);
    return this;
  }
}

export class MaterialTableFigure implements FigureInBorder {
  protected table = new MaterialTable();
  push(...specs: RebarSpec[]): this {
    this.table.push(...specs);
    return this;
  }
  pushTo(border: BorderBuilder): this {
    border.addItem(this.table.generate(), 1, 1);
    return this;
  }
}

export class Drawing implements Builder<DrawItem[]> {
  protected figures: FigureInBorder[] = [];
  push(...figures: FigureInBorder[]): this {
    this.figures.push(...figures);
    return this;
  }
  generate(): DrawItem[] {
    const border = this.genBorder();
    for (const figure of this.figures) {
      figure.pushTo(border);
    }
    return border.generate();
  }

  company?: string;
  project?: string;
  design?: string;
  section?: string;
  drawingTitle?: string;
  drawingNumberPrefix?: string;
  drawingNumberStart?: number;
  certificateNumber?: string;
  note: string[] = [];
  size: "A1" | "A2" | "A3" = "A1";
  protected genBorder(): HydroBorderBuilder {
    let border: HydroBorderBuilder;
    if (this.size === "A1") {
      border = new HydroA1Builder();
    } else if (this.size === "A2") {
      border = new HydroA2Builder();
    } else {
      border = new HydroA3Builder();
    }

    if (this.company) border.company = this.company;
    if (this.project) border.project = this.project;
    if (this.design) border.design = this.design;
    if (this.section) border.section = this.section;
    if (this.drawingTitle) border.drawingTitle = this.drawingTitle;
    if (this.drawingNumberPrefix)
      border.drawingNumberPrefix = this.drawingNumberPrefix;
    if (this.drawingNumberStart)
      border.drawingNumberStart = this.drawingNumberStart;
    if (this.certificateNumber)
      border.certificateNumber = this.certificateNumber;
    const date = new Date();
    border.date = `${date.getFullYear()}.${date.getMonth() + 1}`;

    border.note = this.note;
    return border;
  }
}
