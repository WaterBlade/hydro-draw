import {
  BoundingBox,
  CompositeItem,
  Content,
  DrawItem,
  Line,
  vec,
  TextDraw,
  TextAlign,
  PlaneRebar,
  CirclePointRebar,
  LayerPointRebar,
  LinePointRebar,
  PolylinePointRebar,
  SparsePointRebar,
  DimensionBuilder,
  Vector,
  NotePreset,
  SymbolPreset,
  BorderItem,
} from "@/draw";

export class FigureContent implements BorderItem {
  id = "图";
  setId(id: string): this {
    this.id = id;
    return this;
  }
  unitScale = 1;
  drawScale = 1;
  titleHeight = 1;
  textHeight = 1;
  numberHeight = 1;
  drawRadius = 1;
  centerAligned = false;
  baseAligned = false;
  displayScale = false;
  titlePosKeep = false;
  titleContent?: string | Content;
  setCenterAligned(): this {
    this.centerAligned = true;
    return this;
  }
  setBaseAligned(): this {
    this.baseAligned = true;
    return this;
  }
  setDisplayScale(): this {
    this.displayScale = true;
    return this;
  }
  setKeepTitlePos(): this {
    this.titlePosKeep = true;
    return this;
  }
  setTitle(content: string | Content): this {
    this.titleContent = content;
    return this;
  }
  protected _outline = new CompositeItem();
  addOutline(...items: DrawItem[]): this {
    this._outline.push(...items);
    this.push(...items);
    return this;
  }
  get outline(): CompositeItem {
    return this._outline;
  }
  clear(): this {
    this._outline = new CompositeItem();
    this.composite = new CompositeItem();
    return this;
  }
  // note
  leader(content: string | Content, start: Vector, end: Vector): this {
    this.composite.push(
      NotePreset.leader(content, start, end, this.textHeight)
    );
    return this;
  }
  leaderSpec(
    content: string | Content,
    center: Vector,
    radius: number,
    end: Vector
  ): this {
    this.composite.push(
      NotePreset.leaderSpec(content, center, radius, end, this.textHeight)
    );
    return this;
  }
  // symbol
  breakline(start: Vector, end: Vector): this {
    this.composite.push(SymbolPreset.breakline(start, end, this.textHeight));
    return this;
  }
  sectSymbol(content: string | Content, start: Vector, end: Vector): this {
    this.composite.push(
      SymbolPreset.sectSymbol(content, start, end, this.textHeight)
    );
    return this;
  }
  // dim
  dimBuilder(): DimensionBuilder {
    return new DimensionBuilder(this.unitScale, this.drawScale);
  }
  // rebar
  planeRebar(): PlaneRebar {
    return new PlaneRebar(this.textHeight);
  }
  circlePointRebar(): CirclePointRebar {
    return new CirclePointRebar(this.textHeight, this.drawRadius);
  }
  layerPointRebar(): LayerPointRebar {
    return new LayerPointRebar(this.textHeight, this.drawRadius);
  }
  linePointRebar(): LinePointRebar {
    return new LinePointRebar(this.textHeight, this.drawRadius);
  }
  polylinePointRebar(): PolylinePointRebar {
    return new PolylinePointRebar(this.textHeight, this.drawRadius);
  }
  sparsePointRebar(angle = 30): SparsePointRebar {
    return new SparsePointRebar(this.textHeight, this.drawRadius, angle);
  }
  resetScale(unitScale = 1, drawScale = 1): this {
    this.unitScale = unitScale;
    this.drawScale = drawScale;
    this.titleHeight = (5.0 * drawScale) / unitScale;
    this.textHeight = (3 * drawScale) / unitScale;
    this.numberHeight = (2.5 * drawScale) / unitScale;
    this.drawRadius = (0.25 * drawScale) / unitScale;
    return this;
  }
  get h(): number {
    return this.textHeight;
  }
  get r(): number {
    return this.drawRadius;
  }
  mirror(): this {
    this.composite = this.composite.mirrorByVAxis();
    this._outline = this._outline.mirrorByVAxis();
    return this;
  }

  protected composite = new CompositeItem();
  push(...items: DrawItem[]): this {
    this.composite.push(...items);
    return this;
  }
  getBoundingBox(): BoundingBox {
    return this.composite.getBoundingBox();
  }
  get content(): DrawItem {
    return this.composite;
  }
  get title(): CompositeItem | undefined {
    const content = this.titleContent;
    if (content) {
      const comp = new CompositeItem();
      const pt = vec(0, 0);
      const h0 = this.titleHeight;
      const p0 = pt.sub(vec(0, 4 * h0));
      const l = content.length * h0;
      const s0 = p0.sub(vec(l / 2, 0)).sub(vec(0, 0.1 * h0));
      const s1 = s0.sub(vec(0, 0.25 * h0));
      comp.push(
        new TextDraw(content, p0, h0, TextAlign.BottomCenter),
        new Line(s0, s0.add(vec(l, 0))).thickLine(),
        new Line(s1, s1.add(vec(l, 0)))
      );
      if (this.displayScale) {
        const h1 = this.textHeight;
        const p1 = p0.sub(vec(0, 0.45 * h0));
        comp.push(
          new TextDraw(`1:${this.drawScale}`, p1, h1, TextAlign.TopCenter)
        );
      }
      return comp;
    } else {
      return undefined;
    }
  }
}
