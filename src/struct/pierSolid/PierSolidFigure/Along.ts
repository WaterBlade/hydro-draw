import { Line, Polyline, vec } from "@/draw";
import { FigureOld, FigureContent } from "@/struct/utils";
import { PierSolidRebar } from "../PierSolidRebar";
import { PierSolidStruct } from "../PierSolidStruct";

export class PierSolidAlong extends FigureOld {
  initFigure(): void {
    this.fig = new FigureContent();
    const { id, title } = this.container.sectId;
    this.fig
      .resetScale(1, 100)
      .setTitle(title)
      .setId(id)
      .setDisplayScale()
      .setCenterAligned()
      .setBaseAligned()
      .setKeepTitlePos();
    this.container.record(this.fig);
  }
  build(t: PierSolidStruct, rebars: PierSolidRebar): void {
    this.buildOutline(t);
    this.buildRebar(t, rebars);
    this.buildDim(t);
  }
  protected buildOutline(t: PierSolidStruct): void {
    const fig = this.fig;
    fig.addOutline(
      new Polyline(-t.topBeam.w.val / 2, t.h.val)
        .lineBy(0, t.topBeam.h.val)
        .lineBy(t.topBeam.w.val, 0)
        .lineBy(0, -t.topBeam.h.val)
        .lineBy(-t.topBeam.w.val, 0)
        .greyLine(),
      new Line(vec(-t.w.val / 2, t.h.val), vec(-t.w.val / 2, 0)).greyLine(),
      new Line(vec(t.w.val / 2, t.h.val), vec(t.w.val / 2, 0)).greyLine(),
      new Polyline(-t.found.w.val / 2, 0)
        .lineBy(0, -t.found.h.val)
        .lineBy(t.found.w.val, 0)
        .lineBy(0, t.found.h.val)
        .lineBy(-t.found.w.val, 0)
        .greyLine()
    );
  }
  protected buildDim(t: PierSolidStruct): void {
    const fig = this.fig;
    const dim = fig.dimBuilder();
    const { top, right } = fig.getBoundingBox();
    dim
      .vRight(right + fig.h, t.h.val + t.topBeam.h.val)
      .dim(t.topBeam.h.val)
      .dim(t.h.val)
      .dim(t.found.h.val);

    dim.hTop(-t.w.val / 2, top + fig.h).dim(t.w.val);

    fig.push(dim.generate());
  }
  protected buildRebar(t: PierSolidStruct, rebars: PierSolidRebar): void {
    this.lMain(t, rebars);
    this.wMain(t, rebars);
  }
  protected lMain(t: PierSolidStruct, rebars: PierSolidRebar): void {
    const fig = this.fig;
    const bar = rebars.lMain;
    const as = rebars.info.as;

    const pos = bar.pos(t);

    const plLeft = new Polyline(
      -t.w.val / 2 + as,
      t.h.val + t.topBeam.h.val - as
    )
      .lineBy(0, -t.h.val - t.topBeam.h.val - t.found.h.val + 2 * as)
      .lineBy(-500, 0);

    const plRight = plLeft.mirrorByVAxis();

    fig.push(
      fig
        .planeRebar()
        .rebar(plLeft, plRight)
        .spec(bar.spec, pos.length, bar.space)
        .leaderNote(
          vec(-t.w.val / 2 - 2 * fig.h, t.h.val - 3 * fig.h),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected wMain(t: PierSolidStruct, rebars: PierSolidRebar): void {
    const fig = this.fig;
    const bar = rebars.wMain;
    const as = rebars.info.as;

    const pos = bar.pos(t);

    fig.push(
      fig
        .planeRebar()
        .rebar(
          ...pos.map(
            (x) =>
              new Line(
                vec(x, -t.found.h.val + as),
                vec(x, t.h.val + t.topBeam.h.val - as)
              )
          )
        )
        .spec(bar.spec, pos.length, bar.space)
        .leaderNote(
          vec(-t.w.val / 2 - 2 * fig.h, t.h.val - 6 * fig.h),
          vec(1, 0)
        )
        .generate()
    );
  }
}
