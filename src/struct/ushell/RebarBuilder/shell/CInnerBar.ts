import {
  PlaneRebar,
  Line,
  LinePointRebar,
  Polyline,
  Side,
  SparsePointRebar,
  StrecthSide,
  vec,
  RebarPathForm,
} from "@/draw";
import { Figure } from "@/struct/Figure";
import { RebarBase } from "../Base";

export class CInnerBar extends RebarBase {
  buildSpec(): this {
    const u = this.struct;
    const bar = this.specs.shell.cInner;
    const as = this.specs.as;
    const path = this.genShape()
      .offset(as, Side.Right)
      .removeStart()
      .removeEnd();
    const lens = path.segments.map((s) => s.calcLength());
    const form = new RebarPathForm(bar.diameter)
      .lineBy(0, -1.6)
      .dimLength(lens[0])
      .arcBy(4, 0, 180)
      .dimArc(u.shell.r + as)
      .dimLength(lens[1])
      .lineBy(0, 1.6)
      .dimLength(lens[2]);

    bar.setForm(form);
    bar.setCount(
      this.genMulPos().reduce((pre: number, cur) => pre + cur.points.length, 0)
    );
    bar.setId(this.specs.id.gen()).setStructure(this.name);
    this.specs.record(bar);
    return this;
  }
  buildFigure(): this {
    this.drawCMid();
    this.drawCEndCant();
    this.drawLInner();
    if (this.struct.isLeftExist()) {
      this.drawSEndBeam(this.figures.sEndBLeft);
      this.drawSEndWall(this.figures.sEndWLeft);
    }
    if (this.struct.isRightExist()) {
      this.drawSEndBeam(this.figures.sEndBRight);
      this.drawSEndWall(this.figures.sEndWRight);
    }
    if (this.struct.isLeftCantExist()) {
      this.drawSEndCantBeam(this.figures.sEndCantBLeft);
      this.drawSEndCantWall(this.figures.sEndCantWLeft);
    }
    if (this.struct.isRightCantExist()) {
      this.drawSEndCantBeam(this.figures.sEndCantBRight);
      this.drawSEndCantWall(this.figures.sEndCantWRight);
    }
    return this;
  }
  protected genShape(): Polyline {
    const u = this.struct;
    const path = new Polyline(-u.shell.r - 1, u.shell.hd)
      .lineBy(1, 0)
      .lineBy(0, -u.shell.hd)
      .arcBy(2 * u.shell.r, 0, 180)
      .lineBy(0, u.shell.hd)
      .lineBy(1, 0);
    return path;
  }
  protected genMulPos(offsetDist?: number): Line[] {
    const u = this.struct;
    const bar = this.specs.shell.cInner;
    const as = this.specs.as;
    const res: Line[] = [];
    const y = -u.shell.r;
    const midLeft = -u.len / 2 + u.cantLeft + this.specs.denseL;
    const midRight = u.len / 2 - u.cantRight - this.specs.denseL;

    let left: number;
    if (u.cantLeft > 0) {
      left = -u.len / 2 + u.waterStop.w + as;
    } else {
      left = -u.len / 2 + u.endSect.b;
    }
    let right: number;
    if (u.cantRight > 0) {
      right = u.len / 2 - u.waterStop.w - as;
    } else {
      right = u.len / 2 - u.endSect.b;
    }

    const dist = offsetDist ? offsetDist : as;

    res.push(
      new Line(vec(left, y), vec(midLeft, y))
        .offset(dist, Side.Right)
        .divide(bar.denseSpace)
        .removeStartPt(),
      new Line(vec(midLeft, y), vec(midRight, y))
        .offset(dist, Side.Right)
        .divide(bar.space)
        .removeStartPt()
        .removeEndPt(),
      new Line(vec(midRight, y), vec(right, y))
        .offset(dist, Side.Right)
        .divide(bar.denseSpace)
        .removeEndPt()
    );
    return res;
  }
  protected drawCMid(): void {
    const u = this.struct;
    const bar = this.specs.shell.cInner;
    const fig = this.figures.cMid;
    const as = this.specs.as;
    const path = this.genShape()
      .offset(as, Side.Right)
      .removeStart()
      .removeEnd();
    const pt = vec(-u.shell.r + 3 * fig.textHeight, u.shell.hd / 5);
    fig.push(
      new PlaneRebar(fig.textHeight)
        .spec(bar, 0, bar.space)
        .rebar(path)
        .leaderNote(pt, vec(1, 0))
        .generate()
    );
  }
  protected drawCEndCant(): void {
    if (this.struct.hasCant()) {
      const u = this.struct;
      const bar = this.specs.shell.cInner;
      const fig = this.figures.cEndCant;
      const as = this.specs.as;
      const path = this.genShape()
        .offset(as, Side.Right)
        .removeStart()
        .removeEnd();
      const pt = vec(-u.shell.r + 3 * fig.textHeight, u.shell.hd / 5);
      fig.push(
        new PlaneRebar(fig.textHeight)
          .spec(bar, 0, bar.space)
          .rebar(path)
          .leaderNote(pt, vec(1, 0))
          .generate()
      );
    }
  }
  protected drawLInner(): void {
    const bar = this.specs.shell.cInner;
    const fig = this.figures.lInner;
    const paths = this.genMulPos();
    fig.push(
      new LinePointRebar(fig.textHeight, fig.drawRadius)
        .line(paths[0])
        .offset(2 * fig.textHeight)
        .spec(bar, paths[0].points.length, bar.denseSpace)
        .onlineNote()
        .generate(),
      new LinePointRebar(fig.textHeight, fig.drawRadius)
        .line(paths[1])
        .offset(2 * fig.textHeight)
        .spec(bar, paths[1].points.length, bar.space)
        .onlineNote()
        .generate(),
      new LinePointRebar(fig.textHeight, fig.drawRadius)
        .line(paths[2])
        .offset(2 * fig.textHeight)
        .spec(bar, paths[2].points.length, bar.denseSpace)
        .onlineNote()
        .generate()
    );
  }
  protected drawSEndBeam(fig: Figure): void {
    const u = this.struct;
    const bar = this.specs.shell.cInner;
    const r = fig.drawRadius;
    const as = this.specs.as;
    const right = fig.outline.getBoundingBox().right;
    fig.push(
      new SparsePointRebar(fig.textHeight, r, 30)
        .points(
          ...new Line(vec(u.endSect.b, -as + r), vec(right, -as + r))
            .divide(bar.denseSpace, StrecthSide.tail)
            .removeStartPt()
            .removeEndPt().points
        )
        .spec(bar, 0, bar.denseSpace)
        .parallelLeader(
          vec(right + fig.textHeight, 2 * fig.textHeight),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawSEndCantBeam(fig: Figure): void {
    const u = this.struct;
    const bar = this.specs.shell.cInner;
    const r = fig.drawRadius;
    const as = this.specs.as;
    const left = fig.outline.getBoundingBox().left + u.waterStop.w + as + fig.r;
    const right = fig.outline.getBoundingBox().right;
    fig.push(
      new SparsePointRebar(fig.textHeight, r, 30)
        .points(
          ...new Line(vec(left, -as + r), vec(right, -as + r))
            .divide(bar.denseSpace, StrecthSide.tail)
            .removeEndPt().points
        )
        .spec(bar, 0, bar.denseSpace)
        .parallelLeader(
          vec(right + fig.textHeight, 2 * fig.textHeight),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawSEndWall(fig: Figure): void {
    const u = this.struct;
    const bar = this.specs.shell.cInner;
    const r = fig.drawRadius;
    const as = this.specs.as;
    const right = fig.outline.getBoundingBox().right;
    fig.push(
      new SparsePointRebar(fig.textHeight, r, 30)
        .points(
          ...new Line(vec(u.endSect.b, -as + r), vec(right, -as + r))
            .divide(bar.denseSpace, StrecthSide.tail)
            .removeStartPt()
            .removeEndPt().points
        )
        .spec(bar, 0, bar.denseSpace)
        .parallelLeader(
          vec(right + fig.textHeight, 2 * fig.textHeight),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawSEndCantWall(fig: Figure): void {
    const u = this.struct;
    const bar = this.specs.shell.cInner;
    const r = fig.drawRadius;
    const as = this.specs.as;
    const left = fig.outline.getBoundingBox().left + u.waterStop.w + as + fig.r;
    const right = fig.outline.getBoundingBox().right;
    fig.push(
      new SparsePointRebar(fig.textHeight, r, 30)
        .points(
          ...new Line(vec(left, -as + r), vec(right, -as + r))
            .divide(bar.denseSpace, StrecthSide.tail)
            .removeEndPt().points
        )
        .spec(bar, 0, bar.denseSpace)
        .parallelLeader(
          vec(right + fig.textHeight, 2 * fig.textHeight),
          vec(1, 0)
        )
        .generate()
    );
  }
}
