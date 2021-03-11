import { average, Line, Polyline, vec } from "@/draw";
import { Figure, FigureConfig, SectFigure } from "@/struct/utils";
import {
  LBot,
  LMain,
  LTop,
  PlatformRebar,
  WBot,
  WMain,
  WTop,
} from "../PlatformRebar";
import { PlatformStruct } from "../PlatformStruct";
import { PlatformFigure } from "./PlatformFigure";

export abstract class PlatformView extends Figure {
  constructor(
    protected struct: PlatformStruct,
    protected rebars: PlatformRebar,
    protected figures: PlatformFigure
  ) {
    super();
  }
  protected unitScale = 1;
  protected drawScale = 40;
  protected config = new FigureConfig(true, true);

  abstract l: number;
  abstract lineMain: LMain | WMain;
  abstract lineTop: LTop | WTop;
  abstract lineBot: LBot | WBot;
  abstract dotTop: LTop | WTop;
  abstract bottomDivide: number[];
  abstract sect: SectFigure;

  protected draw(): void {
    this.drawOutline();
    this.drawNote();

    this.drawLineMain();
    this.drawRound();
    this.drawDotTop();
    this.drawLineBot();
    this.drawLineTop();

    this.buildDim();
  }
  protected drawOutline(): void {
    const t = this.struct;
    const fig = this.fig;
    fig.addOutline(
      new Polyline(-this.l / 2, -t.h / 2)
        .lineBy(0, t.h)
        .lineBy(this.l, 0)
        .lineBy(0, -t.h)
        .lineBy(-this.l, 0)
        .greyLine()
    );
    const xs = this.bottomDivide.slice(1, -1);
    const y0 = -t.h / 2;
    const y1 = -t.h / 2 - 1000;
    let i = 0;
    while (i < xs.length) {
      const left = xs[i++];
      const right = xs[i++];
      fig.addOutline(
        new Line(vec(left, y0), vec(left, y1)).greyLine(),
        new Line(vec(right, y0), vec(right, y1)).greyLine(),
        new Polyline(left, y1)
          .arcBy(t.d / 2, 0, 60)
          .arcBy(t.d / 2, 0, 60)
          .arcBy(-t.d / 2, 0, 60)
          .greyLine()
      );
    }
  }
  protected drawNote(): void {
    const fig = this.fig;
    const { top, bottom } = fig.outline.getBoundingBox();
    const x = average(...this.bottomDivide.slice(1, 3));
    fig.push(
      fig.sectSymbol(this.sect.id, vec(x, bottom - fig.h), vec(x, top + fig.h))
    );
  }
  protected buildDim(): void {
    const t = this.struct;
    const fig = this.fig;
    const { bottom, right } = fig.getBoundingBox();
    const dim = fig.dimBuilder();

    dim.vRight(right + fig.h, t.h / 2).dim(t.h);

    const xs = this.bottomDivide;
    dim.hBottom(-this.l / 2, bottom - fig.h);
    for (let i = 1; i < xs.length; i++) {
      dim.dim(xs[i] - xs[i - 1]);
    }
    dim.next().dim(this.l);
    fig.push(dim.generate());
  }
  protected drawLineMain(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const as = rebars.as;
    let y = -t.h / 2 + t.hs + as;
    const x = this.bottomDivide[2];
    const bar = this.lineMain;
    const rebar = fig.planeRebar();
    for (let i = 0; i < bar.layerCount; i++) {
      rebar.rebar(new Line(vec(-this.l / 2 + as, y), vec(this.l / 2 - as, y)));
      y += bar.layerSpace;
    }
    fig.push(
      rebar
        .spec(bar)
        .space(bar.space)
        .leaderNote(
          vec(x + 2 * fig.h, -t.h / 2 - 3 * fig.h),
          vec(0, 1),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawRound(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const as = rebars.as;
    const bar = rebars.round;
    const x = this.bottomDivide[2];

    fig.push(
      fig
        .planeRebar()
        .rebar(
          ...bar
            .pos()
            .map(
              (y) => new Line(vec(-this.l / 2 + as, y), vec(this.l / 2 - as, y))
            )
        )
        .spec(bar)
        .space(bar.space)
        .count(bar.count / 2)
        .leaderNote(
          vec(x + 2 * fig.h, t.h / 2 + 3 * fig.h),
          vec(0, 1),
          vec(1, 0)
        )
        .generate()
    );
  }

  protected drawDotTop(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const as = rebars.as;
    const bar = this.dotTop;

    fig.push(
      fig
        .planeRebar()
        .rebar(
          ...bar
            .pos()
            .map((x) => new Line(vec(x, -t.h / 2 + as), vec(x, t.h / 2 - as)))
        )
        .spec(bar)
        .space(bar.space)
        .count(bar.count)
        .leaderNote(vec(-this.l / 2 - fig.h, 0), vec(1, 0))
        .generate()
    );
  }
  protected drawLineBot(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const as = rebars.as;
    const bar = this.lineBot;
    fig.push(
      fig
        .planeRebar()
        .rebar(
          new Line(
            vec(-this.l / 2 + as, -t.h / 2 + as),
            vec(this.l / 2 - as, -t.h / 2 + as)
          )
        )
        .spec(bar)
        .space(bar.space)
        .leaderNote(
          vec(-this.l / 2 + fig.h * 2, -t.h / 2 - 3 * fig.h),
          vec(0, 1),
          vec(-1, 0)
        )
        .generate()
    );
  }
  protected drawLineTop(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const as = rebars.as;
    const bar = this.lineTop;
    fig.push(
      fig
        .planeRebar()
        .rebar(
          new Line(
            vec(-this.l / 2 + as, t.h / 2 - as),
            vec(this.l / 2 - as, t.h / 2 - as)
          )
        )
        .spec(bar)
        .space(bar.space)
        .leaderNote(
          vec(-this.l / 2 + fig.h * 2, t.h / 2 + 3 * fig.h),
          vec(0, 1),
          vec(-1, 0)
        )
        .generate()
    );
  }
}

export class LView extends PlatformView {
  protected title = "垂直水流向承台立面钢筋图";
  get sect(): SectFigure {
    return this.figures.wSect;
  }
  get l(): number {
    return this.struct.l;
  }
  get lineMain(): LMain | WMain {
    return this.rebars.lMain;
  }
  get lineTop(): LTop | WTop {
    return this.rebars.lTop;
  }
  get lineBot(): LBot | WBot {
    return this.rebars.lBot;
  }
  get dotTop(): LTop | WTop {
    return this.rebars.wTop;
  }
  get bottomDivide(): number[] {
    return this.struct.lBottomDivide();
  }
}

export class WView extends PlatformView {
  protected title = "顺水流向承台立面钢筋图";
  get sect(): SectFigure {
    return this.figures.lSect;
  }
  get l(): number {
    return this.struct.w;
  }
  get lineMain(): LMain | WMain {
    return this.rebars.wMain;
  }
  get lineTop(): LTop | WTop {
    return this.rebars.wTop;
  }
  get lineBot(): LBot | WBot {
    return this.rebars.wBot;
  }
  get dotTop(): LTop | WTop {
    return this.rebars.lTop;
  }
  get bottomDivide(): number[] {
    return this.struct.wBottomDivide();
  }
}
