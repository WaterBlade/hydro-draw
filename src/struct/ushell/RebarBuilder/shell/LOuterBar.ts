import {
  Line,
  Polyline,
  RebarFormPreset,
  Side,
  vec,
} from "@/draw";
import { Figure } from "@/struct/utils/Figure";
import { RebarBase } from "../Base";

export class LOuterBar extends RebarBase {
  buildSpec(): this {
    const u = this.struct;
    const bar = this.specs.shell.lOuter;
    const as = this.specs.as;
    const path = this.genPos()
      .offset(as + bar.diameter / 2)
      .removeStart()
      .removeStart()
      .divide(bar.space)
      .removeStartPt()
      .removeEndPt();
    bar
      .setCount(2 * path.points.length)
      .setForm(RebarFormPreset.Line(bar.diameter, u.len - 2 * as));
    bar.setId(this.specs.id.gen()).setStructure(this.name);
    this.specs.record(bar);
    return this;
  }
  buildPos(): this {
    const ys = this.genHalfPos();
    ys.reverse();
    this.figures.lOuter.pos.v.dot(...ys);
    return this;
  }
  buildFigure(): this {
    this.drawCMid();
    this.drawLOuter();
    if (this.struct.isLeftFigureExist()) this.drawSEndWall(this.figures.sEndWLeft);
    if (this.struct.isRightFigureExist()) this.drawSEndWall(this.figures.sEndWRight);
    if (this.struct.isLeftCantFigureExist())
      this.drawSEndWall(this.figures.sEndCantWLeft);
    if (this.struct.isRightCantFigureExist())
      this.drawSEndWall(this.figures.sEndCantWRight);
    return this;
  }
  protected genPos(): Polyline {
    const u = this.struct;
    const path = new Polyline(-u.shell.r + u.iBeam.w, u.shell.hd - 1)
      .lineBy(0, 1)
      .lineBy(-u.beamWidth, 0);
    if (u.oBeam.w > 0) {
      path
        .lineBy(0, -u.oBeam.hd)
        .lineBy(u.oBeam.w, -u.oBeam.hs)
        .lineBy(0, -u.shell.hd + u.oBeam.hd + u.oBeam.hs);
    } else {
      path.lineBy(0, -u.shell.hd);
    }
    const leftPt = u.transPt[0];
    const angle = u.transAngle;
    path
      .arcTo(leftPt.x, leftPt.y, angle)
      .lineTo(-u.shell.wb / 2, u.bottom)
      .lineTo(1, 0);
    return path;
  }
  protected genHalfPos(): number[] {
    const bar = this.specs.shell.lOuter;
    const as = this.specs.as;
    return Array.from(
      new Set(
        this.genPos()
          .offset(as)
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
    const as = this.specs.as;
    const pLeft = this.genPos()
      .offset(as + fig.drawRadius)
      .removeStart()
      .removeEnd()
      .divide(bar.space)
      .removeStartPt()
      .removeEndPt();
    
    const pRight = pLeft.mirrorByVAxis()
    fig.push(
      fig.polylinePointRebar()
        .spec(bar, bar.count / 2, bar.space)
        .polyline(pLeft)
        .offset(2 * fig.textHeight, Side.Right)
        .onlineNote(vec(-u.shell.r, -u.shell.r / 4))
        .generate(),
      fig.polylinePointRebar()
        .spec(bar, bar.count / 2, bar.space)
        .polyline(pRight)
        .offset(2 * fig.textHeight)
        .onlineNote(vec(u.shell.r, -u.shell.r / 4))
        .generate(),
    );
  }
  protected drawLOuter(): void {
    const u = this.struct;
    const bar = this.specs.shell.lOuter;
    const fig = this.figures.lOuter;
    const as = this.specs.as;
    const ys = this.genHalfPos();
    const start = -u.len / 2 + as;
    const end = u.len / 2 - as;

    const x = fig.pos.v.find((-0.8 * u.len) / 2);

    fig.push(
      fig.planeRebar()
        .spec(bar, 0, bar.space)
        .rebar(...ys.map((y) => new Line(vec(start, y), vec(end, y))))
        .leaderNote(
          vec(x, u.shell.hd + 2 * fig.textHeight),
          vec(0, 1),
          vec(-1, 0)
        )
        .generate()
    );
  }
  protected drawSEndWall(fig: Figure): void {
    const u = this.struct;
    const bar = this.specs.shell.lOuter;
    const as = this.specs.as;
    const left = fig.outline.getBoundingBox().left;
    const right = fig.outline.getBoundingBox().right;
    const y = -u.shell.t + as + fig.drawRadius;
    fig.push(
      fig.planeRebar()
        .rebar(new Line(vec(left + as, y), vec(right, y)))
        .spec(bar, 0, bar.space)
        .leaderNote(
          vec(u.endSect.b + 75, 4 * fig.textHeight),
          vec(0, 1),
          vec(1, 0)
        )
        .generate()
    );
  }
}
