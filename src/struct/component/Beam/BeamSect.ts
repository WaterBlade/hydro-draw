import {
  divideByCount,
  Line,
  Polyline,
  RebarDrawPreset,
  Side,
  sum,
  vec,
} from "@/draw";
import { SectFigure, FigureConfig } from "@/struct/utils";
import { BeamStruct } from "./BeamStruct";
import { BeamRebar } from "./BeamRebar";

export class BeamMidSect extends SectFigure {
  protected unitScale = 1;
  protected drawScale = 20;
  protected config = new FigureConfig(true, true, true);
  constructor(protected struct: BeamStruct, protected rebars: BeamRebar) {
    super();
  }
  protected draw(): void {
    this.buildOutline();
    this.buildRebar();
    this.buildDim();
  }
  isExist(): boolean {
    return this.struct.n > 0;
  }
  protected buildOutline(): void {
    const t = this.struct;
    this.fig.addOutline(
      new Polyline(-t.w / 2, t.h / 2)
        .lineBy(t.w, 0)
        .lineBy(0, -t.h)
        .lineBy(-t.w, 0)
        .lineBy(0, t.h)
        .greyLine()
    );
  }
  protected buildRebar(): void {
    this.drawBot();
    this.drawTop();
    this.drawMid();
    this.drawStirAndTendon();
  }
  protected buildDim(): void {
    const t = this.struct;
    const fig = this.fig;
    const { right, bottom } = fig.getBoundingBox();
    const dim = fig.dimBuilder();
    dim.vRight(right + fig.h, t.h / 2).dim(t.h);
    dim.hBottom(-t.w / 2, bottom - fig.h).dim(t.w);
    fig.push(dim.generate());
  }
  protected drawBot(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const bar = rebars.bot;
    const as = rebars.as;
    fig.push(
      fig
        .linePointRebar()
        .line(
          new Line(
            vec(-t.w / 2 + as + fig.r, -t.h / 2 + as + fig.r),
            vec(t.w / 2 - as - fig.r, -t.h / 2 + as + fig.r)
          ).divideByCount(bar.singleCount - 1)
        )
        .spec(bar)
        .count(bar.singleCount)
        .offset(2 * fig.h + as, Side.Right)
        .onlineNote()
        .generate()
    );
  }
  protected drawTop(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const bar = rebars.top;
    const as = rebars.as;
    fig.push(
      fig
        .linePointRebar()
        .line(
          new Line(
            vec(-t.w / 2 + as + fig.r, t.h / 2 - as - fig.r),
            vec(t.w / 2 - as - fig.r, t.h / 2 - as - fig.r)
          ).divideByCount(bar.singleCount - 1)
        )
        .spec(bar)
        .count(bar.singleCount)
        .offset(2 * fig.h + as)
        .onlineNote()
        .generate()
    );
  }
  protected drawMid(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const bar = rebars.mid;
    const as = rebars.as;
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
      .spec(bar)
      .count(bar.singleCount)
      .offset(2 * fig.h + as)
      .onlineNote()
      .generate();
    const right = left.mirrorByVAxis();
    fig.push(left, right);
  }
  protected drawStirAndTendon(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const bar = rebars.stir;
    const as = rebars.as;
    const ys = divideByCount(
      -t.h / 2 + as + fig.r,
      t.h / 2 - as - fig.r,
      rebars.mid.singleCount + 1
    );
    const y = sum(...ys.slice(-2)) * 0.5;
    fig.push(
      fig
        .planeRebar()
        .rebar(RebarDrawPreset.stir(t.h - 2 * as, t.w - 2 * as, fig.r))
        .spec(bar)
        .leaderNote(vec(-t.w / 2 - 2 * fig.h, y), vec(1, 0))
        .generate()
    );
    const rebar = fig
      .planeRebar()
      .spec(rebars.tendon)
      .count(rebars.tendon.space);

    for (const y of ys.slice(1, -1)) {
      const l = RebarDrawPreset.hLineHook(t.w - 2 * as, fig.r);
      l.move(vec(0, y));
      rebar.rebar(l);
    }
    fig.push(
      rebar
        .cross(
          new Polyline(0, -t.h / 2).lineTo(0, y).lineBy(t.w / 2 + fig.h, 0)
        )
        .note()
        .generate()
    );
  }
}

export class BeamEndSect extends BeamMidSect {
  protected buildOutline(): void {
    const t = this.struct;
    super.buildOutline();
    if (t.topHa) {
      this.fig.addOutline(
        new Polyline(-t.w / 2, t.h / 2)
          .lineBy(0, t.ha)
          .lineBy(t.w, 0)
          .lineBy(0, -t.ha)
          .greyLine()
      );
    }
    if (t.botHa) {
      this.fig.addOutline(
        new Polyline(-t.w / 2, -t.h / 2)
          .lineBy(0, -t.ha)
          .lineBy(t.w, 0)
          .lineBy(0, t.ha)
          .greyLine()
      );
    }
  }
  protected buildRebar(): void {
    super.buildRebar();
    this.drawHaunch();
  }
  protected buildDim(): void {
    const t = this.struct;
    const fig = this.fig;
    const { right, bottom } = fig.getBoundingBox();
    const dim = fig.dimBuilder();
    if (t.topHa) {
      dim
        .vRight(right + fig.h, t.h / 2 + t.ha)
        .dim(t.ha)
        .dim(t.h);
    } else {
      dim.vRight(right + fig.h, t.h / 2).dim(t.h);
    }
    if (t.botHa) dim.dim(t.ha);
    dim.next().dim(t.h + (t.botHa ? t.ha : 0) + (t.topHa ? t.ha : 0));
    dim.hBottom(-t.w / 2, bottom - fig.h).dim(t.w);
    fig.push(dim.generate());
  }
  protected drawBot(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const bar = rebars.bot;
    const as = rebars.as;
    fig.push(
      fig
        .sparsePointRebar()
        .points(
          ...new Line(
            vec(-t.w / 2 + as + fig.r, -t.h / 2 + as + fig.r),
            vec(t.w / 2 - as - fig.r, -t.h / 2 + as + fig.r)
          ).divideByCount(bar.singleCount - 1).points
        )
        .spec(bar)
        .count(bar.singleCount)
        .parallelLeader(vec(-t.w / 2 - fig.h, -t.h / 2 - fig.h), vec(1, 0))
        .generate()
    );
  }
  protected drawTop(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const bar = rebars.top;
    const as = rebars.as;
    fig.push(
      fig
        .sparsePointRebar()
        .points(
          ...new Line(
            vec(-t.w / 2 + as + fig.r, t.h / 2 - as - fig.r),
            vec(t.w / 2 - as - fig.r, t.h / 2 - as - fig.r)
          ).divideByCount(bar.singleCount - 1).points
        )
        .spec(bar)
        .count(bar.singleCount)
        .parallelLeader(vec(-t.w / 2 - fig.h, t.h / 2 + fig.h), vec(1, 0))
        .generate()
    );
  }
  protected drawHaunch(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const bar = rebars.haunch;
    const as = rebars.as;
    if (t.topHa) {
      fig.push(
        fig
          .sparsePointRebar()
          .points(
            ...new Line(
              vec(-t.w / 2 + as + fig.r, t.h / 2 + t.ha - as - fig.r),
              vec(t.w / 2 - as - fig.r, t.h / 2 + t.ha - as - fig.r)
            ).divideByCount(bar.singleCount - 1).points
          )
          .spec(bar)
          .count(bar.singleCount)
          .parallelLeader(
            vec(-t.w / 2 - fig.h, t.h / 2 + t.ha + fig.h),
            vec(1, 0)
          )
          .generate()
      );
    }
    if (t.botHa) {
      fig.push(
        fig
          .sparsePointRebar()
          .points(
            ...new Line(
              vec(-t.w / 2 + as + fig.r, -t.h / 2 - t.ha + as + fig.r),
              vec(t.w / 2 - as - fig.r, -t.h / 2 - t.ha + as + fig.r)
            ).divideByCount(bar.singleCount - 1).points
          )
          .spec(bar)
          .count(bar.singleCount)
          .parallelLeader(
            vec(-t.w / 2 - fig.h, -t.h / 2 - t.ha - fig.h),
            vec(1, 0)
          )
          .generate()
      );
    }
  }
}
