import { Line, Polyline, RebarForm, RebarPathForm, Side, vec } from "@/draw";
import { UShellSpaceRebar } from "../UShellRebar";

export class ShellCInnerSub extends UShellSpaceRebar {
  get gap(): number {
    return this.struct.waterStop.h;
  }
  shape(): Polyline {
    const u = this.struct;
    return new Polyline(-u.shell.r - 1, u.shell.hd)
      .lineBy(1, 0)
      .lineBy(0, -u.shell.hd)
      .arcBy(2 * u.shell.r, 0, 180)
      .lineBy(0, u.shell.hd)
      .lineBy(1, 0)
      .offset(this.gap + this.rebars.as, Side.Right)
      .removeStart()
      .removeEnd();
  }
  get count(): number {
    const u = this.struct;
    const endCOuter = this.rebars.end.cOuter;
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
    return count;
  }
  get form(): RebarForm {
    const u = this.struct;
    const lens = this.shape().lengths;
    const as = this.rebars.as;
    return new RebarPathForm(this.diameter)
      .lineBy(0, -1.6)
      .dimLength(lens[0])
      .arcBy(4, 0, 180)
      .dimArc(u.shell.r + as + this.gap)
      .dimLength(lens[1])
      .lineBy(0, 1.6)
      .dimLength(lens[2]);
  }
}

export class ShellCInner extends ShellCInnerSub {
  get gap(): number {
    return 0;
  }
  get count(): number {
    return this.pos().reduce((pre: number, cur) => pre + cur.points.length, 0);
  }
  pos(): Line[] {
    const u = this.struct;
    const as = this.rebars.as;
    const res: Line[] = [];
    const y = -u.shell.r;
    const midLeft = -u.len / 2 + u.cantLeft + this.rebars.denseL;
    const midRight = u.len / 2 - u.cantRight - this.rebars.denseL;

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

    res.push(
      new Line(vec(left, y), vec(midLeft, y))
        .offset(as, Side.Right)
        .divide(this.denseSpace),
      new Line(vec(midLeft, y), vec(midRight, y))
        .offset(as, Side.Right)
        .divide(this.space)
        .removeStartPt()
        .removeEndPt(),
      new Line(vec(midRight, y), vec(right, y))
        .offset(as, Side.Right)
        .divide(this.denseSpace)
    );
    if (u.cantLeft === 0) res[0].removeStartPt();
    if (u.cantRight === 0) res[2].removeEndPt();
    return res;
  }
}
