import {
  PlaneRebar,
  Line,
  PolylinePointRebar,
  Polyline,
  RebarPathForm,
  Side,
  vec,
} from "@/draw";
import { RebarBase } from "../Base";

export class LOuterBar extends RebarBase {
  buildSpec(): this {
    const u = this.struct;
    const bar = this.specs.shell.lOuter;
    const path = this.genPos()
      .offset(u.as + bar.diameter / 2)
      .removeStart()
      .removeStart()
      .divide(bar.space)
      .removeStartPt()
      .removeEndPt();
    bar
      .setCount(2 * path.points.length)
      .setForm(RebarPathForm.Line(bar.diameter, u.len - 2 * u.as));
    bar.setId(this.id()).setStructure(this.name);
    this.specs.record(bar);
    return this;
  }
  buildPos(): this{
    const ys = this.genHalfPos();
    ys.reverse();
    this.figures.lOuter.pos.yPos = ys;
    return this;
  }
  buildFigure(): this {
    this.drawCMid();
    this.drawLOuter();
    this.drawSEndWall();
    return this;
  }
  protected genPos(): Polyline {
    const u = this.struct;
    const path = new Polyline(-u.r + u.iBeam.w, u.hd - 1)
      .lineBy(0, 1)
      .lineBy(-u.beamWidth, 0);
    if (u.oBeam.w > 0) {
      path
        .lineBy(0, -u.oBeam.hd)
        .lineBy(u.oBeam.w, -u.oBeam.hs)
        .lineBy(0, -u.hd + u.oBeam.hd + u.oBeam.hs);
    } else {
      path.lineBy(0, -u.hd);
    }
    const leftPt = u.transPt[0];
    const angle = u.transAngle;
    path
      .arcTo(leftPt.x, leftPt.y, angle)
      .lineTo(-u.butt.w / 2, u.bottom)
      .lineTo(1, 0);
    return path;
  }
  protected genHalfPos(): number[]{
    const u = this.struct;
    const bar = this.specs.shell.lOuter;
    return Array.from(
      new Set(
        this.genPos()
          .offset(u.as)
          .removeStart()
          .removeEnd()
          .divide(bar.space)
          .removeStartPt()
          .removeEndPt()
          .points.map((p) => p.y)
      ).values()
    );
  }
  protected drawCMid(): void {
    const u = this.struct;
    const bar = this.specs.shell.lOuter;
    const fig = this.figures.cMid;
    const pLeft = this.genPos()
      .offset(u.as + fig.drawRadius)
      .removeStart()
      .removeEnd()
      .divide(bar.space)
      .removeStartPt()
      .removeEndPt();
    const pRight = pLeft.mirrorByYAxis();
    fig.push(
      new PolylinePointRebar(fig.textHeight, fig.drawRadius)
        .spec(bar, bar.count / 2, bar.space)
        .polyline(pLeft)
        .offset(2 * fig.textHeight, Side.Right)
        .onlineNote(vec(-u.r, -u.r / 4))
        .generate(),
      new PolylinePointRebar(fig.textHeight, fig.drawRadius)
        .spec(bar, bar.count / 2, bar.space)
        .polyline(pRight)
        .offset(2 * fig.textHeight)
        .onlineNote(vec(u.r, -u.r / 4), true)
        .generate()
    );
  }
  protected drawLOuter(): void {
    const u = this.struct;
    const bar = this.specs.shell.lOuter;
    const fig = this.figures.lOuter;
    const ys = this.genHalfPos();
    const start = -u.len / 2 + u.as;
    const end = u.len / 2 - u.as;

    const x = fig.pos.findX(-0.8 * u.len/2);

    fig.push(
      new PlaneRebar(fig.textHeight)
        .spec(bar, 0, bar.space)
        .rebar(...ys.map((y) => new Line(vec(start, y), vec(end, y))))
        .leaderNote(
          vec(x, u.hd + 2 * fig.textHeight),
          vec(0, 1),
          vec(-1, 0)
        )
        .generate()
    );
  }
  protected drawSEndWall(): void{
    const u = this.struct;
    const bar = this.specs.shell.lOuter;
    const fig = this.figures.sEndWall;
    const right = fig.outline.getBoundingBox().right;
    const y = -u.t + u.as + fig.drawRadius;
    fig.push(
      new PlaneRebar(fig.textHeight)
        .rebar(new Line(vec(u.as, y), vec(right, y)))
        .spec(bar, 0, bar.space)
        .leaderNote(vec(u.endSect.b + 75, 4*fig.textHeight), vec(0, 1), vec(1, 0))
        .generate()
    );
  }
}
