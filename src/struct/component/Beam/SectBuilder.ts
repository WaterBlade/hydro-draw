import { divideByCount, Line, Polyline, RebarDraw, Side, vec } from "@/draw";
import { Figure } from "@/struct/utils";
import { BeamContext } from "./Beam";

export class BeamSectBuilder extends BeamContext{
  build(fig: Figure): void{
    this.buildOutline(fig);
    this.buildRebar(fig);
    this.buildDim(fig);
  }
  protected buildOutline(fig: Figure): void{
    const t = this.struct;
    fig.addOutline(
      new Polyline(-t.w / 2, t.h / 2)
        .lineBy(t.w, 0)
        .lineBy(0, -t.h)
        .lineBy(-t.w, 0)
        .lineBy(0, t.h)
        .greyLine()
    );
  }
  protected buildRebar(fig: Figure): void{
    this.drawBot(fig);
    this.drawTop(fig);
    this.drawMid(fig);
    this.drawStirAndTendon(fig);
  }
  protected buildDim(fig: Figure): void{
    const t = this.struct;
    const { right, bottom } = fig.getBoundingBox();
    const dim = fig.dimBuilder();
    dim.vRight(right + fig.h, t.h / 2).dim(t.h);
    dim.hBottom(-t.w / 2, bottom - fig.h).dim(t.w);
    fig.push(dim.generate());
  }
  protected drawBot(fig: Figure): void{
    const t = this.struct;
    const bar = this.rebars.bot;
    const as = this.rebars.as;
    fig.push(
      fig
        .linePointRebar()
        .line(
          new Line(
            vec(-t.w / 2 + as + fig.r, -t.h / 2 + as + fig.r),
            vec(t.w / 2 - as - fig.r, -t.h / 2 + as + fig.r)
          ).divideByCount(bar.singleCount - 1)
        )
        .spec(bar, bar.singleCount)
        .offset(2 * fig.h + as, Side.Right)
        .onlineNote()
        .generate()
    );
  }
  protected drawTop(fig: Figure): void{
    const t = this.struct;
    const bar = this.rebars.top;
    const as = this.rebars.as;
    fig.push(
      fig
        .linePointRebar()
        .line(
          new Line(
            vec(-t.w / 2 + as + fig.r, t.h / 2 - as - fig.r),
            vec(t.w / 2 - as - fig.r, t.h / 2 - as - fig.r)
          ).divideByCount(bar.singleCount - 1)
        )
        .spec(bar, bar.singleCount)
        .offset(2 * fig.h + as)
        .onlineNote()
        .generate()
    );
  }
  protected drawMid(fig: Figure): void{
    const t = this.struct;
    const bar = this.rebars.mid;
    const as = this.rebars.as;
    const left = fig
      .linePointRebar()
      .line(
        new Line(
          vec(-t.w / 2 + as + fig.r, -t.h / 2 + as + fig.r),
          vec(-t.w / 2 + as + fig.r, t.h / 2 - as - fig.r)
        )
          .divideByCount(bar.singleCount + 1)
          .removeBothPt()
      )
      .spec(bar, bar.singleCount)
      .offset(2 * fig.h + as)
      .onlineNote()
      .generate();
    const right = left.mirrorByVAxis();
    fig.push(left, right);
  }
  protected drawStirAndTendon(fig: Figure): void{
    const t = this.struct;
    const bar = this.rebars.stir;
    const as = this.rebars.as;
    const ys = divideByCount(-t.h/2+as+fig.r, t.h/2-as-fig.r, this.rebars.mid.singleCount+1)
    const y = (ys[0]+ys[1])*0.5;
    fig.push(
      fig
        .planeRebar()
        .rebar(RebarDraw.stir(t.h - 2 * as, t.w - 2 * as, fig.r))
        .spec(bar)
        .leaderNote(vec(-t.w / 2 - 2 * fig.h, y), vec(1, 0))
        .generate()
    );
    const rebar = fig.planeRebar().spec(this.rebars.tendon, 0, 200);

    for (const y of ys) {
      const l = RebarDraw.hLineHook(t.w - 2 * as, fig.r);
      l.move(vec(0, y));
      rebar.rebar(l);
    }
    fig.push(
      rebar
        .cross(
          new Polyline(0, -t.h / 2)
            .lineTo(0, y)
            .lineBy(t.w / 2 + fig.h, 0)
        )
        .note()
        .generate()
    );
  }
}