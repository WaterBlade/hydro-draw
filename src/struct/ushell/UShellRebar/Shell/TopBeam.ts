import {
  Line,
  Polyline,
  RebarForm,
  RebarPathForm,
  Side,
  toDegree,
  vec,
} from "@/draw";
import { UShellSpaceRebar } from "../UShellRebar";

export class ShellTopBeam extends UShellSpaceRebar {
  get count(): number {
    return this.pos().reduce((pre: number, cur) => pre + cur.points.length, 0);
  }
  get form(): RebarForm {
    const u = this.struct;
    if (u.oBeam.w === 0) throw Error("ushell obeam width is zero");
    const form = new RebarPathForm(this.diameter);
    if (u.oBeam.w + u.iBeam.w > 0) {
      const segs = this.shape().segments;
      let i = 0;
      const angle = 90 + toDegree(Math.asin(u.oBeam.hs / u.oBeam.w));
      form
        .lineBy(-1.5, 1)
        .dimLength(segs[i++].calcLength())
        .lineBy(0, 1.2)
        .dimAngle(angle)
        .dimLength(segs[i++].calcLength())
        .lineBy(3.2, 0)
        .dimLength(segs[i++].calcLength());
      if (u.iBeam.w > 0) {
        const angle = 90 + toDegree(Math.asin(u.iBeam.hs / u.iBeam.w));
        form
          .lineBy(0, -1.2)
          .dimLength(segs[i++].calcLength())
          .lineBy(-1.5, -1)
          .dimAngle(angle)
          .dimLength(segs[i++].calcLength());
      } else {
        form.lineBy(0, -1.5).dimLength(segs[i++].calcLength());
      }
    }
    return form;
  }
  shape(): Polyline {
    const u = this.struct;
    const path = new Polyline();
    const as = this.rebars.as;
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
      .lineBy(0, u.oBeam.hd)
      .lineBy(u.beamWidth, 0);
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

      return path.offset(as, Side.Right).removeStart().removeEnd();
    } else {
      path.lineBy(0, -40 * this.diameter - as);
      return path.offset(as, Side.Right).removeStart();
    }
  }
  pos(): Line[] {
    const u = this.struct;
    const res: Line[] = [];
    const as = this.rebars.as;
    const y = -u.shell.r - u.shell.t - u.shell.hb;
    const endLeft = -u.len / 2 + u.cantLeft + u.endSect.b;
    const endRight = u.len / 2 - u.cantRight - u.endSect.b;
    const left = -u.len / 2 + u.cantLeft + this.rebars.denseL;
    const right = u.len / 2 - u.cantRight - this.rebars.denseL;

    const dist = as;

    if (u.cantLeft > 0) {
      res.push(
        new Line(vec(-u.len / 2 + as, y), vec(-u.len / 2 + u.cantLeft, y))
          .offset(dist)
          .divide(this.denseSpace)
          .removeEndPt()
      );
    }
    res.push(
      new Line(vec(endLeft, y), vec(left, y))
        .offset(dist)
        .divide(this.denseSpace)
        .removeStartPt(),
      new Line(vec(left, y), vec(right, y))
        .offset(dist)
        .divide(this.space)
        .removeStartPt()
        .removeEndPt(),
      new Line(vec(right, y), vec(endRight, y))
        .offset(dist)
        .divide(this.denseSpace)
        .removeEndPt()
    );
    if (u.cantRight > 0) {
      res.push(
        new Line(vec(u.len / 2 - u.cantRight, y), vec(u.len / 2 - as, y))
          .offset(dist)
          .divide(this.denseSpace)
          .removeStartPt()
      );
    }
    return res;
  }
}
