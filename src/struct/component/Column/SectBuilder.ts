import { divideByCount, last, Line, Polyline, RebarDraw, Side, sum, vec } from "@/draw";
import { Figure } from "@/struct/utils";
import { ColumnContext } from "./Column";

export class ColumnSectBuilder extends ColumnContext{
  protected dotAlong: number[] = [];
  protected dotCross: number[] = [];
  build(fig: Figure): void{
    this.corner(fig);
    this.cross(fig);
    this.along(fig);
    this.stir(fig);
    this.stirCross(fig);
    this.stirAlong(fig);
  }
  protected dot(fig: Figure): void{
    const t = this.struct;
    const as = this.rebars.as;
    const countAlong = this.rebars.along.singleCount;
    const countCross = this.rebars.cross.singleCount;
    this.dotAlong = divideByCount(t.h/2-as-fig.r, -t.h/2+as+fig.r, countAlong+1);
    this.dotCross = divideByCount(-t.w/2+as+fig.r, t.w/2-as-fig.r, countCross + 1);
  }
  protected corner(fig: Figure): void{
    const t = this.struct;
    const bar = this.rebars.corner;
    const as = this.rebars.as;
    const left = [
      fig
        .sparsePointRebar()
        .points(vec(-t.w / 2 + as + fig.r, t.h / 2 - as - fig.r))
        .spec(bar)
        .parallelLeader(
          vec(-t.w / 2 - fig.h, t.h / 2 + fig.h),
          vec(1, 0)
        )
        .generate(),
      fig
        .sparsePointRebar()
        .points(vec(-t.w / 2 + as + fig.r, -t.h / 2 + as + fig.r))
        .spec(bar)
        .parallelLeader(
          vec(-t.w / 2 - fig.h, -t.h / 2 - fig.h),
          vec(1, 0)
        )
        .generate(),
    ];
    const right = left.map((p) => p.mirrorByVAxis());
    fig.push(...left, ...right);
  }
  protected cross(fig: Figure): void{
    const t = this.struct;
    const bar = this.rebars.cross;
    const as = this.rebars.as;

    const x0 = -t.w/2 + as - fig.r;
    const x1 = -x0;
    const y0 = t.h/2 - as - fig.r;
    const y1 = -y0;

    const top = new Line(vec(x0, y0), vec(x1, y0)).divide(bar.singleCount + 1).removeBothPt();
    const bot = new Line(vec(x0, y1), vec(x1, y1)).divide(bar.singleCount + 1).removeBothPt();
    fig.push(
      fig
        .linePointRebar()
        .line(top)
        .spec(bar, bar.singleCount)
        .offset(2 * Math.max(as, fig.h))
        .onlineNote()
        .generate(),
      fig
        .linePointRebar()
        .line(bot)
        .spec(bar, bar.singleCount)
        .offset(2 * Math.max(as, fig.h), Side.Right)
        .onlineNote()
        .generate()
    );
  }
  protected along(fig: Figure): void{
    const t = this.struct;
    const bar = this.rebars.along;
    const as = this.rebars.as;
    const x0 = -t.w/2+as + fig.r;
    const y0 = -t.h/2 +as + fig.r;
    const y1 = -y0;
    const left = fig
      .linePointRebar()
      .line(new Line(vec(x0, y0), vec(x0, y1)).divide(bar.singleCount + 1).removeBothPt())
      .spec(bar, bar.singleCount)
      .offset(2 * Math.max(as, fig.h))
      .onlineNote()
      .generate();
    const right = left.mirrorByVAxis();
    fig.push(left, right);
  }
  protected stir(fig: Figure): void{
    const t = this.struct;
    const bar = this.rebars.stir;
    const as = this.rebars.as;
    const yLeader = sum(...this.dotAlong.slice(-2)) / 2;
    fig.push(
      fig
        .planeRebar()
        .rebar(
          new Polyline(-t.w / 2 + as, t.h / 2 - as)
            .lineBy(t.w - 2 * as, 0)
            .lineBy(0, -t.h + 2 * as)
            .lineBy(-t.w + 2 * as, 0)
            .lineBy(0, t.h - 2 * as)
        )
        .spec(bar)
        .leaderNote(vec(-t.w / 2 - fig.h, yLeader), vec(1, 0))
        .generate()
    );
  }
  protected stirCross(fig: Figure): void{
    const t = this.struct;
    const as = this.rebars.as;
    const ys = new Line(
      vec(0, t.h / 2 - as - fig.r),
      vec(0, -t.h / 2 + as + fig.r)
    )
      .divideByCount(this.rebars.along.singleCount + 1)
      .removeBothPt()
      .points.map((p) => p.y);
    const w = t.w - 2 * as;
    const x = sum(...this.dotCross.slice(0, 2)) / 2;
    let iStir = 0;
    if (ys.length >= 2) {
      const rebar = fig
        .planeRebar()
        .spec(this.rebars.stirCross[iStir++], Math.floor(ys.length / 2));
      const h = ys[0] - ys[1] + fig.r * 2;
      let i = 0;
      while (i + 1 < ys.length) {
        const path = RebarDraw.stir(h, w, fig.r);
        path.move(vec(0, (ys[i] + ys[i + 1]) / 2));
        rebar.rebar(path);
        i += 2;
      }
      fig.push(
        rebar
          .leaderNote(vec(x, t.h / 2 + 4 * fig.h), vec(0, 1), vec(-1, 0))
          .generate()
      );
    }
    if (ys.length % 2 === 1) {
      const path = RebarDraw.hLineHook(w, fig.r);
      path.move(vec(0, last(ys)));
      fig.push(
        fig
          .planeRebar()
          .rebar(path)
          .spec(this.rebars.stirCross[iStir])
          .leaderNote(vec(x, -t.h / 2 - 4 * fig.h), vec(0, 1), vec(-1, 0))
          .generate()
      );
    }
  }
  protected stirAlong(fig: Figure): void{
    const t = this.struct;
    const as = this.rebars.as;
    const xs = new Line(
      vec(-t.w / 2 + as + fig.r, 0),
      vec(t.w / 2 - as - fig.r, 0)
    )
      .divideByCount(this.rebars.cross.singleCount + 1)
      .removeBothPt()
      .points.map((p) => p.x);
    const h0 = t.h - 2 * as;
    let iStir = 0;
    if (xs.length >= 2) {
      const rebar = fig
        .planeRebar()
        .spec(this.rebars.stirAlong[iStir++], Math.floor(xs.length / 2));
      const w0 = xs[1] - xs[0] + fig.r * 2;
      let i = 0;
      while (i + 1 < xs.length) {
        const path = RebarDraw.stir(h0, w0, fig.r);
        path.move(vec((xs[i] + xs[i + 1]) / 2, 0));
        rebar.rebar(path);
        i += 2;
      }
      const y = sum(...this.dotAlong.slice(-2)) / 2;
      fig.push(
        rebar.leaderNote(vec(t.w / 2 + fig.h, y), vec(1, 0)).generate()
      );
    }
    if (xs.length % 2 === 1) {
      const path = RebarDraw.vLineHook(h0, fig.r);
      path.move(vec(last(xs), 0));
      const y = sum(...this.dotAlong.slice(0, 2)) / 2;
      fig.push(
        fig
          .planeRebar()
          .rebar(path)
          .spec(this.rebars.stirAlong[iStir])
          .leaderNote(vec(t.w / 2 + fig.h, y), vec(1, 0))
          .generate()
      );
    }
  }
}