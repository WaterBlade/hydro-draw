import { Line, Polyline, Side, vec } from "@/draw";
import {SectFigure, FigureConfig} from "@/struct/utils";
import { PierHollowRebar } from "../PierHollowRebar";
import { PlateLHaunch, PlateWHaunch } from "../PierHollowRebar/Haunch";
import { LMain, WMain } from "../PierHollowRebar/Main";
import { LNetBar, WNetBar } from "../PierHollowRebar/Net";
import { PlateLDist, PlateLMain, PlateWDist, PlateWMain } from "../PierHollowRebar/Plate";
import { LStir, WStir } from "../PierHollowRebar/Stir";
import { PierHollowStruct } from "../PierHollowStruct";
import { PierHollowFigure } from "./PierHollowFigure";

export class LSect extends SectFigure{
  constructor(protected struct: PierHollowStruct, protected rebars: PierHollowRebar, protected figures: PierHollowFigure){super();}
  protected unitScale = 1;
  protected drawScale = 80;
  protected config = new FigureConfig(true, true);
  protected draw(): void{
    this.draw_outline();
    this.draw_note();
    this.draw_rebar();
    this.draw_dim();
  }
  get l(): number{
    return this.struct.l;
  }
  get w(): number{
    return this.struct.w;
  }
  get lHole(): number{
    return this.struct.plate.lHole;
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
      new Polyline(-this.l/2+t.t, t.h - t.hTopSolid - t.topBotHa)
        .lineBy(t.sectHa, t.topBotHa)
        .lineBy(this.l - 2*t.sectHa - 2*t.t, 0)
        .lineBy(t.sectHa, -t.topBotHa).greyLine(),
      new Polyline(-this.l/2+t.t, t.hBotSolid + t.topBotHa)
        .lineBy(t.sectHa, -t.topBotHa)
        .lineBy(this.l - 2*t.sectHa - 2*t.t, 0)
        .lineBy(t.sectHa, t.topBotHa).greyLine()
    );
    const n = t.plate_count();
    if (n > 0){
      let h = t.hBotSolid
      for (let i = 0; i < n; i++){
        h += t.vSpace;
        const botHa = i === 0 ? t.topBotHa : t.plate.vHa;
        fig.addOutline(
          new Line(vec(-this.l / 2 + t.t, h - t.vSpace + botHa), vec(-this.l / 2 + t.t, h - t.plate.vHa)).greyLine(),
          new Line(vec(this.l / 2 - t.t, h - t.vSpace + botHa), vec(this.l / 2 - t.t, h - t.plate.vHa)).greyLine(),
          new Polyline(-this.l/2 + t.t, h - t.plate.vHa)
            .lineBy(t.sectHa, t.plate.vHa)
            .lineBy(this.l - 2*t.t - 2*t.sectHa, 0)
            .lineBy(t.sectHa, -t.plate.vHa).greyLine(),
          new Polyline(-this.l/2 + t.t, h + t.plate.vHa + t.plate.t)
            .lineBy(t.sectHa, -t.plate.vHa)
            .lineBy(this.l - 2*t.t - 2*t.sectHa, 0)
            .lineBy(t.sectHa, t.plate.vHa).greyLine(),
          new Line(vec(-this.lHole/2, h), vec(-this.lHole/2, h+t.plate.t)).greyLine(),
          new Line(vec(this.lHole/2, h), vec(this.lHole/2, h+t.plate.t)).greyLine(),
        )
        h += t.plate.t;
      }
      fig.addOutline(
          new Line(vec(-this.l / 2 + t.t, t.h - t.hTopSolid - t.topBotHa), vec(-this.l / 2 + t.t, h + t.plate.vHa)).greyLine(),
          new Line(vec(this.l / 2 - t.t,  t.h - t.hTopSolid - t.topBotHa), vec(this.l / 2 - t.t, h + t.plate.vHa)).greyLine(),
      )
    }else{
      fig.addOutline(
        new Line(
          vec(-this.l/2 + t.t, t.h - t.hTopSolid - t.topBotHa),
          vec(-this.l/2 + t.t, t.hBotSolid + t.topBotHa)
        ),
        new Line(
          vec(-this.l/2 + t.t, t.h - t.hTopSolid - t.topBotHa),
          vec(-this.l/2 + t.t, t.hBotSolid + t.topBotHa)
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
    return this.rebars.wMain;
  }
  get l_stir(): LStir | WStir{
    return this.rebars.wStir;
  }
  get plate_ha(): PlateLHaunch | PlateWHaunch{
    return this.rebars.plateLHa;
  }
  get plate_main(): PlateLMain | PlateWMain{
    return this.rebars.plateLMain;
  }
  get plate_dist(): PlateLDist | PlateWDist{
    return this.rebars.plateLDist;
  }
  get l_net(): LNetBar | WNetBar{
    return this.rebars.lNet;
  }
  get w_net(): LNetBar | WNetBar{
    return this.rebars.wNet;
  }
  protected draw_rebar(): void{
    this.draw_main();
    this.draw_inner();
    this.draw_stir();
    this.draw_lStir();
    this.draw_plate_ha();
    this.draw_plate_main();
    this.draw_plate_dist();
    this.draw_top_bot_dist();
    this.draw_top_bot_ha();
    this.draw_net();
  }
  protected draw_main(): void{
    const fig = this.fig;
    const t = this.struct;
    const bar = this.main_bar;
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
  protected draw_inner(): void{
    const fig = this.fig;
    const t = this.struct;
    const bar = this.rebars.inner;
    const as = this.rebars.as;
    fig.push(
      fig.planeRebar()
        .rebar(
          new Polyline(-this.l/2+t.t-as, t.h+t.topBeam.h-as).lineBy(0, -(t.h + t.topBeam.h + t.found.h - 2*as)).lineBy(500, 0),
          new Polyline(this.l/2-t.t+as, t.h+t.topBeam.h-as).lineBy(0, -(t.h + t.topBeam.h + t.found.h - 2*as)).lineBy(-500, 0),
        ).spec(bar).space(bar.space)
        .leaderNote(vec(-this.l/2-500-fig.h*2, t.h+fig.h), vec(1, 0))
        .generate()
    );
  }
  protected draw_stir(): void{
    const fig = this.fig;
    const bar = this.rebars.stir;
    const as = this.rebars.as;
    const top_line = bar.top_pos(-this.l/2+as-fig.r);
    const bot_line = bar.bot_pos(-this.l/2+as-fig.r);

    const top_left = fig.linePointRebar()
        .line(top_line)
        .spec(bar).space(bar.space).count(top_line.points.length)
        .offset(2*fig.h)
        .onlineNote()
        .generate();
    const top_right = top_left.mirrorByVAxis();
    const bot_left = fig.linePointRebar()
        .line(bot_line)
        .spec(bar).space(bar.space).count(bot_line.points.length)
        .offset(2*fig.h)
        .onlineNote()
        .generate();
    const bot_right = bot_left.mirrorByVAxis();

    fig.push(top_left, top_right, bot_left, bot_right);
  }
  protected draw_lStir(): void{
    const fig = this.fig;
    const bar = this.l_stir;
    const as = this.rebars.as;
    const t = this.struct;
    const outer = bar.pos(-this.l/2-fig.r+as);
    const inner = bar.pos(-this.l/2+t.t+-as+fig.r);
    let i = 0;
    const left_res = [
      fig.linePointRebar()
        .line(outer[i])
        .spec(bar).space(bar.denseSpace).count(outer[i].points.length)
        .offset(2*fig.h, Side.Right)
        .onlineNote()
        .generate(),
      fig.linePointRebar()
        .line(inner[i++])
        .generate(),
      fig.linePointRebar()
        .line(outer[i])
        .spec(bar).space(bar.space).count(outer[i].points.length)
        .offset(2*fig.h, Side.Right)
        .onlineNote()
        .generate(),
      fig.linePointRebar()
        .line(inner[i++])
        .generate(),
      fig.linePointRebar()
        .line(outer[i])
        .spec(bar).space(bar.denseSpace).count(outer[i].points.length)
        .offset(2*fig.h, Side.Right)
        .onlineNote()
        .generate(),
      fig.linePointRebar()
        .line(inner[i++])
        .generate(),
    ];
    const right_res = left_res.map(line => line.mirrorByVAxis());
    fig.push(...left_res, ...right_res);
  }
  protected draw_plate_ha(): void{
    const t = this.struct;
    const fig = this.fig;
    const bar = this.plate_ha;
    for(let i = 1; i < t.plate_count()+1; i++){
      const y0 = t.hBotSolid + i*(t.vSpace + t.plate.t) - t.plate.t/2;
      fig.push(
        fig.planeRebar()
          .rebar(bar.shape(y0))
          .spec(bar).space(bar.space)
          .leaderNote(vec(-this.l/2+t.t+fig.h, y0+t.plate.t/2+t.plate.vHa), vec(0, 1))
          .generate(),
        fig.planeRebar()
          .rebar(bar.shape(y0).mirrorByHAxis(y0))
          .generate(),
        fig.planeRebar()
          .rebar(bar.shape(y0).mirrorByVAxis())
          .generate(),
        fig.planeRebar()
          .rebar(bar.shape(y0).mirrorByHAxis(y0).mirrorByVAxis())
          .generate(),
      )
    }
  }
  protected draw_plate_main(): void{
    const t = this.struct;
    const fig = this.fig;
    const bar = this.plate_main;
    for(let i = 1; i < t.plate_count()+1; i++){
      const y0 = t.hBotSolid + i*(t.vSpace + t.plate.t) - t.plate.t/2;
      fig.push(
        fig.planeRebar()
          .rebar(bar.shape(y0))
          .generate(),
        fig.planeRebar()
          .rebar(bar.shape(y0).mirrorByVAxis())
          .generate(),
      )
    }
  }
  protected draw_plate_dist(): void{
    const t = this.struct;
    const fig = this.fig;
    const bar = this.plate_dist;
    for(let i = 1; i < t.plate_count()+1; i++){
      const y0 = t.hBotSolid + i*(t.vSpace + t.plate.t) - t.plate.t/2;
      fig.push(
        fig.polylinePointRebar()
          .polyline(bar.pos(y0, fig.r))
          .offset(fig.h)
          .spec(bar).space(bar.space)
          .onlineNote(vec(0, y0))
          .generate(),
        fig.polylinePointRebar()
          .polyline(bar.pos(y0, fig.r).mirrorByVAxis())
          .offset(fig.h, Side.Right)
          .spec(bar).space(bar.space)
          .onlineNote(vec(0, y0))
          .generate(),
      )
    }
  }
  protected draw_top_bot_dist(): void{
    const fig = this.fig;
    const bar = this.plate_dist;
    fig.push(
      fig.linePointRebar()
        .line(bar.top_pos(fig.r))
        .offset(fig.h, Side.Right)
        .spec(bar).space(bar.space)
        .onlineNote()
        .generate(),
      fig.linePointRebar()
        .line(bar.top_pos(fig.r).mirrorByVAxis())
        .offset(fig.h)
        .spec(bar).space(bar.space)
        .onlineNote()
        .generate(),
      fig.linePointRebar()
        .line(bar.bot_pos(fig.r))
        .offset(fig.h, Side.Right)
        .spec(bar).space(bar.space)
        .onlineNote()
        .generate(),
      fig.linePointRebar()
        .line(bar.bot_pos(fig.r).mirrorByVAxis())
        .offset(fig.h)
        .spec(bar).space(bar.space)
        .onlineNote()
        .generate()
    );
  }
  protected draw_top_bot_ha(): void{
    const fig = this.fig;
    const bar = this.rebars.vHa;
    const t = this.struct;
    const x0 = -this.l/2+t.t+2*fig.h;
    const y0 = t.h - t.hTopSolid - t.topBotHa- 3*fig.h;
    const y1 = t.hBotSolid + t.topBotHa + 3*fig.h;
    fig.push(
      fig.planeRebar()
        .rebar(bar.top_shape(this.l))
        .spec(bar)
        .leaderNote(vec(x0, y0), vec(1, 0), vec(0, -1))
        .generate(),
      fig.planeRebar()
        .rebar(bar.bot_shape(this.l))
        .spec(bar)
        .leaderNote(vec(x0, y1), vec(1, 0), vec(0, 1))
        .generate(),
      fig.planeRebar()
        .rebar(bar.top_shape(this.l).mirrorByVAxis())
        .generate(),
      fig.planeRebar()
        .rebar(bar.bot_shape(this.l).mirrorByVAxis())
        .generate(),
    )
  }
  protected draw_net(): void{
    const fig = this.fig;
    const lbar = this.l_net;
    const wbar = this.w_net;
    const t = this.struct;
    const as = this.rebars.as;
    fig.push(
      fig.planeRebar()
        .rebar(...lbar.v_top_pos().map(y => new Line(vec(-this.l/2+as, y), vec(this.l/2-as,y ))))
        .spec(lbar).space(lbar.space)
        .leaderNote(vec(0, t.h + t.topBeam.h+fig.h), vec(0, 1), vec(-1, 0))
        .generate(),
      fig.planeRebar()
        .rebar(...lbar.v_bot_pos().map(y => new Line(vec(-this.l/2+as, y), vec(this.l/2-as,y ))))
        .spec(lbar).space(lbar.space)
        .leaderNote(vec(0, -t.found.h-fig.h), vec(0, 1), vec(-1, 0))
        .generate(),
      fig.layerPointRebar()
        .layers(vec(-this.l/2+t.t, t.h - t.hTopSolid + as+fig.r), vec(this.l/2 - t.t, t.h - t.hTopSolid + as+fig.r), wbar.h_pos().points.length, wbar.space, lbar.v_top_pos().length)
        .spec(wbar).space(wbar.space)
        .onlineNote(vec(0, t.h + 2*fig.h), vec(1, 0))
        .generate(),
      fig.layerPointRebar()
        .layers(vec(-this.l/2+t.t, t.hBotSolid - as-fig.r), vec(this.l/2 - t.t, t.hBotSolid- as-fig.r), wbar.h_pos().points.length, wbar.space, lbar.v_top_pos().length, Side.Right)
        .spec(wbar).space(wbar.space)
        .onlineNote(vec(0, - 2*fig.h), vec(1, 0))
        .generate(),
    )
  }
}

export class WSect extends LSect{
  get l(): number{
    return this.struct.w;
  }
  get w(): number{
    return this.struct.l;
  }
  get lHole(): number{
    return this.struct.plate.wHole;
  }
  get main_bar(): LMain | WMain{
    return this.rebars.lMain;
  }
  get l_stir(): LStir | WStir{
    return this.rebars.lStir;
  }
  get plate_ha(): PlateLHaunch | PlateWHaunch{
    return this.rebars.plateWHa;
  }
  get plate_main(): PlateLMain | PlateWMain{
    return this.rebars.plateWMain;
  }
  get plate_dist(): PlateLDist | PlateWDist{
    return this.rebars.plateWDist;
  }
  get l_net(): LNetBar | WNetBar{
    return this.rebars.wNet;
  }
  get w_net(): LNetBar | WNetBar{
    return this.rebars.lNet;
  }
}