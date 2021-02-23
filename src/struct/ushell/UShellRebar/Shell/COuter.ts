import { Line, Polyline, RebarPathForm, RebarSpec, Side, vec } from "@/draw";
import { SpaceRebar } from "@/struct/utils";
import { UShellStruct } from "../../UShellStruct";
import { UShellRebarInfo } from "../Info";

export class ShellCOuter extends SpaceRebar<UShellRebarInfo> {
  spec = new RebarSpec();
  build(u: UShellStruct, name: string): void {
    this.spec = this.genSpec();
    const angle = u.transAngle;
    const as = this.info.as;
    const path = this.shape(u).offset(as).removeStart().removeEnd();
    const lens = path.segments.map((s) => s.calcLength());
    if (lens.length < 7) throw Error("outer c bar length not init");
    const form = new RebarPathForm(this.diameter)
      .lineBy(0, -1.5)
      .dimLength(lens[0], Side.Right)
      .arcBy(0.612, -1.44, 46)
      .dimArc(u.shell.r + u.shell.t - as, angle)
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
    this.spec
      .setForm(form)
      .setCount(
        this.pos(u).reduce((pre: number, cur) => pre + cur.points.length, 0)
      )
      .setId(this.container.id)
      .setName(name);
    this.container.record(this.spec);
  }
  shape(u: UShellStruct): Polyline {
    const angle = u.transAngle;
    const [left, right] = u.transPt;
    const path = new Polyline(-u.shell.r - u.shell.t + 1, u.shell.hd)
      .lineBy(-1, 0)
      .lineBy(0, -u.shell.hd)
      .arcTo(left.x, left.y, angle)
      .lineTo(-u.shell.wb / 2, u.bottom)
      .lineBy(u.shell.wb, 0)
      .lineTo(right.x, right.y)
      .arcTo(u.shell.r + u.shell.t, 0, angle)
      .lineBy(0, u.shell.hd)
      .lineBy(-1, 0);
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
