import { ArrowNote, Polyline, RebarPathForm, Side, vec } from "@/draw";
import { UShellRebarBuilder } from "../../UShellRebar";

export class CInnerBar extends UShellRebarBuilder {
  buildRebar(): this {
    const u = this.struct;
    const bar = this.rebars.end.cInner;
    const lens = this.genShape().lengths;
    bar
      .setForm(
        new RebarPathForm(bar.diameter)
          .lineBy(0, -1.6)
          .dimLength(lens[0])
          .arcBy(4, 0, 180)
          .dimArc(u.r + u.waterStop.h + u.as)
          .dimLength(lens[1])
          .lineBy(0, 1.6)
          .dimLength(lens[2])
      )
      .setId(this.id())
      .setStructure(this.name);
    return this;
  }
  buildFigure(): this {
    const bar = this.rebars.end.cInner;
    this.drawCEnd();
    this.figures.rTable.push(bar);
    this.figures.mTable.push(bar);
    return this;
  }
  protected genShape(offsetDist?: number): Polyline {
    const u = this.struct;
    const dist = offsetDist ? offsetDist : u.as;
    return new Polyline(-u.r - u.waterStop.h - 1, u.hd)
      .lineBy(1, 0)
      .lineBy(0, -u.hd)
      .arcBy(2 * u.r + 2 * u.waterStop.h, 0, 180)
      .lineBy(0, u.hd)
      .lineBy(1, 0)
      .offset(dist, Side.Right)
      .removeStart()
      .removeEnd();
  }
  protected drawCEnd(): void {
    const u = this.struct;
    const bar = this.rebars.end.cInner;
    const fig = this.figures.cEnd;
    fig.push(
      new ArrowNote(fig.textHeight)
        .rebar(this.genShape())
        .spec(bar)
        .leaderNote(vec(u.r - 2 * fig.textHeight, u.hd / 2), vec(1, 0))
        .generate()
    );
  }
}
