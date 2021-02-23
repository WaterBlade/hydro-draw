import { Line, Polyline, RebarPathForm, RebarSpec, Side, vec } from "@/draw";
import { CountRebar, SpaceRebar } from "@/struct/utils";
import { UShellStruct } from "../../UShellStruct";
import { UShellRebarInfo } from "../Info";

export class ShellCInner extends SpaceRebar<UShellRebarInfo> {
  spec = new RebarSpec();
  specSub = new RebarSpec();

  build(u: UShellStruct, name: string, endCOuter: CountRebar): void {
    this.buildCInner(u, name);
    this.buildCInnerSub(u, name, endCOuter);
  }
  protected buildCInner(u: UShellStruct, name: string): void {
    this.spec = this.genSpec();
    const as = this.info.as;
    const path = this.shape(u).offset(as, Side.Right).removeStart().removeEnd();
    const lens = path.segments.map((s) => s.calcLength());
    const form = new RebarPathForm(this.diameter)
      .lineBy(0, -1.6)
      .dimLength(lens[0])
      .arcBy(4, 0, 180)
      .dimArc(u.shell.r + as)
      .dimLength(lens[1])
      .lineBy(0, 1.6)
      .dimLength(lens[2]);

    this.spec
      .setForm(form)
      .setCount(
        this.pos(u).reduce((pre: number, cur) => pre + cur.points.length, 0)
      )
      .setId(this.container.id)
      .setName(name);
    this.container.record(this.spec);
  }
  protected buildCInnerSub(
    u: UShellStruct,
    name: string,
    endCOuter: CountRebar
  ): void {
    this.specSub = this.genSpec();
    const as = this.info.as;
    const lens = this.shape(u)
      .offset(u.waterStop.h + as, Side.Right)
      .removeStart()
      .removeEnd().lengths;

    let count = 0;
    if (u.cantLeft > 0) {
      count += 1;
    } else {
      count += endCOuter.singleCount;
    }
    if (u.cantRight > 0) {
      count += 1;
    } else {
      count += endCOuter.singleCount;
    }
    this.specSub
      .setForm(
        new RebarPathForm(this.diameter)
          .lineBy(0, -1.6)
          .dimLength(lens[0])
          .arcBy(4, 0, 180)
          .dimArc(u.shell.r + u.waterStop.h + as)
          .dimLength(lens[1])
          .lineBy(0, 1.6)
          .dimLength(lens[2])
      )
      .setCount(count)
      .setId(this.container.id)
      .setName(name);
    this.container.record(this.specSub);
  }
  shape(u: UShellStruct): Polyline {
    const path = new Polyline(-u.shell.r - 1, u.shell.hd)
      .lineBy(1, 0)
      .lineBy(0, -u.shell.hd)
      .arcBy(2 * u.shell.r, 0, 180)
      .lineBy(0, u.shell.hd)
      .lineBy(1, 0);
    return path;
  }
  pos(u: UShellStruct, offsetDist?: number): Line[] {
    const as = this.info.as;
    const res: Line[] = [];
    const y = -u.shell.r;
    const midLeft = -u.len / 2 + u.cantLeft + this.info.denseL;
    const midRight = u.len / 2 - u.cantRight - this.info.denseL;

    let left: number;
    if (u.cantLeft > 0) {
      left = -u.len / 2 + u.waterStop.w + as;
    } else {
      left = -u.len / 2 + u.endSect.b;
    }
    let right: number;
    if (u.cantRight > 0) {
      right = u.len / 2 - u.waterStop.w - as;
    } else {
      right = u.len / 2 - u.endSect.b;
    }

    const dist = offsetDist ? offsetDist : as;

    res.push(
      new Line(vec(left, y), vec(midLeft, y))
        .offset(dist, Side.Right)
        .divide(this.denseSpace),
      new Line(vec(midLeft, y), vec(midRight, y))
        .offset(dist, Side.Right)
        .divide(this.space)
        .removeStartPt()
        .removeEndPt(),
      new Line(vec(midRight, y), vec(right, y))
        .offset(dist, Side.Right)
        .divide(this.denseSpace)
    );
    if (u.cantLeft === 0) res[0].removeStartPt();
    if (u.cantRight === 0) res[2].removeEndPt();
    return res;
  }
}
