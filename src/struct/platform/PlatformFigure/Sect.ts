import { Line, Polyline, Side, vec } from "@/draw";
import { FigureConfig, SectFigure } from "@/struct/utils";
import { PlatformFigure } from "./PlatformFigure";
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

export abstract class PlatformSect extends SectFigure {
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
  abstract dotMain: LMain | WMain;
  abstract lineTop: LTop | WTop;
  abstract lineBot: LBot | WBot;
  abstract dotTop: LTop | WTop;
  abstract dotBot: LBot | WBot;
  abstract bottomDivide: number[];
  abstract dotPosDir: 1 | -1;

  protected draw(): void {
    this.drawOutline();

    this.drawLineMain();
    this.drawDotMain();
    this.drawRound();
    this.drawLineTop();
    this.drawLineBot();
    this.drawDotTop();
    this.drawDotBot();

    this.dim();
  }
  protected drawOutline(): void {
    const t = this.struct;
    const fig = this.fig;
    fig.addOutline(
      new Polyline(-this.l / 2, -t.h / 2)
        .lineBy(0, t.h)
        .lineBy(this.l, 0)
        .lineBy(0, -t.h)
        .greyLine()
    );
    const xs = this.bottomDivide.slice(1, -1);
    fig.addOutline(
      new Line(vec(-this.l / 2, -t.h / 2), vec(xs[0], -t.h / 2)).greyLine(),
      new Line(
        vec(this.l / 2, -t.h / 2),
        vec(xs[xs.length - 1], -t.h / 2)
      ).greyLine()
    );
    for (let i = 1; i < xs.length - 1; i += 2) {
      fig.addOutline(
        new Line(vec(xs[i], -t.h / 2), vec(xs[i + 1], -t.h / 2)).greyLine()
      );
    }
    const hp = 1000;
    const y = -t.h / 2 - hp;
    let i = 0;
    while (i < xs.length) {
      const left = xs[i];
      i += 2;
      fig.addOutline(
        new Polyline(left, y)
          .lineBy(0, hp + t.hs)
          .lineBy(t.d, 0)
          .lineBy(0, -hp - t.hs)
          .greyLine(),
        new Polyline(left, y)
          .arcBy(t.d / 2, 0, 60)
          .arcBy(t.d / 2, 0, 60)
          .arcBy(-t.d / 2, 0, 60)
          .greyLine()
      );
    }
  }
  protected dim(): void {
    const t = this.struct;
    const fig = this.fig;
    const { bottom, right } = fig.getBoundingBox();
    const dim = fig.dimBuilder();

    dim
      .vRight(right + fig.h, t.h / 2)
      .dim(t.h - t.hs)
      .dim(t.hs)
      .next()
      .dim(t.h);

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
          vec(
            -this.l / 2 + 2 * fig.h,
            y + 5 * fig.h + bar.layerCount * bar.layerSpace
          ),
          vec(0, 1),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawDotMain(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const as = rebars.as;
    const y = -t.h / 2 + t.hs + as + fig.r * this.dotPosDir;
    const bar = this.dotMain;
    const x0 = -this.l / 2 + as + fig.r;
    const x1 = this.l / 2 - as - fig.r;
    if (bar.layerCount === 1) {
      fig.push(
        fig
          .linePointRebar()
          .line(new Line(vec(x0, y), vec(x1, y)).divide(bar.space))
          .offset(2 * fig.h)
          .spec(bar)
          .count(bar.count)
          .space(bar.space)
          .onlineNote()
          .generate()
      );
    } else {
      fig.push(
        fig
          .layerPointRebar()
          .layers(
            vec(x0, y),
            vec(x1, y),
            bar.pos().length,
            bar.layerSpace,
            bar.layerCount
          )
          .spec(bar)
          .count(bar.count)
          .space(bar.space)
          .onlineNote(vec(0, y + 2 * fig.h), vec(1, 0))
          .generate()
      );
    }
  }
  protected drawRound(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const as = rebars.as;
    const bar = rebars.round;

    const y0 = -t.h / 2 + t.hs + as;
    const y1 = t.h / 2 - as;
    const x = -this.l / 2 + as + fig.r;

    const left = fig
      .linePointRebar()
      .line(new Line(vec(x, y0), vec(x, y1)).divide(bar.space).removeBothPt())
      .offset(2 * fig.h)
      .spec(bar)
      .count(bar.count / 2)
      .space(bar.space)
      .onlineNote()
      .generate();
    const right = left.mirrorByVAxis();

    fig.push(left, right);
  }
  protected drawDotTop(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const as = rebars.as;
    const bar = this.dotTop;
    const y = t.h / 2 - as + fig.r * this.dotPosDir;

    fig.push(
      fig
        .linePointRebar()
        .line(
          new Line(
            vec(-this.l / 2 + as + fig.r, y),
            vec(this.l / 2 - as - fig.r, y)
          ).divide(bar.space)
        )
        .offset(2 * fig.h)
        .spec(bar)
        .count(bar.count)
        .space(bar.space)
        .onlineNote()
        .generate()
    );
  }
  protected drawDotBot(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const as = rebars.as;
    const bar = this.dotBot;
    const y = -t.h / 2 + as + fig.r * this.dotPosDir;

    const line = new Line(
      vec(-this.l / 2 + as + fig.r, y),
      vec(this.l / 2 - as - fig.r, y)
    ).divide(bar.space);
    const ptNotInside = [];
    const xs = this.bottomDivide;
    for (const pt of line.points) {
      let isInside = false;
      for (let i = 1; i < xs.length - 1; i += 2) {
        if (pt.x > xs[i] && pt.x < xs[i + 1]) {
          isInside = true;
          break;
        }
      }
      if (isInside) continue;
      ptNotInside.push(pt);
    }
    line.points = ptNotInside;

    fig.push(
      fig
        .linePointRebar()
        .line(line)
        .offset(2 * fig.h, Side.Right)
        .spec(bar)
        .count(bar.count)
        .space(bar.space)
        .onlineNote()
        .generate()
    );
  }
  protected drawLineBot(): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const as = rebars.as;
    const bar = this.lineBot;
    const xs = this.bottomDivide;
    const y = -t.h / 2 + as;
    fig.push(
      fig
        .planeRebar()
        .rebar(new Line(vec(xs[0] + as, y), vec(xs[1], y)))
        .spec(bar)
        .space(bar.space)
        .leaderNote(
          vec(-this.l / 2 + fig.h * 2, -t.h / 2 - 4 * fig.h),
          vec(0, 1),
          vec(-1, 0)
        )
        .generate()
    );
    for (let i = 2; i < xs.length - 2; i += 2) {
      fig.push(new Line(vec(xs[i], y), vec(xs[i + 1], y)).thickLine());
    }
    fig.push(
      new Line(
        vec(xs[xs.length - 2], y),
        vec(xs[xs.length - 1] - as, y)
      ).thickLine()
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
          new Polyline(-this.l / 2 + as, -t.h / 2 + as)
            .lineBy(0, t.h - 2 * as)
            .lineBy(this.l - 2 * as, 0)
            .lineBy(0, -t.h + 2 * as)
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

export class LSect extends PlatformSect {
  dotPosDir: 1 | -1 = 1;
  get l(): number {
    return this.struct.l;
  }
  get lineMain(): LMain | WMain {
    return this.rebars.lMain;
  }
  get dotMain(): LMain | WMain {
    return this.rebars.wMain;
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
  get dotBot(): LBot | WBot {
    return this.rebars.wBot;
  }
  get bottomDivide(): number[] {
    return this.struct.lBottomDivide();
  }
}

export class WSect extends PlatformSect {
  dotPosDir: 1 | -1 = -1;
  get l(): number {
    return this.struct.w;
  }
  get lineMain(): LMain | WMain {
    return this.rebars.wMain;
  }
  get dotMain(): LMain | WMain {
    return this.rebars.lMain;
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
  get dotBot(): LBot | WBot {
    return this.rebars.lBot;
  }
  get bottomDivide(): number[] {
    return this.struct.wBottomDivide();
  }
}
