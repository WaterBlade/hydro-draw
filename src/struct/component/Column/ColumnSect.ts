import {
  divideByCount,
  last,
  Line,
  Polyline,
  RebarDraw,
  Side,
  sum,
  vec,
} from "@/draw";
import { Figure, FigureContent } from "@/struct/utils";
import { ColumnStruct } from "./ColumnStruct";
import { ColumnRebar } from "./ColumnRebar";

export class ColumnSect extends Figure {
  protected dotAlong: number[] = [];
  protected dotCross: number[] = [];

  initFigure(): void {
    this.fig = new FigureContent();
    const { id, title } = this.container.sectId;
    this.fig
      .resetScale(1, 20)
      .setTitle(title)
      .setId(id)
      .displayScale()
      .centerAligned()
      .keepTitlePos();
    this.container.record(this.fig);
  }

  build(t: ColumnStruct, rebars: ColumnRebar): void {
    this.buildOutline(t);
    this.buildRebar(t, rebars);
    this.buildDim(t);
  }
  protected buildOutline(t: ColumnStruct): void {
    this.fig.addOutline(
      new Polyline(-t.w / 2, t.h / 2)
        .lineBy(t.w, 0)
        .lineBy(0, -t.h)
        .lineBy(-t.w, 0)
        .lineBy(0, t.h)
        .greyLine()
    );
  }
  protected buildDim(t: ColumnStruct): void {
    const fig = this.fig;
    const { right, bottom } = fig.getBoundingBox();
    const dim = fig.dimBuilder();
    dim.vRight(right + fig.h, t.h / 2).dim(t.h);
    dim.hBottom(-t.w / 2, bottom - fig.h).dim(t.w);
    fig.push(dim.generate());
  }
  protected buildRebar(t: ColumnStruct, rebars: ColumnRebar): void {
    this.dot(t, rebars);
    this.corner(t, rebars);
    this.cross(t, rebars);
    this.along(t, rebars);
    this.stir(t, rebars);
    this.specCross(t, rebars);
    this.specAlong(t, rebars);
  }
  protected dot(t: ColumnStruct, rebars: ColumnRebar): void {
    const fig = this.fig;
    const as = rebars.info.as;
    const countAlong = rebars.along.singleCount;
    const countCross = rebars.cross.singleCount;
    this.dotAlong = divideByCount(
      t.h / 2 - as - fig.r,
      -t.h / 2 + as + fig.r,
      countAlong + 1
    );
    this.dotCross = divideByCount(
      -t.w / 2 + as + fig.r,
      t.w / 2 - as - fig.r,
      countCross + 1
    );
  }
  protected corner(t: ColumnStruct, rebars: ColumnRebar): void {
    const fig = this.fig;
    const bar = rebars.corner;
    const as = rebars.info.as;
    const left = [
      fig
        .sparsePointRebar()
        .points(vec(-t.w / 2 + as + fig.r, t.h / 2 - as - fig.r))
        .spec(bar.spec)
        .parallelLeader(vec(-t.w / 2 - fig.h, t.h / 2 + fig.h), vec(1, 0))
        .generate(),
      fig
        .sparsePointRebar()
        .points(vec(-t.w / 2 + as + fig.r, -t.h / 2 + as + fig.r))
        .spec(bar.spec)
        .parallelLeader(vec(-t.w / 2 - fig.h, -t.h / 2 - fig.h), vec(1, 0))
        .generate(),
    ];
    const right = left.map((p) => p.mirrorByVAxis());
    fig.push(...left, ...right);
  }
  protected cross(t: ColumnStruct, rebars: ColumnRebar): void {
    const fig = this.fig;
    const bar = rebars.cross;
    const as = rebars.info.as;

    const x0 = -t.w / 2 + as + fig.r;
    const x1 = -x0;
    const y0 = t.h / 2 - as - fig.r;
    const y1 = -y0;

    const top = new Line(vec(x0, y0), vec(x1, y0))
      .divideByCount(bar.singleCount + 1)
      .removeBothPt();
    const bot = new Line(vec(x0, y1), vec(x1, y1))
      .divideByCount(bar.singleCount + 1)
      .removeBothPt();
    fig.push(
      fig
        .linePointRebar()
        .line(top)
        .spec(bar.spec, bar.singleCount)
        .offset(2 * Math.max(as, fig.h))
        .onlineNote()
        .generate(),
      fig
        .linePointRebar()
        .line(bot)
        .spec(bar.spec, bar.singleCount)
        .offset(2 * Math.max(as, fig.h), Side.Right)
        .onlineNote()
        .generate()
    );
  }
  protected along(t: ColumnStruct, rebars: ColumnRebar): void {
    const fig = this.fig;
    const bar = rebars.along;
    const as = rebars.info.as;
    const x0 = -t.w / 2 + as + fig.r;
    const y0 = -t.h / 2 + as + fig.r;
    const y1 = -y0;
    const left = fig
      .linePointRebar()
      .line(
        new Line(vec(x0, y0), vec(x0, y1))
          .divideByCount(bar.singleCount + 1)
          .removeBothPt()
      )
      .spec(bar.spec, bar.singleCount)
      .offset(2 * Math.max(as, fig.h))
      .onlineNote()
      .generate();
    const right = left.mirrorByVAxis();
    fig.push(left, right);
  }
  protected stir(t: ColumnStruct, rebars: ColumnRebar): void {
    const fig = this.fig;
    const bar = rebars.stir;
    const as = rebars.info.as;
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
        .spec(bar.spec)
        .leaderNote(vec(-t.w / 2 - fig.h, yLeader), vec(1, 0))
        .generate()
    );
  }
  protected specCross(t: ColumnStruct, rebars: ColumnRebar): void {
    const fig = this.fig;
    const as = rebars.info.as;
    const ys = new Line(
      vec(0, t.h / 2 - as - fig.r),
      vec(0, -t.h / 2 + as + fig.r)
    )
      .divideByCount(rebars.along.singleCount + 1)
      .removeBothPt()
      .points.map((p) => p.y);
    const w = t.w - 2 * as;
    const x = sum(...this.dotCross.slice(0, 2)) / 2;
    let iStir = 0;
    if (ys.length >= 2) {
      const rebar = fig
        .planeRebar()
        .spec(rebars.stir.specCross[iStir++], Math.floor(ys.length / 2));
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
          .spec(rebars.stir.specCross[iStir])
          .leaderNote(vec(x, -t.h / 2 - 4 * fig.h), vec(0, 1), vec(-1, 0))
          .generate()
      );
    }
  }
  protected specAlong(t: ColumnStruct, rebars: ColumnRebar): void {
    const fig = this.fig;
    const as = rebars.info.as;
    const xs = new Line(
      vec(-t.w / 2 + as + fig.r, 0),
      vec(t.w / 2 - as - fig.r, 0)
    )
      .divideByCount(rebars.cross.singleCount + 1)
      .removeBothPt()
      .points.map((p) => p.x);
    const h0 = t.h - 2 * as;
    let iStir = 0;
    if (xs.length >= 2) {
      const rebar = fig
        .planeRebar()
        .spec(rebars.stir.specAlong[iStir++], Math.floor(xs.length / 2));
      const w0 = xs[1] - xs[0] + fig.r * 2;
      let i = 0;
      while (i + 1 < xs.length) {
        const path = RebarDraw.stir(h0, w0, fig.r);
        path.move(vec((xs[i] + xs[i + 1]) / 2, 0));
        rebar.rebar(path);
        i += 2;
      }
      const y = sum(...this.dotAlong.slice(-2)) / 2;
      fig.push(rebar.leaderNote(vec(t.w / 2 + fig.h, y), vec(1, 0)).generate());
    }
    if (xs.length % 2 === 1) {
      const path = RebarDraw.vLineHook(h0, fig.r);
      path.move(vec(last(xs), 0));
      const y = sum(...this.dotAlong.slice(0, 2)) / 2;
      fig.push(
        fig
          .planeRebar()
          .rebar(path)
          .spec(rebars.stir.specAlong[iStir])
          .leaderNote(vec(t.w / 2 + fig.h, y), vec(1, 0))
          .generate()
      );
    }
  }
}
