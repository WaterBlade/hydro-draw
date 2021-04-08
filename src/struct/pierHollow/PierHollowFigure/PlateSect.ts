import { Line, Side, vec } from "@/draw";
import { FigureConfig } from "@/struct/utils";
import { PierHollowSectFigure } from "./PierHollowFigure";

export class PlateSect extends PierHollowSectFigure{
  protected unitScale = 1;
  protected drawScale = 40;
  protected config = new FigureConfig(true, true);
  protected draw(): void{
    this.draw_outline();
    this.draw_rebar();
    this.draw_dim();

  }
  protected draw_outline(): void{
    const fig = this.fig;
    const t = this.struct;
    fig.addOutline(t.outline().greyLine());
    fig.addOutline(t.plate_inner().greyLine());
  }
  protected draw_dim(): void{
    const fig = this.fig;
    const t = this.struct;
    const dim = fig.dimBuilder();
    const {right, top} = fig.getBoundingBox();
    dim.hTop(-t.l/2, top + fig.h)
      .dim(t.l/2 - t.plate.lHole/2).dim(t.plate.lHole).dim(t.l/2 - t.plate.lHole/2)
      .next().dim(t.fr).dim(t.l - 2*t.fr).dim(t.fr)
      .next().dim(t.l);
    
    dim.vRight(right + fig.h, t.w/2)
      .dim(t.w/2 - t.plate.wHole/2).dim(t.plate.wHole).dim(t.w/2 - t.plate.wHole/2)
      .next().dim(t.fr).dim(t.w - 2*t.fr).dim(t.fr)
      .next().dim(t.w);

    fig.push(dim.generate());
  }
  protected draw_rebar(): void{
    this.draw_l_main();
    this.draw_w_main();
    this.draw_innner();
    this.draw_lStir();
    this.draw_wStir();
    this.draw_hHaunch();
    this.draw_plate_main();
    this.draw_plate_dist();
  }
  protected draw_l_main(): void{
    const fig = this.fig;
    const bar = this.rebars.lMain;
    fig.push(
      fig.linePointRebar()
        .line(bar.pos())
        .spec(bar).space(bar.space).count(bar.count/2)
        .offset(2*fig.h, Side.Right)
        .onlineNote()
        .generate(),
      fig.linePointRebar()
        .line(bar.pos_mirror())
        .spec(bar).space(bar.space).count(bar.count/2)
        .offset(2*fig.h)
        .onlineNote()
        .generate(),
    );
  }
  protected draw_w_main(): void{
    const fig = this.fig;
    const bar = this.rebars.wMain;
    fig.push(
      fig.linePointRebar()
        .line(bar.pos())
        .spec(bar).space(bar.space).count(bar.count/2)
        .offset(2*fig.h)
        .onlineNote()
        .generate(),
      fig.linePointRebar()
        .line(bar.pos_mirror())
        .spec(bar).space(bar.space).count(bar.count/2)
        .offset(2*fig.h, Side.Right)
        .onlineNote()
        .generate(),
    );
  }
  protected draw_innner(): void{
    const fig = this.fig;
    const bar = this.rebars.inner;
    fig.push(
      fig.polylinePointRebar()
        .polyline(bar.pos())
        .generate()
    );
  }
  protected draw_lStir(): void{
    const fig = this.fig;
    const bar = this.rebars.lStir;
    const t = this.struct;
    const top = fig.planeRebar()
      .rebar(bar.shape(-fig.r))
      // .spec(bar).space(bar.space)
      // .leaderNote(vec(-t.l/2+t.t+fig.h, t.w/2+4*fig.h), vec(0, -1), vec(-1, 0))
      .generate();
    const bot = top.mirrorByHAxis();
    fig.push(top, bot);
  }
  protected draw_wStir(): void{
    const fig = this.fig;
    const bar = this.rebars.wStir;
    const t = this.struct;
    const left = fig.planeRebar()
        .rebar(bar.shape(-fig.r))
        // .spec(bar).space(bar.space)
        // .leaderNote(vec(-t.l/2-4*fig.h, t.w/2-t.t - fig.h), vec(1, 0), vec(0, 1))
        .generate();
    const right = left.mirrorByVAxis();
    fig.push(left, right);
  }
  protected draw_hHaunch(): void{
    const fig = this.fig;
    const bar = this.rebars.sectHa;
    fig.push(
      fig.planeRebar().rebar(bar.shape(-fig.r)).generate(),
      fig.planeRebar().rebar(bar.shape(-fig.r).mirrorByHAxis()).generate(),
      fig.planeRebar().rebar(bar.shape(-fig.r).mirrorByVAxis()).generate(),
      fig.planeRebar().rebar(bar.shape(-fig.r).mirrorByHAxis().mirrorByVAxis()).generate(),
    );
  }
  protected draw_plate_main(): void{
    const fig = this.fig;
    const t = this.struct;
    const as = this.rebars.as;
    const lBar = this.rebars.plateLMain;
    const wBar = this.rebars.plateWMain;
    fig.push(
      fig.linePointRebar()
        .line(lBar.pos(-t.plate.lHole/2-as))
        .spec(lBar).count(lBar.pos().points.length)
        .offset(fig.h)
        .onlineNote()
        .generate(),
      fig.linePointRebar()
        .line(lBar.pos(t.plate.lHole/2+as))
        .spec(lBar).count(lBar.pos().points.length)
        .offset(fig.h, Side.Right)
        .onlineNote()
        .generate(),
      fig.linePointRebar()
        .line(wBar.pos(-t.plate.wHole/2-as))
        .spec(wBar).count(wBar.pos().points.length)
        .offset(fig.h, Side.Right)
        .onlineNote()
        .generate(),
      fig.linePointRebar()
        .line(wBar.pos(t.plate.wHole/2+as))
        .spec(wBar).count(wBar.pos().points.length)
        .offset(fig.h)
        .onlineNote()
        .generate(),
    )
  }
  protected draw_plate_dist(): void{
    const fig = this.fig;
    const t = this.struct;
    const as = this.rebars.as;
    fig.push(
      fig.planeRebar()
        .rebar(new Line(vec(-t.l/2+as, t.plate.wHole/2+as+fig.r), vec(t.l/2-as, t.plate.wHole/2+as+fig.r)))
        .generate(),
      fig.planeRebar()
        .rebar(new Line(vec(-t.l/2+as, -t.plate.wHole/2-as-fig.r), vec(t.l/2-as, -t.plate.wHole/2-as-fig.r)))
        .generate(),
      fig.planeRebar()
        .rebar(new Line(vec(-t.plate.lHole/2-as-fig.r, -t.w/2+as), vec(-t.plate.lHole/2-as-fig.r, t.w/2-as)))
        .generate(),
      fig.planeRebar()
        .rebar(new Line(vec(t.plate.lHole/2+as+fig.r, -t.w/2+as), vec(t.plate.lHole/2+as+fig.r, t.w/2-as)))
        .generate(),
    )
  }
}