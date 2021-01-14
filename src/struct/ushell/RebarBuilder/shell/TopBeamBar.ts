import {
  PlaneRebar,
  Polyline,
  RebarPathForm,
  Side,
  toDegree,
  vec,
} from "@/draw";
import { RebarBase } from "../Base";

export class TopBeamBar extends RebarBase {
  buildSpec(): this {
    const u = this.struct;
    const bar = this.specs.shell.topBeam;
    const as = this.specs.as;
    if (u.oBeam.w + u.iBeam.w > 0) {
      const form = new RebarPathForm(bar.diameter);
      const segs = this.genShape()
        .offset(as, Side.Right)
        .removeStart()
        .removeEnd().segments;
      let i = 0;
      if (u.oBeam.w > 0) {
        const angle = 90 + toDegree(Math.asin(u.oBeam.hs / u.oBeam.w));
        form
          .lineBy(-1.5, 1)
          .dimLength(segs[i++].calcLength())
          .lineBy(0, 1.2)
          .dimAngle(angle)
          .dimLength(segs[i++].calcLength())
          .lineBy(3.2, 0)
          .dimLength(segs[i++].calcLength());
      } else {
        form
          .lineBy(0, 1.5)
          .dimLength(segs[i++].calcLength())
          .lineBy(2.5, 0)
          .dimLength(segs[i++].calcLength());
      }
      if (u.iBeam.w > 0) {
        const angle = 90 + toDegree(Math.asin(u.iBeam.hs / u.iBeam.w));
        form
          .lineBy(0, -1.2)
          .dimLength(segs[i++].calcLength())
          .lineBy(-1.5, -1)
          .dimAngle(angle)
          .dimLength(segs[i++].calcLength());
      } else {
        form.lineBy(0, 1.5).dimLength(segs[i++].calcLength());
      }
      bar
        .setCount(100)
        .setForm(form)
        .setId(this.specs.id.gen())
        .setStructure(this.name);
      this.specs.record(bar);
    }
    return this;
  }
  buildFigure(): this {
    this.drawOnCMidFigure();
    return this;
  }
  genShape(): Polyline {
    const path = new Polyline();
    const u = this.struct;
    const as = this.specs.as;
    const bar = this.specs.shell.topBeam;
    if (u.oBeam.w > 0) {
      path
        .moveTo(
          -u.shell.r,
          u.shell.hd -
            u.oBeam.hd -
            u.oBeam.hs -
            u.shell.t * (u.oBeam.hs / u.oBeam.w) +
            1
        )
        .lineBy(0, -1)
        .lineTo(-u.shell.r - u.shell.t - u.oBeam.w, u.shell.hd - u.oBeam.hd)
        .lineBy(0, u.oBeam.hd);
    } else {
      path
        .moveTo(-u.shell.r - u.shell.t, u.shell.hd - 40 * bar.diameter - as)
        .lineTo(-u.shell.r - u.shell.t, u.shell.hd);
    }
    path.lineBy(u.beamWidth, 0);
    if (u.iBeam.w > 0) {
      path
        .lineBy(0, -u.iBeam.hd)
        .lineTo(
          -u.shell.r - u.shell.t,
          u.shell.hd -
            u.iBeam.hd -
            u.iBeam.hs -
            u.shell.t * (u.iBeam.hs / u.iBeam.w)
        )
        .lineBy(0, 1);
    } else {
      path.lineBy(0, -40 * bar.diameter - as);
    }

    return path;
  }
  drawOnCMidFigure(): void {
    const u = this.struct;
    const bar = this.specs.shell.topBeam;
    const fig = this.figures.cMid;
    const as = this.specs.as;
    const pLeft = this.genShape()
      .offset(as, Side.Right)
      .removeStart()
      .removeEnd();
    const pRight = pLeft.mirrorByVAxis();
    const ptLeft = vec(
      -u.shell.r + u.iBeam.w + 1.5 * fig.textHeight,
      u.shell.hd + 2 * fig.textHeight
    );
    const ptRight = ptLeft.mirrorByVAxis();
    fig.push(
      new PlaneRebar(fig.textHeight)
        .spec(bar, 0, bar.space)
        .rebar(pLeft)
        .leaderNote(ptLeft, vec(1, 1), vec(1, 0))
        .generate(),
      new PlaneRebar(fig.textHeight)
        .spec(bar, 0, bar.space)
        .rebar(pRight)
        .leaderNote(ptRight, vec(1, -1), vec(-1, 0))
        .generate()
    );
  }
}
