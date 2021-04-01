import { Side, vec } from "@/draw";
import { FigureConfig } from "@/struct/utils";
import { PierHollowSectFigure } from "./PierHollowFigure";

export class SolidSect extends PierHollowSectFigure{
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
  }
  protected draw_dim(): void{
    const fig = this.fig;
    const t = this.struct;
    const dim = fig.dimBuilder();
    const {right, top} = fig.getBoundingBox();
    dim.hTop(-t.l/2, top + fig.h)
      .dim(t.fr).dim(t.l - 2*t.fr).dim(t.fr)
      .next().dim(t.l);
    
    dim.vRight(right + fig.h, t.w/2)
      .dim(t.fr).dim(t.w - 2*t.fr).dim(t.fr)
      .next().dim(t.w);

    fig.push(dim.generate());
  }
  protected draw_rebar(): void{
    this.draw_l_main();
    this.draw_w_main();
    this.draw_innner();
    this.draw_stir();
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
  protected draw_stir(): void{
    const fig = this.fig;
    const bar = this.rebars.stir;
    const t = this.struct;
    fig.push(
      fig.planeRebar()
        .rebar(bar.shape())
        .spec(bar).space(bar.space)
        .leaderNote(vec(-t.l/2-fig.h, t.w/2+fig.h), vec(1, -1), vec(-1, 0))
        .generate()
    );
  }
}