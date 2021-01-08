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

export class LInnerBar extends RebarBase {
  buildSpec(): this {
    const u = this.struct;
    const bar = this.specs.shell.lInner;
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
    this.specs.record(bar);
    return this;
  }
  buildFigure(): this {
    this.drawCMid();
    this.drawLInner();
    this.drawSEndBeam();
    this.drawSEndWall();
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
    const bar = this.specs.shell.lInner;
    const fig = this.figures.cMid;
    const p = this.genPos()
      .offset(u.as + fig.drawRadius, Side.Right)
      .removeStart()
      .removeEnd()
      .divide(bar.space);
    fig.push(
      new PolylinePointRebar(fig.textHeight, fig.drawRadius)
        .spec(bar, bar.count, bar.space)
        .polyline(p)
        .offset(2 * fig.textHeight)
        .onlineNote(vec(0, -u.r / 2))
        .generate()
    );
  }
  protected drawLInner(): void {
    const u = this.struct;
    const bar = this.specs.shell.lInner;
    const fig = this.figures.lInner;
    const y = -u.r - u.as - fig.drawRadius;
    fig.push(
      new PlaneRebar(fig.textHeight)
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
    const bar = this.specs.shell.lInner;
    const fig = this.figures.sEndBeam;
    const y = -u.as - fig.drawRadius;
    const right = fig.outline.getBoundingBox().right;
    fig.push(
      new PlaneRebar(fig.textHeight)
        .rebar(new Line(vec(u.waterStop.w + u.as, y), vec(right, y)))
        .spec(bar, 0, bar.space)
        .leaderNote(vec(u.endSect.b + 25, 4*fig.textHeight), vec(0, 1), vec(-1, 0))
        .generate()
    );
  }
  protected drawSEndWall(): void{
    const u = this.struct;
    const bar = this.specs.shell.lInner;
    const fig = this.figures.sEndWall;
    const y = -u.as - fig.drawRadius;
    const right = fig.outline.getBoundingBox().right;
    fig.push(
      new PlaneRebar(fig.textHeight)
        .rebar(new Line(vec(u.waterStop.w + u.as, y), vec(right, y)))
        .spec(bar, 0, bar.space)
        .leaderNote(vec(u.endSect.b + 25, 4*fig.textHeight), vec(0, 1), vec(-1, 0))
        .generate()
    );
  }
}
