import {
  PlaneRebar,
  Line,
  PolylinePointRebar,
  Polyline,
  RebarFormPreset,
  Side,
  vec,
} from "@/draw";
import { Figure } from "@/struct/Figure";
import { RebarBase } from "../Base";

export class LInnerBar extends RebarBase {
  buildSpec(): this {
    const u = this.struct;
    const bar = this.specs.shell.lInner;
    const as = this.specs.as;
    const path = this.genPos()
      .offset(as + bar.diameter / 2, Side.Right)
      .removeStart()
      .removeEnd()
      .divide(bar.space);
    bar
      .setCount(path.points.length)
      .setForm(
        RebarFormPreset.Line(bar.diameter, u.len - 2 * as - 2 * u.waterStop.w)
      )
      .setId(this.specs.id.gen())
      .setStructure(this.name);
    this.specs.record(bar);
    return this;
  }
  buildFigure(): this {
    this.drawCMid();
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
      this.drawSEndBeam(this.figures.sEndCantBLeft);
      this.drawSEndWall(this.figures.sEndCantWLeft);
    }
    if (this.struct.isRightCantExist()) {
      this.drawSEndBeam(this.figures.sEndCantBRight);
      this.drawSEndWall(this.figures.sEndCantWRight);
    }
    return this;
  }
  protected genPos(): Polyline {
    const u = this.struct;
    const path = new Polyline(-u.shell.r - u.shell.t, u.shell.hd).lineBy(
      u.shell.t + u.iBeam.w,
      0
    );
    if (u.iBeam.w !== 0) {
      path
        .lineBy(0, -u.iBeam.hd)
        .lineBy(-u.iBeam.w, -u.iBeam.hs)
        .lineBy(0, -u.shell.hd + u.iBeam.hd + u.iBeam.hs);
    } else {
      path.lineBy(0, -u.shell.hd);
    }
    path.arcBy(2 * u.shell.r, 0, 180);
    if (u.iBeam.w !== 0) {
      path
        .lineBy(0, u.shell.hd - u.iBeam.hd - u.iBeam.hs)
        .lineBy(-u.iBeam.w, u.iBeam.hs)
        .lineBy(0, u.iBeam.hd);
    } else {
      path.lineBy(0, -u.shell.hd);
    }
    path.lineBy(u.iBeam.w + u.shell.t, 0);
    return path;
  }
  protected drawCMid(): void {
    const u = this.struct;
    const bar = this.specs.shell.lInner;
    const as = this.specs.as;
    const fig = this.figures.cMid;
    const p = this.genPos()
      .offset(as + fig.drawRadius, Side.Right)
      .removeStart()
      .removeEnd()
      .divide(bar.space);
    fig.push(
      new PolylinePointRebar(fig.textHeight, fig.drawRadius)
        .spec(bar, bar.count, bar.space)
        .polyline(p)
        .offset(2 * fig.textHeight)
        .onlineNote(vec(0, -u.shell.r / 2))
        .generate()
    );
  }
  protected drawLInner(): void {
    const u = this.struct;
    const bar = this.specs.shell.lInner;
    const fig = this.figures.lInner;
    const as = this.specs.as;
    const y = -u.shell.r - as - fig.drawRadius;
    fig.push(
      new PlaneRebar(fig.textHeight)
        .rebar(
          new Line(
            vec(-u.len / 2 + u.waterStop.w + as, y),
            vec(u.len / 2 - u.waterStop.w - as, y)
          )
        )
        .spec(bar)
        .leaderNote(
          vec(
            -u.len / 2 + u.cantLeft + this.specs.denseL + 75,
            y + 4 * fig.textHeight
          ),
          vec(0, -1),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawSEndBeam(fig: Figure): void {
    const u = this.struct;
    const bar = this.specs.shell.lInner;
    const as = this.specs.as;
    const y = -as;
    const left = fig.outline.getBoundingBox().left;
    const right = fig.outline.getBoundingBox().right;
    fig.push(
      new PlaneRebar(fig.textHeight)
        .rebar(new Line(vec(left + u.waterStop.w + as, y), vec(right, y)))
        .spec(bar, 0, bar.space)
        .leaderNote(
          vec(u.endSect.b + 25, 4 * fig.textHeight),
          vec(0, 1),
          vec(-1, 0)
        )
        .generate()
    );
  }
  protected drawSEndWall(fig: Figure): void {
    const u = this.struct;
    const bar = this.specs.shell.lInner;
    const as = this.specs.as;
    const y = -as;
    const left = fig.outline.getBoundingBox().left;
    const right = fig.outline.getBoundingBox().right;
    fig.push(
      new PlaneRebar(fig.textHeight)
        .rebar(new Line(vec(left + u.waterStop.w + as, y), vec(right, y)))
        .spec(bar, 0, bar.space)
        .leaderNote(
          vec(u.endSect.b + 25, 4 * fig.textHeight),
          vec(0, 1),
          vec(-1, 0)
        )
        .generate()
    );
  }
}
