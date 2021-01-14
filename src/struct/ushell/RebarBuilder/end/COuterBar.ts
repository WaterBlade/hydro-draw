import {
  PlaneRebar,
  Line,
  Polyline,
  Side,
  SparsePointRebar,
  toDegree,
  vec,
  RebarPathForm,
} from "@/draw";
import { Figure } from "@/struct/Figure";
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
      .setId(this.specs.id.gen())
      .setStructure(this.name);
    this.specs.record(bar);
    return this;
  }
  buildFigure(): this {
    if (this.struct.hasUnCant()) this.drawCEnd(this.figures.cEnd);
    if (this.struct.hasCant()) this.drawCEnd(this.figures.cEndCant);
    this.drawLOuter();
    if (this.struct.isLeftExist()) this.drawSEndWall(this.figures.sEndWLeft);
    if (this.struct.isRightExist()) this.drawSEndWall(this.figures.sEndWRight);
    if (this.struct.isLeftCantExist())
      this.drawSEndWall(this.figures.sEndCantWLeft);
    if (this.struct.isRightCantExist())
      this.drawSEndWall(this.figures.sEndCantWRight);
    return this;
  }
  protected genShape(offDist?: number): Polyline {
    const u = this.struct;
    const as = this.specs.as;
    const dist = offDist ? offDist : as;
    const path = new Polyline(
      -u.shell.r - u.shell.t - u.oBeam.w + 1,
      u.shell.hd
    )
      .lineBy(-1, 0)
      .lineBy(0, -u.endSect.hd)
      .lineBy(u.endSect.w, -u.endSect.hs)
      .lineBy(u.support.w > 0 ? u.support.w : 500, 0)
      .lineBy(500, 500)
      .offset(dist)
      .removeStart();
    return path;
  }
  protected drawCEnd(fig: Figure): void {
    const u = this.struct;
    const bar = this.specs.end.cOuter;
    const left = this.genShape();
    const right = left.mirrorByVAxis();
    fig.push(
      new PlaneRebar(fig.textHeight)
        .rebar(left)
        .spec(bar)
        .leaderNote(
          vec(
            -u.shell.r - u.shell.t - u.oBeam.w - 2 * fig.textHeight,
            u.shell.hd / 2
          ),
          vec(1, 0)
        )
        .generate(),
      new PlaneRebar(fig.textHeight)
        .rebar(right)
        .spec(bar)
        .leaderNote(
          vec(
            u.shell.r + u.shell.t + u.oBeam.w + 2 * fig.textHeight,
            u.shell.hd / 2
          ),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawLOuter(): void {
    const u = this.struct;
    const bar = this.specs.end.cOuter;
    const fig = this.figures.lOuter;
    const as = this.specs.as;
    const y0 = u.shell.hd - as;
    const y1 = u.shell.hd - u.endHeight + as;
    const y = fig.pos.findY(u.shell.hd - 6 * fig.h);
    const leftXs = new Line(
      vec(-u.len / 2 + u.cantLeft + as, 0),
      vec(-u.len / 2 + u.cantLeft + u.endSect.b - as, 0)
    )
      .divideByCount(bar.singleCount)
      .points.map((p) => p.x);
    const rightXs = new Line(
      vec(u.len / 2 - u.cantRight - as, 0),
      vec(u.len / 2 - u.cantRight - u.endSect.b + as, 0)
    )
      .divideByCount(bar.singleCount)
      .points.map((p) => p.x);
    fig.push(
      new PlaneRebar(fig.textHeight)
        .rebar(...leftXs.map((x) => new Line(vec(x, y0), vec(x, y1))))
        .spec(bar, bar.singleCount)
        .leaderNote(vec(-u.len / 2 - 2 * fig.textHeight, y), vec(1, 0))
        .generate(),
      new PlaneRebar(fig.textHeight)
        .rebar(...rightXs.map((x) => new Line(vec(x, y0), vec(x, y1))))
        .spec(bar, bar.singleCount)
        .leaderNote(vec(u.len / 2 + 2 * fig.textHeight, y), vec(1, 0))
        .generate()
    );
  }
  protected drawSEndWall(fig: Figure): void {
    const u = this.struct;
    const bar = this.specs.end.cOuter;
    const as = this.specs.as;
    const r = fig.drawRadius;
    const y = -u.shell.t - u.oBeam.w + as + r;
    fig.push(
      new SparsePointRebar(fig.textHeight, r, 30)
        .points(
          ...new Line(
            vec(as + r, y),
            vec(u.endSect.b - as - r, y)
          ).divideByCount(bar.singleCount - 1).points
        )
        .spec(bar, bar.singleCount)
        .parallelLeader(
          vec(-2 * fig.textHeight, y - 2 * fig.textHeight - u.support.h),
          vec(-1, 0)
        )
        .generate()
    );
  }
}
