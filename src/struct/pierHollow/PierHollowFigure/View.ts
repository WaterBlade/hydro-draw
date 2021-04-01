import { Line, Polyline, Side, vec } from "@/draw";
import {Figure, FigureConfig} from "@/struct/utils";
import { PierHollowRebar } from "../PierHollowRebar";
import { LMain, WMain } from "../PierHollowRebar/Main";
import { LStir, WStir } from "../PierHollowRebar/Stir";
import { PierHollowStruct } from "../PierHollowStruct";
import { PierHollowFigure } from "./PierHollowFigure";

export class LView extends Figure{
  constructor(protected struct: PierHollowStruct, protected rebars: PierHollowRebar, protected figures: PierHollowFigure){super();}
  protected unitScale = 1;
  protected drawScale = 80;
  protected config = new FigureConfig(true, true);
  protected title = "垂直水流向墩身钢筋图";
  protected draw(): void{
    this.draw_outline();
    this.draw_note();
    this.draw_rebar();
    this.draw_dim();
  }
  get l(): number{
    return this.struct.l;
  }
  protected draw_outline(): void{
    const t = this.struct;
    const fig = this.fig;
    fig.addOutline(
      new Line(vec(-this.l/2, 0), vec(-this.l/2, t.h)).greyLine(),
      new Line(vec(this.l/2, 0), vec(this.l/2, t.h)).greyLine(),
      new Line(vec(-this.l/2-500, t.h + t.topBeam.h), vec(this.l/2+500, t.h + t.topBeam.h)).greyLine(),
      new Line(vec(-this.l/2-500, t.h ), vec(this.l/2+500, t.h)).greyLine(),
      new Line(vec(-this.l/2-500, -t.found.h), vec(this.l/2+500, -t.found.h)).greyLine(),
      new Line(vec(-this.l/2-500, 0), vec(this.l/2+500, 0)).greyLine(),
      new Polyline(-this.l/2+t.t, t.h - t.hTopSolid - t.vHa)
        .lineBy(t.ha, t.vHa)
        .lineBy(this.l - 2*t.ha - 2*t.t, 0)
        .lineBy(t.ha, -t.vHa).dashedLine(),
      new Polyline(-this.l/2+t.t, t.hBotSolid + t.vHa)
        .lineBy(t.ha, -t.vHa)
        .lineBy(this.l - 2*t.ha - 2*t.t, 0)
        .lineBy(t.ha, t.vHa).dashedLine()
    );
    const n = t.plate_count();
    if (n > 0){
      let h = t.hBotSolid
      for (let i = 0; i < n; i++){
        h += t.vSpace;
        const botHa = i === 0 ? t.vHa : t.plate.vHa;
        fig.addOutline(
          new Line(vec(-this.l / 2 + t.t, h - t.vSpace + botHa), vec(-this.l / 2 + t.t, h - t.plate.vHa)).dashedLine(),
          new Line(vec(this.l / 2 - t.t, h - t.vSpace + botHa), vec(this.l / 2 - t.t, h - t.plate.vHa)).dashedLine(),
          new Polyline(-this.l/2 + t.t, h - t.plate.vHa)
            .lineBy(t.ha, t.plate.vHa)
            .lineBy(this.l - 2*t.t - 2*t.ha, 0)
            .lineBy(t.ha, -t.plate.vHa).dashedLine(),
          new Polyline(-this.l/2 + t.t, h + t.plate.vHa + t.plate.t)
            .lineBy(t.ha, -t.plate.vHa)
            .lineBy(this.l - 2*t.t - 2*t.ha, 0)
            .lineBy(t.ha, t.plate.vHa).dashedLine(),
        )
        h += t.plate.t;
      }
      fig.addOutline(
          new Line(vec(-this.l / 2 + t.t, t.h - t.hTopSolid - t.vHa), vec(-this.l / 2 + t.t, h + t.plate.vHa)).dashedLine(),
          new Line(vec(this.l / 2 - t.t,  t.h - t.hTopSolid - t.vHa), vec(this.l / 2 - t.t, h + t.plate.vHa)).dashedLine(),
      )
    }else{
      fig.addOutline(
        new Line(
          vec(-this.l/2 + t.t, t.h - t.hTopSolid - t.vHa),
          vec(-this.l/2 + t.t, t.hBotSolid + t.vHa)
        ),
        new Line(
          vec(-this.l/2 + t.t, t.h - t.hTopSolid - t.vHa),
          vec(-this.l/2 + t.t, t.hBotSolid + t.vHa)
        )
      )
    }
  }
  protected draw_note(): void{
    const fig = this.fig;
    const t = this.struct;
    fig.push(
      fig.breakline(vec(-this.l/2-500, 0), vec(-this.l/2-500, -t.found.h)),
      fig.breakline(vec(this.l/2+500, 0), vec(this.l/2+500, -t.found.h)),
      fig.breakline(vec(-this.l/2-500, t.h), vec(-this.l/2-500, t.h + t.topBeam.h)),
      fig.breakline(vec(this.l/2+500, t.h), vec(this.l/2+500, t.h+t.topBeam.h)),
    );
  }
  protected draw_dim(): void{
    const fig = this.fig;
    const t = this.struct;
    const {right, top} = fig.getBoundingBox();
    const dim = fig.dimBuilder();
    const n = t.plate_count();
    dim.hTop(-this.l/2, top+fig.h)
      .dim(t.t).dim(this.l - 2*t.t).dim(t.t)
      .next()
      .dim(this.l);

    dim.vRight(right+fig.h, t.h)
      .dim(t.hTopSolid)
      .dim(t.h - t.hTopSolid - t.hBotSolid - n*(t.vSpace+t.plate.t));
    for(let i = 0; i< n; i++){
      dim.dim(t.plate.t).dim(t.vSpace)
    }
    dim
      .dim(t.hBotSolid)
      .next().back(t.topBeam.h).dim(t.topBeam.h).dim(t.h).dim(t.found.h)
    fig.push(dim.generate());
  }
  get main_bar(): LMain | WMain{
    return this.rebars.lMain;
  }
  get main_bar_side(): LMain | WMain{
    return this.rebars.wMain;
  }
  get l_stir(): LStir | WStir{
    return this.rebars.lStir;
  }
  protected draw_rebar(): void{
    this.draw_main();
    this.draw_main_side();
    this.draw_stir();
    this.draw_lStir();
  }
  protected draw_main(): void{
    const fig = this.fig;
    const t = this.struct;
    const bar = this.main_bar;
    const as = this.rebars.as;
    const lines = bar.xs().map(x => new Line(vec(x, -t.found.h+as), vec(x, t.h+t.topBeam.h-as)));
    fig.push(
      fig.planeRebar()
        .rebar(...lines)
        .spec(bar).space(bar.space).count(bar.count/2)
        .leaderNote(vec(-this.l/2-500-fig.h*2, t.h+fig.h), vec(1, 0))
        .generate()
    );
  }
  protected draw_main_side(): void{
    const fig = this.fig;
    const t = this.struct;
    const bar = this.main_bar_side;
    const as = this.rebars.as;
    fig.push(
      fig.planeRebar()
        .rebar(
          new Polyline(-this.l/2+as, t.h+t.topBeam.h-as).lineBy(0, -(t.h + t.topBeam.h + t.found.h - 2*as)).lineBy(-500, 0),
          new Polyline(this.l/2-as, t.h+t.topBeam.h-as).lineBy(0, -(t.h + t.topBeam.h + t.found.h - 2*as)).lineBy(500, 0),
        ).spec(bar).space(bar.space)
        .leaderNote(vec(-this.l/2-500-fig.h*2, t.h+4*fig.h), vec(1, 0))
        .generate()
    );
  }
  protected draw_stir(): void{
    const fig = this.fig;
    const t = this.struct;
    const bar = this.rebars.stir;
    const as = this.rebars.as;
    const top_lines = bar.top_pos().points.map(pt => new Line(vec(-this.l/2+as, pt.y), vec(this.l/2-as, pt.y)));
    const bot_lines = bar.bot_pos().points.map(pt => new Line(vec(-this.l/2+as, pt.y), vec(this.l/2-as, pt.y)));

    fig.push(
      fig.planeRebar()
        .rebar(...top_lines)
        .spec(bar).space(bar.space).count(top_lines.length)
        .cross(new Polyline(0, t.h).lineBy(0, -t.hTopSolid))
        .leaderNote(vec(-this.l/2-fig.h, t.h - t.hTopSolid/2), vec(1, 0))
        .generate(),
      fig.planeRebar()
        .rebar(...bot_lines)
        .spec(bar).space(bar.space).count(bot_lines.length)
        .cross(new Polyline(0, 0).lineBy(0, t.hBotSolid))
        .leaderNote(vec(-this.l/2-fig.h, t.hBotSolid/2), vec(1, 0))
        .generate(),
    )
  }
  protected draw_lStir(): void{
    const fig = this.fig;
    const bar = this.l_stir;
    const as = this.rebars.as;
    const t = this.struct;
    const lines = bar.pos(-this.l/2-fig.r+as);
    fig.push(
      fig.planeRebar()
        .rebar(...lines.map(line => line.points.map(p => new Line(vec(-this.l/2+as, p.y), vec(this.l/2-as, p.y)))).reduce((pre, cur) => pre.concat(cur)))
        .cross(new Polyline(0, t.h).lineBy(0, -t.h))
        .spec(bar).space(bar.space, bar.denseSpace).count(bar.count/2)
        .leaderNote(vec(-this.l/2, t.h/2), vec(1, 0))
        .generate()
    );
  }
}

export class WView extends LView{
  protected title = "顺水流向墩身钢筋图";
  get l(): number{
    return this.struct.w;
  }
  get main_bar(): LMain | WMain{
    return this.rebars.wMain;
  }
  get main_bar_side(): LMain | WMain{
    return this.rebars.lMain;
  }
  get l_stir(): LStir | WStir{
    return this.rebars.wStir;
  }
}