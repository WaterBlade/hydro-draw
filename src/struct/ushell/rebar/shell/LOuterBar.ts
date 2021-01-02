import {
  ArrowNote,
  Line,
  PathPointNote,
  Polyline,
  RebarPathForm,
  Side,
  vec,
} from "@/draw";
import { UShellRebarBuilder } from "../../UShellRebar";

export class LOuterBar extends UShellRebarBuilder {
  buildRebar(): this {
    const u = this.struct;
    const bar = this.rebars.shell.lOuter;
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
    return this;
  }
  buildFigure(): this {
    this.drawCMid();
    this.drawLOuter();
    const bar = this.rebars.shell.lOuter;
    this.figures.rTable.push(bar);
    this.figures.mTable.push(bar);
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
  protected drawCMid(): void {
    const u = this.struct;
    const bar = this.rebars.shell.lOuter;
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
      new PathPointNote(fig.textHeight, fig.drawRadius)
        .spec(bar, bar.count / 2, bar.space)
        .path(pLeft)
        .offset(2 * fig.textHeight, Side.Right)
        .onlineNote(vec(-u.r, -u.r / 4))
        .generate(),
      new PathPointNote(fig.textHeight, fig.drawRadius)
        .spec(bar, bar.count / 2, bar.space)
        .path(pRight)
        .offset(2 * fig.textHeight)
        .onlineNote(vec(u.r, -u.r / 4), true)
        .generate()
    );
  }
  protected drawLOuter(): void {
    const u = this.struct;
    const bar = this.rebars.shell.lOuter;
    const fig = this.figures.lOuter;
    const ys = Array.from(
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
    const start = -u.len / 2 + u.as;
    const end = u.len / 2 - u.as;

    fig.push(
      new ArrowNote(fig.textHeight)
        .spec(bar, 0, bar.space)
        .rebar(...ys.map((y) => new Line(vec(start, y), vec(end, y))))
        .leaderNote(
          vec((-0.9 * u.len) / 2, u.hd + 2 * fig.textHeight),
          vec(0, 1),
          vec(-1, 0)
        )
        .generate()
    );
  }
}
