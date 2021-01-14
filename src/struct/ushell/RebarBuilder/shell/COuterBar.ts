import {
  PlaneRebar,
  Line,
  Polyline,
  Side,
  StrecthSide,
  vec,
  Vector,
  RebarPathForm,
} from "@/draw";
import { Figure } from "@/struct/utils/Figure";
import { RebarBase } from "../Base";

export class COuterBar extends RebarBase {
  buildSpec(): this {
    const u = this.struct;
    const bar = this.specs.shell.cOuter;
    const angle = u.transAngle;
    const as = this.specs.as;
    const path = this.genShape().offset(as).removeStart().removeEnd();
    const lens = path.segments.map((s) => s.calcLength());
    if (lens.length < 7) throw Error("outer c bar length not init");
    const form = new RebarPathForm(bar.diameter)
      .lineBy(0, -1.5)
      .dimLength(lens[0], Side.Right)
      .arcBy(0.612, -1.44, 46)
      .dimArc(u.shell.r + u.shell.t - as, angle)
      .dimLength(lens[1])
      .lineBy(0.788, -0.756)
      .dimLength(lens[2], Side.Right)
      .lineBy(1.2, 0)
      .dimLength(lens[3], Side.Right)
      .lineBy(0.788, 0.756)
      .dimLength(lens[4], Side.Right)
      .arcBy(0.612, 1.44, 46)
      .dimLength(lens[5])
      .lineBy(0, 1.5)
      .dimLength(lens[6], Side.Right);
    bar.setForm(form);
    bar.setCount(
      this.genMulPos().reduce((pre: number, cur) => pre + cur.points.length, 0)
    );
    bar.setId(this.specs.id.gen()).setStructure(this.name);
    this.specs.record(bar);
    return this;
  }
  buildPos(): this {
    const paths = this.genMulPos();
    const xs = paths.reduce(
      (pre: number[], cur) => pre.concat(cur.points.map((p) => p.x)),
      []
    );
    this.figures.lOuter.pos.xPos = xs;
    return this;
  }
  buildFigure(): this {
    this.drawCMid();
    this.drawLInner();
    this.drawLOuter();
    if (this.struct.isLeftFigureExist()) {
      this.drawSEndBeam(this.figures.sEndBLeft);
      this.drawSEndWall(this.figures.sEndWLeft);
    }
    if (this.struct.isRightFigureExist()) {
      this.drawSEndBeam(this.figures.sEndBRight);
      this.drawSEndWall(this.figures.sEndWRight);
    }
    if (this.struct.isLeftCantFigureExist()) {
      this.drawSEndBeam(this.figures.sEndCantBLeft, true);
      this.drawSEndWall(this.figures.sEndCantWLeft, true);
    }
    if (this.struct.isRightCantFigureExist()) {
      this.drawSEndBeam(this.figures.sEndCantBRight, true);
      this.drawSEndWall(this.figures.sEndCantWRight, true);
    }

    return this;
  }
  protected genShape(): Polyline {
    const u = this.struct;
    const angle = u.transAngle;
    const [left, right] = u.transPt;
    const path = new Polyline(-u.shell.r - u.shell.t + 1, u.shell.hd)
      .lineBy(-1, 0)
      .lineBy(0, -u.shell.hd)
      .arcTo(left.x, left.y, angle)
      .lineTo(-u.shell.wb / 2, u.bottom)
      .lineBy(u.shell.wb, 0)
      .lineTo(right.x, right.y)
      .arcTo(u.shell.r + u.shell.t, 0, angle)
      .lineBy(0, u.shell.hd)
      .lineBy(-1, 0);
    return path;
  }
  protected genMulPos(offsetDist?: number): Line[] {
    const res: Line[] = [];
    const u = this.struct;
    const bar = this.specs.shell.cOuter;
    const as = this.specs.as;
    const y = -u.shell.r - u.shell.t - u.shell.hb;
    const endLeft = -u.len / 2 + u.cantLeft + u.endSect.b;
    const endRight = u.len / 2 - u.cantRight - u.endSect.b;
    const left = -u.len / 2 + u.cantLeft + this.specs.denseL;
    const right = u.len / 2 - u.cantRight - this.specs.denseL;

    const dist = offsetDist ? offsetDist : as;

    if (u.cantLeft > 0) {
      res.push(
        new Line(vec(-u.len / 2 + as, y), vec(-u.len / 2 + u.cantLeft, y))
          .offset(dist)
          .divide(bar.denseSpace)
          .removeEndPt()
      );
    }
    res.push(
      new Line(vec(endLeft, y), vec(left, y))
        .offset(dist)
        .divide(bar.denseSpace)
        .removeStartPt(),
      new Line(vec(left, y), vec(right, y))
        .offset(dist)
        .divide(bar.space)
        .removeStartPt()
        .removeEndPt(),
      new Line(vec(right, y), vec(endRight, y))
        .offset(dist)
        .divide(bar.denseSpace)
        .removeEndPt()
    );
    if (u.cantRight > 0) {
      res.push(
        new Line(vec(u.len / 2 - u.cantRight, y), vec(u.len / 2 - as, y))
          .offset(dist)
          .divide(bar.denseSpace)
          .removeStartPt()
      );
    }
    return res;
  }
  protected drawCMid(): void {
    const u = this.struct;
    const bar = this.specs.shell.cOuter;
    const as = this.specs.as;
    const fig = this.figures.cMid;
    const path = this.genShape().offset(as).removeStart().removeEnd();
    const pt = vec(-u.shell.r - u.shell.t - 3 * fig.textHeight, u.shell.hd / 5);
    fig.push(
      new PlaneRebar(fig.textHeight)
        .spec(bar, 0, bar.space)
        .rebar(path)
        .leaderNote(pt, vec(1, 0))
        .generate()
    );
  }
  protected drawLInner(): void {
    const u = this.struct;
    const bar = this.specs.shell.cOuter;
    const fig = this.figures.lInner;
    const paths = this.genMulPos();
    let i = 0;
    const y = -u.shell.r - u.shell.tb - 1.5 * fig.h;
    if (u.cantLeft > 0) {
      const path = paths[i++];
      fig.push(
        fig
          .sparsePointRebar()
          .points(...path.points)
          .spec(bar, path.points.length, bar.denseSpace)
          .parallelLeader(vec(-u.len / 2 - fig.h, y), vec(1, 0))
          .generate()
      );
    }
    fig.push(
      fig
        .linePointRebar()
        .line(paths[i])
        .offset(2 * fig.textHeight, Side.Right)
        .spec(bar, paths[i++].points.length, bar.denseSpace)
        .onlineNote()
        .generate(),
      fig
        .linePointRebar()
        .line(paths[i])
        .offset(2 * fig.textHeight, Side.Right)
        .spec(bar, paths[i++].points.length, bar.denseSpace)
        .onlineNote()
        .generate(),
      fig
        .linePointRebar()
        .line(paths[i])
        .offset(2 * fig.textHeight, Side.Right)
        .spec(bar, paths[i++].points.length, bar.denseSpace)
        .onlineNote()
        .generate()
    );
    if (u.cantRight > 0) {
      const path = paths[i++];
      fig.push(
        fig
          .sparsePointRebar()
          .points(...path.points)
          .spec(bar, path.points.length, bar.denseSpace)
          .parallelLeader(vec(u.len / 2 + fig.h, y), vec(1, 0))
          .generate()
      );
    }
  }
  protected drawLOuter(): void {
    const u = this.struct;
    const bar = this.specs.shell.cOuter;
    const fig = this.figures.lOuter;
    const as = this.specs.as;
    const paths = this.genMulPos();
    const top = u.shell.hd - as;

    const pts = paths.reduce(
      (pre: Vector[], cur) => pre.concat(cur.points),
      []
    );
    const lines = pts.map((p) => new Line(vec(p.x, top), p));

    const y = fig.pos.findY(u.shell.hd - 2 * fig.h);

    fig.push(
      new PlaneRebar(fig.textHeight)
        .rebar(...lines)
        .spec(bar, pts.length)
        .leaderNote(vec(-u.len / 2 - 2 * fig.textHeight, y), vec(1, 0))
        .generate()
    );
  }
  protected drawSEndBeam(fig: Figure, isCant = false): void {
    const u = this.struct;
    const bar = this.specs.shell.cOuter;
    const as = this.specs.as;
    const right = fig.outline.getBoundingBox().right;
    const y = -u.shell.t - u.shell.hb + as;
    const rebar = fig
      .sparsePointRebar(30)
      .points(
        ...new Line(vec(u.endSect.b, y), vec(right, y))
          .divide(bar.denseSpace, StrecthSide.tail)
          .removeStartPt()
          .removeEndPt().points
      );
    if (isCant) {
      const left = fig.outline.getBoundingBox().left;
      rebar.points(
        ...new Line(vec(left + as, y), vec(0, y))
          .divide(bar.denseSpace, StrecthSide.tail)
          .removeEndPt().points
      );
    }
    fig.push(
      rebar
        .spec(bar, 0, bar.denseSpace)
        .parallelLeader(
          vec(right + fig.textHeight, y - 2 * fig.textHeight),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawSEndWall(fig: Figure, isCant = false): void {
    const u = this.struct;
    const bar = this.specs.shell.cOuter;
    const as = this.specs.as;
    const right = fig.outline.getBoundingBox().right;
    const y = -u.shell.t + as;
    const rebar = fig
      .sparsePointRebar(30)
      .points(
        ...new Line(vec(u.endSect.b, y), vec(right, y))
          .divide(bar.denseSpace, StrecthSide.tail)
          .removeStartPt()
          .removeEndPt().points
      );
    if (isCant) {
      const left = fig.outline.getBoundingBox().left;
      rebar.points(
        ...new Line(vec(left + as, y), vec(0, y))
          .divide(bar.denseSpace, StrecthSide.tail)
          .removeEndPt().points
      );
    }
    fig.push(
      rebar
        .spec(bar, 0, bar.denseSpace)
        .parallelLeader(
          vec(right + fig.textHeight, y - 2 * fig.textHeight),
          vec(1, 0)
        )
        .generate()
    );
  }
}
