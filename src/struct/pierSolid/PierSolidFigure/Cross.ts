import { Line, Polyline, vec } from "@/draw";
import { Figure, FigureConfig } from "@/struct/utils";
import { PierSolidRebar } from "../PierSolidRebar";
import { PierSolidStruct } from "../PierSolidStruct";
import { PierSolidFigure } from "./PierSolidFigure";

export class PierSolidCross extends Figure{
  protected unitScale = 1;
  protected drawScale = 50;
  protected config = new FigureConfig(true, true, true);
  protected title = "实心墩垂直水流向立面钢筋图";
  constructor(protected struct: PierSolidStruct, protected rebars: PierSolidRebar, protected figures: PierSolidFigure){super();}
  draw(): void {
    this.buildOutline();
    this.buildRebar();
    this.buildDim();
  }
  protected buildOutline(): void {
    const t = this.struct;
    const fig = this.fig;
    fig.addOutline(
      new Polyline(-t.topBeam.l / 2, t.h)
        .lineBy(0, t.topBeam.h)
        .lineBy(t.topBeam.l, 0)
        .lineBy(0, -t.topBeam.h)
        .lineBy(-t.topBeam.l, 0)
        .greyLine(),
      new Line(vec(-t.l / 2, t.h), vec(-t.l / 2, 0)).greyLine(),
      new Line(vec(t.l / 2, t.h), vec(t.l / 2, 0)).greyLine(),
      new Polyline(-t.found.l / 2, 0)
        .lineBy(0, -t.found.h)
        .lineBy(t.found.l, 0)
        .lineBy(0, t.found.h)
        .lineBy(-t.found.l, 0)
        .greyLine()
    );
  }
  protected buildDim(): void {
    const t = this.struct;
    const fig = this.fig;
    const dim = fig.dimBuilder();
    const { top, right } = fig.getBoundingBox();
    dim
      .vRight(right + fig.h, t.h + t.topBeam.h)
      .dim(t.topBeam.h)
      .dim(t.h)
      .dim(t.found.h);

    dim.hTop(-t.l / 2, top + fig.h).dim(t.l);

    fig.push(dim.generate());
  }
  protected buildRebar(): void {
    this.lMain();
    this.wMain();
    this.stir();
  }
  protected wMain(): void {
    const fig = this.fig;
    const t = this.struct;
    const rebars = this.rebars;
    const bar = rebars.wMain;
    const as = rebars.as;

    const pos = bar.pos();

    const plLeft = new Polyline(
      -t.l / 2 + as,
      t.h + t.topBeam.h - as
    )
      .lineBy(0, -t.h - t.topBeam.h - t.found.h + 2 * as)
      .lineBy(-500, 0);

    const plRight = plLeft.mirrorByVAxis();

    fig.push(
      fig
        .planeRebar()
        .rebar(plLeft, plRight)
        .spec(bar).count(pos.length).space(bar.space)
        .leaderNote(
          vec(-t.l / 2 - 2 * fig.h, t.h - 3 * fig.h),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected lMain(): void {
    const fig = this.fig;
    const t = this.struct;
    const rebars = this.rebars;
    const bar = rebars.lMain;
    const as = rebars.as;

    const pos = bar.pos();

    fig.push(
      fig
        .planeRebar()
        .rebar(
          ...pos.map(
            (x) =>
              new Line(
                vec(x, -t.found.h + as),
                vec(x, t.h + t.topBeam.h - as)
              )
          )
        )
        .spec(bar).count(pos.length).space(bar.space)
        .leaderNote(
          vec(-t.l / 2 - 2 * fig.h, t.h - 6 * fig.h),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected stir(): void{
    const fig = this.fig;
    const t = this.struct;
    const rebars= this.rebars;
    const as = rebars.as;
    const bar = rebars.stir;
    const pos = bar.pos();
    fig.push(
      fig.planeRebar()
        .rebar(
          ...pos.map(
            y => new Line(vec(-t.l/2+as, y), vec(t.l/2-as, y))
          )
        )
        .spec(bar).count(pos.length).space(bar.space)
        .leaderNote(
          vec(0, t.h+ t.topBeam.h+2*fig.h),
          vec(0, 1),
          vec(-1, 0)
        )
        .generate()
    )
  }
}
