import {
  ArrowNote,
  CompositeItem,
  DimensionBuilder,
  Line,
  Polyline,
  vec,
} from "@/draw";
import { RebarFigure } from "../Figure";
import { UShell } from "./UShell";
import { UShellRebar } from "./UShellRebar";

export class OuterFigure extends RebarFigure<UShell, UShellRebar> {
  generate(): CompositeItem {
    this.drawScale = 50;

    this.drawOutline();
    this.drawOuterLbar();
    this.drawDim();
    this.setTitle("槽身外侧钢筋图", true);
    return this.composite;
  }
  protected drawOutline(): void {
    this.composite.push(this.struct.genLOuterLine().greyLine());
  }
  protected drawOuterLbar(): void {
    const u = this.struct;
    const bar = this.rebar.outerL;
    const ys = Array.from(
      new Set(
        this.rebar
          .genOuterLBarGuide()
          .offset(u.as)
          .removeStart()
          .removeEnd()
          .divide(bar.space)
          .removeStartPt()
          .removeEndPt()
          .points.map((p) => p.y)
      ).values()
    );
    const start = -u.len / 2 + u.as;
    const end = u.len / 2 - u.as;

    this.composite.push(
      new ArrowNote(this.textHeight)
        .spec(bar, 0, bar.space)
        .rebar(...ys.map((y) => new Line(vec(start, y), vec(end, y))))
        .leaderNote(
          vec((-0.9 * u.len) / 2, u.hd + 2 * this.textHeight),
          vec(0, 1),
          vec(-1, 0)
        )
        .generate()
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
      .dim(u.shellHeight)
      .dim(u.oBeam.w);

    const d = u.endHeight - u.shellHeight - u.oBeam.w;
    if (d > 0) dim.dim(d);
    dim.next().dim(u.endHeight);

    this.composite.push(dim.generate());
  }
}
