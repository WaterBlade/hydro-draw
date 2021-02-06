import { Line, Polyline, RebarPathForm, Side, toDegree, vec } from "@/draw";
import { SpaceRebar } from "@/struct/utils";
import { UShellStruct } from "../../UShellStruct";
import { UShellRebarInfo } from "../Info";

export class ShellTopBeam extends SpaceRebar<UShellRebarInfo>{
  build(u: UShellStruct, name: string): void {
    this.spec = this.genSpec();
    const as = this.info.as;
    if (u.oBeam.w + u.iBeam.w > 0) {
      const form = new RebarPathForm(this.diameter);
      const segs = this.shape(u)
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
      this.spec
        .setCount(
          this.pos(u)
            .reduce((pre: number, cur) => pre + cur.points.length, 0)
        )
        .setForm(form)
        .setId(this.container.id)
        .setName(name);
      this.container.record(this.spec);
    }
  }
  shape(u: UShellStruct): Polyline {
    const path = new Polyline();
    const as = this.info.as;
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
        .moveTo(-u.shell.r - u.shell.t, u.shell.hd - 40 * this.diameter - as)
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
      path.lineBy(0, -40 * this.diameter - as);
    }

    return path;
  }
  pos(u: UShellStruct, offsetDist?: number): Line[] {
    const res: Line[] = [];
    const as = this.info.as;
    const y = -u.shell.r - u.shell.t - u.shell.hb;
    const endLeft = -u.len / 2 + u.cantLeft + u.endSect.b;
    const endRight = u.len / 2 - u.cantRight - u.endSect.b;
    const left = -u.len / 2 + u.cantLeft + this.info.denseL;
    const right = u.len / 2 - u.cantRight - this.info.denseL;

    const dist = offsetDist ? offsetDist : as;

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
