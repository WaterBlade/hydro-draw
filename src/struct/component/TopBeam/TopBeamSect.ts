import { Line, Polyline, RebarDrawPreset, Side, vec } from "@/draw";
import { SectFigure, FigureConfig } from "@/struct/utils";
import { TopBeamStruct } from "./TopBeamStruct";
import { TopBeamRebar } from "./TopBeamRebar";

export class TopBeamSect extends SectFigure {
  protected unitScale = 1;
  protected drawScale = 25;
  protected config = new FigureConfig(true, true);
  constructor(protected struct: TopBeamStruct, protected rebars: TopBeamRebar) {
    super();
  }
  draw(): void {
    this.buildOutline();
    this.buildRebar();
    this.buildDim();
  }
  protected buildOutline(): void {
    const t = this.struct;
    this.fig.addOutline(
      new Polyline(-t.w / 2, t.h / 2)
        .lineBy(t.w, 0)
        .lineBy(0, -t.hd)
        .lineBy(-t.ws, -t.hs)
        .lineBy(-t.wb, 0)
        .lineBy(-t.ws, t.hs)
        .lineBy(0, t.hd)
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
    dim
      .vRight(right + fig.h, t.h / 2)
      .dim(t.hd)
      .dim(t.hs)
      .next()
      .dim(t.h);
    dim
      .hBottom(-t.w / 2, bottom - fig.h)
      .dim(t.ws)
      .dim(t.wb)
      .dim(t.ws)
      .next()
      .dim(t.w);
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
            vec(-t.wb / 2 + as + fig.r, -t.h / 2 + as + fig.r),
            vec(t.wb / 2 - as - fig.r, -t.h / 2 + as + fig.r)
          ).divideByCount(bar.singleCount - 1).points
        )
        .spec(bar)
        .count(bar.singleCount)
        .parallelLeader(vec(t.w / 2 + fig.h, -t.h / 2 - fig.h), vec(1, 0))
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
        .parallelLeader(vec(t.w / 2 + 2 * fig.h, t.h / 2 + fig.h), vec(1, 0))
        .generate()
    );
  }
  protected drawMid(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const bar = rebars.mid;
    const left = fig
      .sparsePointRebar()
      .points(...bar.pos(fig.r))
      .spec(bar)
      .count(bar.singleCount)
      .jointLeader(
        vec(-t.w / 2 - fig.h, 0),
        vec(-t.w / 2 - fig.h, 0),
        vec(-1, 0)
      )
      .generate();
    const right = left.mirrorByVAxis();
    fig.push(left, right);
  }
  protected drawStirAndTendon(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const bar = rebars.stir;
    const barInner = rebars.stirInner;
    const as = rebars.as;
    const pts = rebars.mid.pos();
    fig.push(
      fig
        .planeRebar()
        .rebar(
          new Polyline(-t.w / 2, t.h / 2)
            .lineBy(t.w, 0)
            .lineBy(0, -t.hd)
            .lineBy(-t.ws, -t.hs)
            .lineBy(-t.wb, 0)
            .lineBy(-t.ws, t.hs)
            .close()
            .offset(as, Side.Right)
        )
        .spec(bar)
        .space(bar.space)
        .leaderNote(vec(0, t.h / 2 + 3 * fig.h), vec(0, 1), vec(-1, 0))
        .generate(),
      fig
        .planeRebar()
        .rebar(RebarDrawPreset.stir(t.h - 2 * as, t.wb - 2 * as, fig.r))
        .spec(barInner)
        .space(bar.space)
        .leaderNote(vec(-t.w / 2 - fig.h, t.h / 2 - fig.h), vec(1, 0))
        .generate()
    );
    const rebar = fig
      .planeRebar()
      .spec(rebars.tendon)
      .space(rebars.tendon.space);

    for (const pt of pts) {
      const l = RebarDrawPreset.hLineHook(Math.abs(pt.x) * 2, fig.r);
      l.move(vec(0, pt.y));
      rebar.rebar(l);
    }
    fig.push(
      rebar
        .leaderNote(vec(0, -t.h / 2 - 3 * fig.h), vec(0, 1), vec(-1, 0))
        .generate()
    );
  }
}
