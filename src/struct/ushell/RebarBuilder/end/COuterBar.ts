import {
  PlaneRebar,
  Line,
  Polyline,
  RebarPathForm,
  Side,
  SparsePointRebar,
  toDegree,
  vec,
} from "@/draw";
import { RebarBase } from "../Base";

export class COuterBar extends RebarBase {
  buildSpec(): this {
    const u = this.struct;
    const bar = this.specs.end.cOuter;
    const path = this.genShape();
    const lens = path.segments.map((s) => s.calcLength());
    let i = 0;
    const angle = 180 - toDegree(Math.atan(u.endSect.w / u.endSect.hs));
    bar
      .setForm(
        new RebarPathForm(bar.diameter)
          .lineBy(0, -1.5)
          .dimLength(lens[i++], Side.Right)
          .lineBy(0.75, -1.5)
          .dimLength(lens[i++], Side.Right)
          .dimAngle(angle)
          .lineBy(1, 0)
          .dimLength(lens[i++])
          .lineBy(0.5, 0.5)
          .dimLength(500, Side.Right)
      )
      .setId(this.id())
      .setStructure(this.name);
    this.specs.record(bar);
    return this;
  }
  buildFigure(): this {
    this.drawCEnd();
    this.drawLOuter();
    this.drawSEndWall();
    return this;
  }
  protected genShape(offDist?: number): Polyline {
    const u = this.struct;
    const dist = offDist ? offDist : u.as;
    const path = new Polyline(-u.r - u.t - u.oBeam.w + 1, u.hd)
      .lineBy(-1, 0)
      .lineBy(0, -u.endSect.hd)
      .lineBy(u.endSect.w, -u.endSect.hs)
      .lineBy(u.support.w > 0 ? u.support.w : 500, 0)
      .lineBy(500, 500)
      .offset(dist)
      .removeStart();
    return path;
  }
  protected drawCEnd(): void {
    const u = this.struct;
    const bar = this.specs.end.cOuter;
    const fig = this.figures.cEnd;
    const left = this.genShape();
    const right = left.mirrorByYAxis();
    fig.push(
      new PlaneRebar(fig.textHeight)
        .rebar(left)
        .spec(bar)
        .leaderNote(
          vec(-u.r - u.t - u.oBeam.w - 2 * fig.textHeight, u.hd / 2),
          vec(1, 0)
        )
        .generate(),
      new PlaneRebar(fig.textHeight)
        .rebar(right)
        .spec(bar)
        .leaderNote(
          vec(u.r + u.t + u.oBeam.w + 2 * fig.textHeight, u.hd / 2),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawLOuter(): void {
    const u = this.struct;
    const bar = this.specs.end.cOuter;
    const fig = this.figures.lOuter;
    const y0 = u.hd - u.as;
    const y1 = u.hd - u.endHeight + u.as;
    const y = fig.pos.findY(u.hd - 6*fig.h);
    const leftXs = new Line(
      vec(-u.len / 2 + u.cantLeft + u.as, 0),
      vec(-u.len / 2 + u.cantLeft + u.endSect.b - u.as, 0)
    )
      .divideByCount(bar.singleCount)
      .points.map((p) => p.x);
    const rightXs = new Line(
      vec(u.len / 2 - u.cantRight - u.as, 0),
      vec(u.len / 2 - u.cantRight - u.endSect.b + u.as, 0)
    )
      .divideByCount(bar.singleCount)
      .points.map((p) => p.x);
    fig.push(
      new PlaneRebar(fig.textHeight)
        .rebar(...leftXs.map((x) => new Line(vec(x, y0), vec(x, y1))))
        .spec(bar, bar.singleCount)
        .leaderNote(
          vec(
            -u.len / 2 - 2 * fig.textHeight,
            y
          ),
          vec(1, 0)
        )
        .generate(),
      new PlaneRebar(fig.textHeight)
        .rebar(...rightXs.map((x) => new Line(vec(x, y0), vec(x, y1))))
        .spec(bar, bar.singleCount)
        .leaderNote(
          vec(u.len / 2 + 2 * fig.textHeight, y),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawSEndWall(): void{
    const u = this.struct;
    const fig = this.figures.sEndWall;
    const bar = this.specs.end.cOuter;
    const r = fig.drawRadius;
    const y = -u.t - u.oBeam.w + u.as + r ;
    fig.push(
      new SparsePointRebar(fig.textHeight, r, 30)
        .points(...new Line(vec(u.as + r, y), vec(u.endSect.b - u.as - r, y)).divideByCount(bar.singleCount-1).points)
        .spec(bar, bar.singleCount)
        .parallelLeader(vec(-2*fig.textHeight, y-2*fig.textHeight - u.support.h), vec(-1, 0))
        .generate()
    );

  }
}
