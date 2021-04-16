import { Circle, divideBySpace, Line, Polyline, RebarDrawPreset, Side, vec } from "@/draw";
import { SectFigure, FigureConfig } from "@/struct/utils";
import { PierSolidRebar } from "../PierSolidRebar";
import { PierSolidStruct } from "../PierSolidStruct";
import { PierSolidFigure } from "./PierSolidFigure";

export class PierSolidSect extends SectFigure{
  protected unitScale = 1;
  protected drawScale = 25;
  protected config = new FigureConfig(true, true, true);
  constructor(protected struct: PierSolidStruct, protected rebars: PierSolidRebar, protected figures: PierSolidFigure){super();}
  draw(): void {
    this.buildOutline();
    this.buildRebar();
    this.buildDim();
  }
  protected buildOutline(): void {
    const t = this.struct;
    
    const fig = this.fig;
    const w = t.w - 2 * t.fr;
    const l = t.l - 2 * t.fr;
    const r = t.fr;
    fig.addOutline(
      new Polyline(-l / 2 - r, w / 2)
        .lineBy(0, -w)
        .arcBy(r, -r, 90)
        .lineBy(l, 0)
        .arcBy(r, r, 90)
        .lineBy(0, w)
        .arcBy(-r, r, 90)
        .lineBy(-l, 0)
        .arcBy(-r, -r, 90)
        .greyLine()
    );
  }
  protected buildDim(): void {
    const t = this.struct;
    const fig = this.fig;
    const { top, right } = fig.getBoundingBox();
    const dim = fig.dimBuilder();
    dim
      .hTop(-t.l / 2, top + fig.h)
      .dim(t.fr)
      .dim(t.l - 2 * t.fr)
      .dim(t.fr)
      .next()
      .dim(t.l);

    dim
      .vRight(right + fig.h, t.w / 2)
      .dim(t.fr)
      .dim(t.w - 2 * t.fr)
      .dim(t.fr)
      .next()
      .dim(t.w);

    fig.push(dim.generate());
  }
  protected buildRebar(): void{
    this.rebar_stir();
    this.rebar_wMain();
    this.rebar_lMain();
    this.rebar_wStir();
    this.rebar_lStir();
  }
  protected rebar_stir(): void{
    const bar = this.rebars.stir;
    const t = this.struct;
    const fig = this.fig;
    const as = this.rebars.as;
    fig.push(
      fig.planeRebar()
        .rebar(bar.shape())
        .spec(bar).space(bar.space, bar.denseSpace)
        .leaderNote(vec(-t.l/2+as+(t.fr-as)/2, t.w/2 + 4*fig.h), vec(0, 1), vec(-1, 0))
        .generate()
    );
  }
  protected rebar_wMain(): void{
    const bar = this.rebars.wMain;
    const t = this.struct;
    const as = this.rebars.as;
    const fig = this.fig;
    const left_divide = new Line(vec(-t.l/2+as+fig.r, -t.w/2+t.fr+fig.r), vec(-t.l/2+as+fig.r, t.w/2-t.fr-fig.r)).divide(bar.space);
    const left = fig.linePointRebar()
        .line(left_divide)
        .spec(bar).count(bar.count/2).space(bar.space)
        .offset(2*fig.h)
        .onlineNote()
        .generate();
    const right = left.mirrorByVAxis();
    fig.push(left, right);
    if(bar.multiple > 1){
      const left_rebar = left_divide.project(2*fig.r, Side.Right);
      fig.push(...left_rebar.points.map(p => new Circle(p, fig.r).thickLine()));
      fig.push(...left_rebar.points.map(p => new Circle(p.mirrorByVAxis(), fig.r).thickLine()));
    }
  }
  protected rebar_lMain(): void{
    const bar = this.rebars.lMain;
    const t = this.struct;
    const as = this.rebars.as;
    const fig = this.fig;

    const x0 = -t.l/2 + fig.r + t.fr;
    const x1 = t.l/2 -  fig.r - t.fr;

    const y0 = -t.w/2 + as + fig.r;
    const y1 = t.w/2 - as - fig.r;

    const bot = fig.linePointRebar()
        .line(new Line(vec(x0, y0), vec(x1, y0)).divide(bar.space))
        .spec(bar).count(bar.count/2).space(bar.space)
        .offset(2*fig.h, Side.Right)
        .onlineNote()
        .generate();
    const top = fig.linePointRebar()
        .line(new Line(vec(x0, y1), vec(x1, y1)).divide(bar.space))
        .spec(bar).count(bar.count/2).space(bar.space)
        .offset(2*fig.h)
        .onlineNote()
        .generate();
    fig.push(bot, top);
  }
  protected rebar_wStir(): void{
    const fig = this.fig;
    const bar = this.rebars.wStir;
    const t = this.struct;
    const as = this.rebars.as;
    const x0 = -t.l/2 + fig.r + t.fr;
    const x1 = t.l/2 -  fig.r - t.fr;
    const space = this.rebars.lMain.space;
    const pts = divideBySpace(x0, x1, space).slice(1, -1);
    const n = Math.floor(pts.length / 3);
    const h = t.w - 2*as;
    const w = 2*space+2*fig.r
    const p0 = pts[1];
    const rebar = fig.planeRebar();
    for(let i = 0; i < n; i++){
      const stir = RebarDrawPreset.stir(h, w, fig.r);
      stir.move(vec(p0+i*3*space, 0));
      rebar.rebar(stir);
    }
    fig.push(
      rebar
        .spec(bar).count(n).space(bar.space, bar.denseSpace)
        .leaderNote(vec(t.l/2+fig.h, t.w/2-as-(t.fr-as)/2), vec(1, 0))
        .generate()
    )
  }
  protected rebar_lStir(): void{
    const fig = this.fig;
    const bar = this.rebars.lStir;
    const t = this.struct;
    const as = this.rebars.as;
    const y0 = t.w/2 -t.fr -fig.r;
    const y1 = -t.w/2 + t.fr + fig.r;
    const space = this.rebars.wMain.space;
    const pts = divideBySpace(y0, y1, space).slice(1, -1);
    const n = Math.floor(pts.length / 3);
    const w = t.l - 2*as;
    const h = 2*space+2*fig.r;
    const p0 = pts[1];
    const rebar = fig.planeRebar();
    for(let i = 0; i < n; i++){
      const stir = RebarDrawPreset.stir(h, w, fig.r);
      stir.move(vec(0, p0-i*3*space));
      rebar.rebar(stir);
    }
    fig.push(
      rebar
        .spec(bar).count(n).space(bar.space, bar.denseSpace)
        .leaderNote(vec(-t.l/2+as+(t.fr-as)/2, -t.w/2 - 4*fig.h), vec(0, -1), vec(-1, 0))
        .generate()
    )
  }
}
