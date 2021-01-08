import {
  PlaneRebar,
  Line,
  LinePointRebar,
  Polyline,
  RebarPathForm,
  Side,
  SparsePointRebar,
  StrecthSide,
  vec,
  Vector,
} from "@/draw";
import { RebarBase } from "../Base";

export class COuterBar extends RebarBase {
  buildSpec(): this {
    const u = this.struct;
    const bar = this.specs.shell.cOuter;
    const angle = u.transAngle;
    const path = this.genShape().offset(u.as).removeStart().removeEnd();
    const lens = path.segments.map((s) => s.calcLength());
    if (lens.length < 7) throw Error("outer c bar length not init");
    const form = new RebarPathForm(bar.diameter)
      .lineBy(0, -1.5)
      .dimLength(lens[0], Side.Right)
      .arcBy(0.612, -1.44, 46)
      .dimArc(u.r + u.t - u.as, angle)
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
    bar.setId(this.id()).setStructure(this.name);
    this.specs.record(bar);
    return this;
  }
  buildPos(): this{
    const paths = this.genMulPos();
    const xs = paths.reduce(
      (pre: number[], cur) => pre.concat(cur.points.map(p => p.x)),
      []
    );
    this.figures.lOuter.pos.xPos = xs;
    return this;
  }
  buildFigure(): this {
    this.drawCMid();
    this.drawLInner();
    this.drawLOuter();
    this.drawSEndBeam();
    this.drawSEndWall();

    return this;
  }
  protected genShape(): Polyline {
    const u = this.struct;
    const angle = u.transAngle;
    const [left, right] = u.transPt;
    const path = new Polyline(-u.r - u.t + 1, u.hd)
      .lineBy(-1, 0)
      .lineBy(0, -u.hd)
      .arcTo(left.x, left.y, angle)
      .lineTo(-u.butt.w / 2, u.bottom)
      .lineBy(u.butt.w, 0)
      .lineTo(right.x, right.y)
      .arcTo(u.r + u.t, 0, angle)
      .lineBy(0, u.hd)
      .lineBy(-1, 0);
    return path;
  }
  protected genMulPos(offsetDist?: number): Line[] {
    const res: Line[] = [];
    const u = this.struct;
    const bar = this.specs.shell.cOuter;
    const y = -u.r - u.t - u.butt.h;
    const endLeft = -u.len / 2 + u.cantLeft + u.endSect.b;
    const endRight = u.len / 2 - u.cantRight - u.endSect.b;
    const left = -u.len / 2 + u.cantLeft + u.denseL;
    const right = u.len / 2 - u.cantRight - u.denseL;

    const dist = offsetDist ? offsetDist : u.as;

    if (u.cantLeft > 0) {
      res.push(
        new Line(vec(-u.len / 2 + u.as, y), vec(-u.len / 2 + u.cantLeft, y))
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
        new Line(vec(u.len / 2 - u.cantRight, y), vec(u.len / 2 - u.as, y))
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
    const fig = this.figures.cMid;
    const path = this.genShape().offset(u.as).removeStart().removeEnd();
    const pt = vec(-u.r - u.t - 3 * fig.textHeight, u.hd / 5);
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
    if (u.cantLeft > 0) {
      const path = paths[i++];
      fig.push(
        new LinePointRebar(fig.textHeight, fig.drawRadius)
          .line(path)
          .offset(2 * fig.textHeight, Side.Right)
          .spec(bar, path.points.length, bar.denseSpace)
          .onlineNote()
          .generate()
      );
    }
    fig.push(
      new LinePointRebar(fig.textHeight, fig.drawRadius)
        .line(paths[i])
        .offset(2 * fig.textHeight, Side.Right)
        .spec(bar, paths[i++].points.length, bar.denseSpace)
        .onlineNote()
        .generate(),
      new LinePointRebar(fig.textHeight, fig.drawRadius)
        .line(paths[i])
        .offset(2 * fig.textHeight, Side.Right)
        .spec(bar, paths[i++].points.length, bar.denseSpace)
        .onlineNote()
        .generate(),
      new LinePointRebar(fig.textHeight, fig.drawRadius)
        .line(paths[i])
        .offset(2 * fig.textHeight, Side.Right)
        .spec(bar, paths[i++].points.length, bar.denseSpace)
        .onlineNote()
        .generate()
    );
    if (u.cantRight > 0) {
      const path = paths[i++];
      fig.push(
        new LinePointRebar(fig.textHeight, fig.drawRadius)
          .line(path)
          .offset(2 * fig.textHeight, Side.Right)
          .spec(bar, path.points.length, bar.denseSpace)
          .onlineNote()
          .generate()
      );
    }
  }
  protected drawLOuter(): void {
    const u = this.struct;
    const bar = this.specs.shell.cOuter;
    const fig = this.figures.lOuter;
    const paths = this.genMulPos();
    const top = u.hd - u.as;

    const pts = paths.reduce(
      (pre: Vector[], cur) => pre.concat(cur.points),
      []
    );
    const lines = pts.map((p) => new Line(vec(p.x, top), p));

    const y = fig.pos.findY(u.hd - 2 * fig.h);

    fig.push(
      new PlaneRebar(fig.textHeight)
        .rebar(...lines)
        .spec(bar, pts.length)
        .leaderNote(
          vec(-u.len / 2 - 2 * fig.textHeight, y),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawSEndBeam(): void{
    const u = this.struct;
    const fig = this.figures.sEndBeam;
    const bar = this.specs.shell.cOuter;
    const r = fig.drawRadius;
    const right = fig.outline.getBoundingBox().right;
    const y = -u.t - u.butt.h + u.as;
    fig.push(
      new SparsePointRebar(fig.textHeight, r, 30)
        .points(...new Line(vec(u.endSect.b, y), vec(right, y)).divide(bar.denseSpace, StrecthSide.tail).removeStartPt().removeEndPt().points)
        .spec(bar, 0, bar.denseSpace)
        .parallelLeader(vec(right + fig.textHeight, y - 2*fig.textHeight), vec(1, 0))
        .generate()
    )
  }
  protected drawSEndWall(): void{
    const u = this.struct;
    const fig = this.figures.sEndWall;
    const bar = this.specs.shell.cOuter;
    const r = fig.drawRadius;
    const right = fig.outline.getBoundingBox().right;
    const y = -u.t + u.as;
    fig.push(
      new SparsePointRebar(fig.textHeight, r, 30)
        .points(...new Line(vec(u.endSect.b, y), vec(right, y)).divide(bar.denseSpace, StrecthSide.tail).removeStartPt().removeEndPt().points)
        .spec(bar, 0, bar.denseSpace)
        .parallelLeader(vec(right + fig.textHeight, y-2*fig.textHeight), vec(1, 0))
        .generate()
    )
  }
}
