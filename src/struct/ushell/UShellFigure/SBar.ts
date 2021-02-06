import { Polyline, vec } from "@/draw";
import { Figure, FigureContent } from "@/struct/utils";
import { UShellRebar } from "../UShellRebar";
import { UShellStruct } from "../UShellStruct";

export class SBar extends Figure{
  initFigure(): void {
    this.fig = new FigureContent();
    const { id, title } = this.container.specId;
    this.fig
      .resetScale(1, 10)
      .setTitle(title)
      .setId(id)
      .displayScale()
      .centerAligned()
      .keepTitlePos();
    this.container.record(this.fig);
  }
  build(u: UShellStruct, rebars: UShellRebar): void {
    this.buildOutline(u);
    this.buildRebar(u, rebars);
    this.buildDim(u);
  }
  protected buildOutline(u: UShellStruct): this {
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
  protected buildRebar(u: UShellStruct, rebars: UShellRebar): void {
    this.drawMain(u, rebars);
    this.drawStir(u, rebars);
  }
  protected buildDim(u: UShellStruct): this {
    const fig = this.fig;
    const box = fig.getBoundingBox();
    const dim = fig.dimBuilder();

    dim.hBottom(-u.bar.w / 2, box.bottom - 2 * fig.textHeight).dim(u.bar.w);
    dim.vRight(box.right + 2 * fig.textHeight, u.bar.h / 2).dim(u.bar.h);

    fig.push(dim.generate());
    return this;
  }
  protected drawMain(u: UShellStruct, rebars: UShellRebar): void {
    const bar = rebars.bar.main;
    const { w, h } = u.bar;
    const fig = this.fig;
    const as = rebars.info.asBar;
    const w0 = w / 2 - as - fig.r;
    const h0 = h / 2 - as - fig.r;
    fig.push(
      fig
        .sparsePointRebar()
        .points(vec(-w0, h0), vec(w0, h0), vec(-w0, -h0), vec(w0, -h0))
        .spec(bar.spec, 4)
        .jointLeader(vec(0, 0), vec(-w / 2 - 2 * fig.h, 0))
        .generate()
    );
  }
  protected drawStir(u: UShellStruct, rebars: UShellRebar): void {
    const bar = rebars.bar.stir;
    const { w, h } = u.bar;
    const fig = this.fig;
    const as = rebars.info.asBar;
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
        .spec(bar.spec, 0, bar.space)
        .leaderNote(vec(0, h / 2 + 2 * fig.textHeight), vec(0, 1), vec(-1, 0))
        .generate()
    );
  }
}