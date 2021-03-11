import {
  CirclePointRebar,
  DimensionBuilder,
  LayerPointRebar,
  LinePointRebar,
  PlaneRebar,
  PolylinePointRebar,
  SparsePointRebar,
} from "../builder";
import {
  CompositeItem,
  Content,
  DrawItem,
  Line,
  Polyline,
  TextDraw,
} from "../drawItem";
import { BoundingBox, TextAlign, vec, Vector } from "../misc";
import { NotePreset } from "./NotePreset";
import { SymbolPreset } from "./SymbolPreset";

export class ContextBuilder {
  protected unitScale = 0;
  protected drawScale = 0;
  protected titleHeight = 0;
  protected textHeight = 0;
  protected numberHeight = 0;
  protected drawRadius = 0;
  constructor(unitScale = 1, drawScale = 1) {
    this.reset(unitScale, drawScale);
  }
  reset(unitScale: number, drawScale: number): this {
    this.unitScale = unitScale;
    this.drawScale = drawScale;
    this.titleHeight = (5.0 * drawScale) / unitScale;
    this.textHeight = (3 * drawScale) / unitScale;
    this.numberHeight = (2.5 * drawScale) / unitScale;
    this.drawRadius = (0.25 * drawScale) / unitScale;
    this.clear();
    return this;
  }
  // add
  protected _outline = new CompositeItem();
  get outline(): CompositeItem {
    return this._outline;
  }
  protected _composite = new CompositeItem();
  addOutline(...items: DrawItem[]): this {
    this._outline.push(...items);
    this._composite.push(...items);
    return this;
  }
  push(...items: DrawItem[]): this {
    this._composite.push(...items);
    return this;
  }
  mirror(): this {
    this._composite = this._composite.mirrorByVAxis();
    this._outline = this._outline.mirrorByVAxis();
    return this;
  }
  getBoundingBox(): BoundingBox {
    return this._composite.getBoundingBox();
  }
  clear(): this {
    this._outline = new CompositeItem();
    this._composite = new CompositeItem();
    return this;
  }
  get content(): CompositeItem {
    return this._composite;
  }
  get h(): number {
    return this.textHeight;
  }
  get r(): number {
    return this.drawRadius;
  }
  // note
  leader(content: string | Content, start: Vector, end: Vector): CompositeItem {
    return NotePreset.leader(content, start, end, this.textHeight);
  }
  leaderSpec(
    content: string | Content,
    center: Vector,
    radius: number,
    end: Vector
  ): CompositeItem {
    return NotePreset.leaderSpec(content, center, radius, end, this.textHeight);
  }
  // symbol
  breakline(start: Vector, end: Vector): Polyline {
    return SymbolPreset.breakline(start, end, this.textHeight);
  }
  sectSymbol(
    content: string | Content,
    start: Vector,
    end: Vector
  ): CompositeItem {
    return SymbolPreset.sectSymbol(content, start, end, this.textHeight);
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
  // title
  title(content: string | Content): CompositeItem {
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
    const h1 = this.textHeight;
    const p1 = p0.sub(vec(0, 0.45 * h0));
    comp.push(new TextDraw(`1:${this.drawScale}`, p1, h1, TextAlign.TopCenter));
    return comp;
  }
}
