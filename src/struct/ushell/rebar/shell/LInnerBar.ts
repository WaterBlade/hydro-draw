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

export class LInnerBar extends UShellRebarBuilder {
  buildRebar(): this {
    const u = this.struct;
    const bar = this.rebars.shell.lInner;
    const path = this.genPos()
      .offset(u.as + bar.diameter / 2, Side.Right)
      .removeStart()
      .removeEnd()
      .divide(bar.space);
    bar
      .setCount(path.points.length)
      .setForm(
        RebarPathForm.Line(bar.diameter, u.len - 2 * u.as - 2 * u.waterStop.w)
      )
      .setId(this.id())
      .setStructure(this.name);
    return this;
  }
  buildFigure(): this {
    this.drawCMid();
    this.drawLInner();
    this.drawSEndBeam();
    this.drawSEndWall();
    const bar = this.rebars.shell.lInner;
    this.figures.rTable.push(bar);
    this.figures.mTable.push(bar);
    return this;
  }
  protected genPos(): Polyline {
    const u = this.struct;
    const path = new Polyline(-u.r - u.t, u.hd).lineBy(u.t + u.iBeam.w, 0);
    if (u.iBeam.w !== 0) {
      path
        .lineBy(0, -u.iBeam.hd)
        .lineBy(-u.iBeam.w, -u.iBeam.hs)
        .lineBy(0, -u.hd + u.iBeam.hd + u.iBeam.hs);
    } else {
      path.lineBy(0, -u.hd);
    }
    path.arcBy(2 * u.r, 0, 180);
    if (u.iBeam.w !== 0) {
      path
        .lineBy(0, u.hd - u.iBeam.hd - u.iBeam.hs)
        .lineBy(-u.iBeam.w, u.iBeam.hs)
        .lineBy(0, u.iBeam.hd);
    } else {
      path.lineBy(0, -u.hd);
    }
    path.lineBy(u.iBeam.w + u.t, 0);
    return path;
  }
  protected drawCMid(): void {
    const u = this.struct;
    const bar = this.rebars.shell.lInner;
    const fig = this.figures.cMid;
    const p = this.genPos()
      .offset(u.as + fig.drawRadius, Side.Right)
      .removeStart()
      .removeEnd()
      .divide(bar.space);
    fig.push(
      new PathPointNote(fig.textHeight, fig.drawRadius)
        .spec(bar, bar.count, bar.space)
        .path(p)
        .offset(2 * fig.textHeight)
        .onlineNote(vec(0, -u.r / 2))
        .generate()
    );
  }
  protected drawLInner(): void {
    const u = this.struct;
    const bar = this.rebars.shell.lInner;
    const fig = this.figures.lInner;
    const y = -u.r - u.as - fig.drawRadius;
    fig.push(
      new ArrowNote(fig.textHeight)
        .rebar(
          new Line(
            vec(-u.len / 2 + u.waterStop.w + u.as, y),
            vec(u.len / 2 - u.waterStop.w - u.as, y)
          )
        )
        .spec(bar)
        .leaderNote(
          vec(-u.len / 2 + u.cantLeft + u.denseL + 75, y + 4 * fig.textHeight),
          vec(0, -1),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawSEndBeam(): void{
    const u = this.struct;
    const bar = this.rebars.shell.lInner;
    const fig = this.figures.sEndBeam;
    const y = -u.as - fig.drawRadius;
    const right = u.endSect.b + u.trans + 1.25 * (u.t + u.butt.h);
    fig.push(
      new ArrowNote(fig.textHeight)
        .rebar(new Line(vec(u.waterStop.w + u.as, y), vec(right, y)))
        .spec(bar, 0, bar.space)
        .leaderNote(vec(u.endSect.b + 25, 4*fig.textHeight), vec(0, 1), vec(-1, 0))
        .generate()
    );
  }
  protected drawSEndWall(): void{
    const u = this.struct;
    const bar = this.rebars.shell.lInner;
    const fig = this.figures.sEndWall;
    const y = -u.as - fig.drawRadius;
    const right = u.endSect.b + u.trans + 1.25 * u.t;
    fig.push(
      new ArrowNote(fig.textHeight)
        .rebar(new Line(vec(u.waterStop.w + u.as, y), vec(right, y)))
        .spec(bar, 0, bar.space)
        .leaderNote(vec(u.endSect.b + 25, 4*fig.textHeight), vec(0, 1), vec(-1, 0))
        .generate()
    );
  }
}
