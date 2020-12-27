import { CompositeItem, DimensionBuilder, Line, Polyline, vec } from "@/draw";
import { RebarFigure } from "../Figure";
import { UShell } from "./UShell";
import { UShellRebar } from "./UShellRebar";

export class InnerFigure extends RebarFigure<UShell, UShellRebar> {
  generate(): CompositeItem {
    this.drawScale = 50;
    this.drawOutline();
    this.drawDim();
    this.setTitle("槽身纵剖钢筋图", true);
    return this.composite;
  }
  protected drawOutline(): void {
    const u = this.struct;
    this.composite.push(this.struct.genLOuterLine().greyLine());
    const left = new Polyline(-u.len / 2 + u.waterStop.w, u.hd)
      .lineBy(0, -u.hd - u.r - u.waterStop.h)
      .lineBy(-u.waterStop.w, 0);
    const right = left.mirrorByYAxis();
    this.composite.push(
      new Line(
        vec(-u.len / 2 + u.waterStop.w, -u.r),
        vec(u.len / 2 - u.waterStop.w, -u.r)
      ).greyLine(),
      left.greyLine(),
      right.greyLine()
    );
  }
  protected drawDim(): void {
    const u = this.struct;
    const box = this.composite.getBoundingBox();
    const dim = new DimensionBuilder(this.unitScale, this.drawScale);
    dim.hBottom(-u.len / 2, box.bottom - 2 * this.textHeight);
    if (u.cantLeft > 0) {
      dim.dim(u.cantLeft - u.trans).dim(u.trans);
    }
    dim
      .dim(u.endSect.w)
      .dim(u.trans)
      .dim(u.len - u.cantLeft - u.cantRight - 2 * u.trans - 2 * u.endSect.w)
      .dim(u.trans)
      .dim(u.endSect.w);
    if (u.cantRight > 0) {
      dim.dim(u.trans).dim(u.cantRight);
    }
    dim.next().dim(u.len);

    dim
      .vRight(box.right + 2 * this.textHeight, u.hd)
      .dim(u.hd + u.r)
      .dim(u.t + u.butt.h)
      .dim(u.oBeam.w);

    const d = u.endHeight - u.shellHeight - u.oBeam.w;
    if (d > 0) dim.dim(d);
    dim.next().dim(u.endHeight);

    this.composite.push(dim.generate());
  }
}
