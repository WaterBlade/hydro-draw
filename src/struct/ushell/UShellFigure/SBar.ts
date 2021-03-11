import { Polyline, vec } from "@/draw";
import { FigureConfig } from "@/struct/utils";
import { UShellSpecFigure } from "./UShellFigure";

export class SBar extends UShellSpecFigure {
  protected unitScale = 1;
  protected drawScale = 10;
  protected config = new FigureConfig(true, true);
  protected draw(): void {
    this.drawOuterline();

    this.drawMain();
    this.drawStir();

    this.drawDim();
  }
  protected drawOuterline(): this {
    const u = this.struct;
    const fig = this.fig;
    const { w, h } = u.bar;
    fig.addOutline(
      new Polyline(-w / 2, h / 2)
        .lineBy(w, 0)
        .lineBy(0, -h)
        .lineBy(-w, 0)
        .lineBy(0, h)
        .greyLine()
    );
    return this;
  }
  protected drawDim(): this {
    const u = this.struct;
    const fig = this.fig;
    const box = fig.getBoundingBox();
    const dim = fig.dimBuilder();

    dim.hBottom(-u.bar.w / 2, box.bottom - 2 * fig.h).dim(u.bar.w);
    dim.vRight(box.right + 2 * fig.h, u.bar.h / 2).dim(u.bar.h);

    fig.push(dim.generate());
    return this;
  }
  protected drawMain(): void {
    const u = this.struct;
    const bar = this.rebars.bar.main;
    const { w, h } = u.bar;
    const fig = this.fig;
    const as = this.rebars.asBar;
    const w0 = w / 2 - as - fig.r;
    const h0 = h / 2 - as - fig.r;
    fig.push(
      fig
        .sparsePointRebar()
        .points(vec(-w0, h0), vec(w0, h0), vec(-w0, -h0), vec(w0, -h0))
        .spec(bar)
        .count(4)
        .jointLeader(vec(0, 0), vec(-w / 2 - 2 * fig.h, 0))
        .generate()
    );
  }
  protected drawStir(): void {
    const u = this.struct;
    const bar = this.rebars.bar.stir;
    const { w, h } = u.bar;
    const fig = this.fig;
    const as = this.rebars.asBar;
    const w0 = w / 2 - as;
    const h0 = h / 2 - as;
    fig.push(
      fig
        .planeRebar()
        .rebar(
          new Polyline(-w0, h0)
            .lineBy(2 * w0, 0)
            .lineBy(0, -2 * h0)
            .lineBy(-2 * w0, 0)
            .lineBy(0, 2 * h0)
        )
        .spec(bar)
        .space(bar.space)
        .leaderNote(vec(0, h / 2 + 2 * fig.h), vec(0, 1), vec(-1, 0))
        .generate()
    );
  }
}
