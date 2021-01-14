import {
  PlaneRebar,
  Circle,
  Line,
  LinePointRebar,
  Polyline,
  Side,
  SparsePointRebar,
  vec,
  RebarPathForm,
} from "@/draw";
import { Figure } from "@/struct/Figure";
import { RebarBase } from "../Base";

export class CInnerSubBar extends RebarBase {
  buildSpec(): this {
    const u = this.struct;
    const bar = this.specs.shell.cInnerSub;
    const parent = this.specs.shell.cInner;
    const as = this.specs.as;
    const id = parent.id;
    const lens = this.genShape().lengths;

    let count = 0;
    if (u.cantLeft > 0) {
      count += 1;
    } else {
      count += this.specs.end.cOuter.singleCount;
    }
    if (u.cantRight > 0) {
      count += 1;
    } else {
      count += this.specs.end.cOuter.singleCount;
    }
    bar
      .setGrade(parent.grade)
      .setDiameter(parent.diameter)
      .setForm(
        new RebarPathForm(bar.diameter)
          .lineBy(0, -1.6)
          .dimLength(lens[0])
          .arcBy(4, 0, 180)
          .dimArc(u.shell.r + u.waterStop.h + as)
          .dimLength(lens[1])
          .lineBy(0, 1.6)
          .dimLength(lens[2])
      )
      .setCount(count)
      .setId(id + "a")
      .setStructure(this.name);
    this.specs.record(bar);
    return this;
  }
  buildFigure(): this {
    this.drawCEnd();
    this.drawLInner();
    if (this.struct.isLeftExist()) {
      this.drawSEndBeam(this.figures.sEndBLeft);
      this.drawSEndWall(this.figures.sEndWLeft);
    }
    if (this.struct.isRightExist()) {
      this.drawSEndBeam(this.figures.sEndBRight);
      this.drawSEndWall(this.figures.sEndWRight);
    }
    return this;
  }
  protected genShape(offsetDist?: number): Polyline {
    const u = this.struct;
    const as = this.specs.as;
    const dist = offsetDist ? offsetDist : as;
    return new Polyline(-u.shell.r - u.waterStop.h - 1, u.shell.hd)
      .lineBy(1, 0)
      .lineBy(0, -u.shell.hd)
      .arcBy(2 * u.shell.r + 2 * u.waterStop.h, 0, 180)
      .lineBy(0, u.shell.hd)
      .lineBy(1, 0)
      .offset(dist, Side.Right)
      .removeStart()
      .removeEnd();
  }
  protected drawCEnd(): void {
    if (this.struct.hasUnCant()) {
      const u = this.struct;
      const bar = this.specs.shell.cInnerSub;
      const fig = this.figures.cEnd;
      fig.push(
        new PlaneRebar(fig.textHeight)
          .rebar(this.genShape())
          .spec(bar)
          .leaderNote(vec(u.shell.r - 2 * fig.textHeight, 0), vec(1, 0))
          .generate()
      );
    }
  }
  protected drawLInner(): void {
    const u = this.struct;
    const bar = this.specs.shell.cInnerSub;
    const fig = this.figures.lInner;
    const as = this.specs.as;
    const r = fig.drawRadius;
    const count = this.specs.end.cOuter.singleCount;
    const y = -u.shell.r - u.waterStop.h - as;
    const x0 = -u.len / 2 + as + r;
    if (u.cantLeft > 0) {
      fig.push(new Circle(vec(x0, y), r).thickLine());
    } else {
      fig.push(
        new LinePointRebar(fig.textHeight, fig.drawRadius)
          .line(
            new Line(
              vec(x0, y),
              vec(x0 + u.endSect.b - 2 * as - 2 * r, y)
            ).divideByCount(count - 1)
          )
          .offset(2 * fig.textHeight)
          .spec(bar, count)
          .onlineNote()
          .generate()
      );
    }
    const x1 = u.len / 2 - as - r;
    if (u.cantRight > 0) {
      fig.push(new Circle(vec(x1, y), r).thickLine());
    } else {
      fig.push(
        new LinePointRebar(fig.textHeight, fig.drawRadius)
          .line(
            new Line(
              vec(x1 - u.endSect.b + 2 * as + 2 * r, y),
              vec(x1, y)
            ).divideByCount(count - 1)
          )
          .offset(2 * fig.textHeight)
          .spec(bar, count)
          .onlineNote()
          .generate()
      );
    }
  }
  protected drawSEndBeam(fig: Figure): void {
    const u = this.struct;
    const bar = this.specs.shell.cInnerSub;
    const r = fig.drawRadius;
    const as = this.specs.as;
    const y = -u.waterStop.h - as + r;
    const count = this.specs.end.cOuter.singleCount;
    fig.push(
      new SparsePointRebar(fig.textHeight, r, 30)
        .points(
          ...new Line(
            vec(as + r, y),
            vec(u.endSect.b - as - r, y)
          ).divideByCount(count - 1).points
        )
        .spec(bar, count)
        .parallelLeader(
          vec(-2 * fig.textHeight, y + 2 * fig.textHeight + u.waterStop.h),
          vec(-1, 0)
        )
        .generate()
    );
  }
  protected drawSEndWall(fig: Figure): void {
    const u = this.struct;
    const bar = this.specs.shell.cInnerSub;
    const r = fig.drawRadius;
    const as = this.specs.as;
    const y = -u.waterStop.h - as - r;
    const count = this.specs.end.cOuter.singleCount;
    fig.push(
      new SparsePointRebar(fig.textHeight, r, 30)
        .points(
          ...new Line(
            vec(as + r, y),
            vec(u.endSect.b - as - r, y)
          ).divideByCount(count - 1).points
        )
        .spec(bar, count)
        .parallelLeader(
          vec(-2 * fig.textHeight, y + 2 * fig.textHeight + u.waterStop.h),
          vec(-1, 0)
        )
        .generate()
    );
  }
}
