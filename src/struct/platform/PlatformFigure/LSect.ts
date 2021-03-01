import { Line, Polyline, Side, vec } from "@/draw";
import { Figure, FigureContent } from "@/struct/utils";
import { PlatformRebar } from "../PlatformRebar";
import { PlatformStruct } from "../PlatformStruct";

export class LSect extends Figure{
  initFigure(): void{
    this.fig = new FigureContent();
    const {id, title} = this.container.sectId;
    this.fig
      .resetScale(1, 40)
      .setId(id)
      .setTitle(title)
      .displayScale()
      .keepTitlePos()
      .centerAligned();
    this.container.record(this.fig);
  }

  build(t: PlatformStruct, rebars: PlatformRebar): void{
    this.buildOutline(t);
    this.buildRebar(t, rebars);
    this.buildDim(t);
  }
  protected buildOutline(t: PlatformStruct): void{
    const fig = this.fig;
    fig.addOutline(
      new Polyline(-t.l/2, -t.h/2).lineBy(0, t.h).lineBy(t.l, 0).lineBy(0, -t.h).greyLine(),
    );
    const xs = t.lBottomDivide().slice(1, -1);
    fig.addOutline(
      new Line(vec(-t.l/2, -t.h/2), vec(xs[0], -t.h/2)).greyLine(),
      new Line(vec(t.l/2, -t.h/2), vec(xs[xs.length-1], -t.h/2)).greyLine(),
    )
    for(let i = 1; i < xs.length-1; i+=2){
      fig.addOutline(
        new Line(vec(xs[i], -t.h/2), vec(xs[i+1], -t.h/2)).greyLine()
      );
    }
    const hp = 1000;
    const y = -t.h/2-hp;
    let i = 0;
    while(i < xs.length){
      const left = xs[i];
      i += 2;
      fig.addOutline(
        new Polyline(left, y).lineBy(0, hp+t.hs).lineBy(t.d, 0).lineBy(0, -hp-t.hs).greyLine(),
        new Polyline(left, y).arcBy(t.d/2, 0, 60).arcBy(t.d/2, 0, 60).arcBy(-t.d/2, 0, 60).greyLine()
      );
    }
  }
  protected buildDim(t: PlatformStruct): void{
    const fig = this.fig;
    const {bottom, right} = fig.getBoundingBox();
    const dim = fig.dimBuilder();

    dim.vRight(right+fig.h, t.h/2).dim(t.h-t.hs).dim(t.hs).next().dim(t.h);

    const xs = t.lBottomDivide();
    dim.hBottom(-t.l/2, bottom-fig.h);
    for(let i = 1; i < xs.length; i++){
      dim.dim(xs[i] - xs[i-1]);
    }
    dim.next().dim(t.l);
    fig.push(dim.generate());
  }
  protected buildRebar(t: PlatformStruct, rebars: PlatformRebar): void{
    this.buildWMain(t, rebars);
    this.buildLMain(t, rebars);

    this.buildRound(t, rebars);

    this.buildLTop(t, rebars);
    this.buildLBot(t, rebars);
    this.buildWBot(t, rebars);
    this.buildWTop(t, rebars);
  }
  protected buildLMain(t: PlatformStruct, rebars: PlatformRebar): void{
    const fig = this.fig;
    const as = rebars.info.as;
    let y = -t.h/2 + t.hs + as;
    const bar = rebars.lMain;
    const rebar = fig.planeRebar();
    for(let i = 0; i < bar.layerCount; i++){
      rebar.rebar(
        new Line(vec(-t.l / 2 + as, y), vec(t.l / 2 - as, y))
      )
      y += bar.layerSpace;
    }
    fig.push(
      rebar
        .spec(bar.spec, 0, bar.space)
        .leaderNote(vec(-t.l / 2 + 2 * fig.h, y + 5 * fig.h+bar.layerCount * bar.layerSpace), vec(0, 1), vec(1, 0))
        .generate()
    )
  }
  protected buildWMain(t: PlatformStruct, rebars: PlatformRebar): void{
    const fig = this.fig;
    const as = rebars.info.as;
    const y = -t.h/2 + t.hs + as-fig.r;
    const bar = rebars.wMain;
    const x0 = -t.l / 2 + as + fig.r;
    const x1 = t.l / 2 - as - fig.r;
    if(bar.layerCount === 1){
      fig.push(
        fig.linePointRebar()
          .line(new Line(vec(x0, y), vec(x1, y)).divide(bar.space))
          .offset(2 * fig.h)
          .spec(bar.spec, bar.spec.count, bar.space)
          .onlineNote()
          .generate()
      );
    }else{
      fig.push(
        fig.layerPointRebar()
          .layers(
            vec(x0, y), 
            vec(x1, y),
            bar.pos(t).length,
            bar.layerSpace,
            bar.layerCount
          )
          .spec(bar.spec, bar.spec.count, bar.space)
          .onlineNote(vec(0, y + 2*fig.h), vec(1, 0))
          .generate()
      );
    }
  }
  protected buildRound(t: PlatformStruct, rebars: PlatformRebar): void{
    const fig = this.fig;
    const as = rebars.info.as;
    const bar = rebars.dist;

    const y0 = -t.h/2 + t.hs +as;
    const y1 = t.h/2-as
    const x = -t.l/2 + as + fig.r;

    const left = fig.linePointRebar()
      .line(new Line(vec(x, y0), vec(x, y1)).divide(bar.space).removeBothPt())
      .offset(2*fig.h)
      .spec(bar.round, bar.round.count, bar.space)
      .onlineNote()
      .generate();
    const right = left.mirrorByVAxis();

    fig.push(left, right);
  }

  protected buildWTop(t: PlatformStruct, rebars: PlatformRebar): void{
    const fig = this.fig;
    const as = rebars.info.as;
    const bar = rebars.dist;
    const y = t.h/2 - as + fig.r;

    fig.push(
      fig.linePointRebar()
        .line(new Line(vec(-t.l/2+as+fig.r, y), vec(t.l/2-as-fig.r, y)).divide(bar.space))
        .offset(2*fig.h)
        .spec(bar.wTop, bar.wTop.count, bar.space)
        .onlineNote()
        .generate()
    );
  }
  protected buildWBot(t: PlatformStruct, rebars: PlatformRebar): void{
    const fig = this.fig;
    const as = rebars.info.as;
    const bar = rebars.dist;
    const y = -t.h/2 + as - fig.r;

    const line = new Line(vec(-t.l/2+as+fig.r, y), vec(t.l/2-as-fig.r, y)).divide(bar.space);
    const ptNotInside = [];
    const xs = t.lBottomDivide();
    for(const pt of line.points){
      let isInside = false;
      for(let i = 1; i < xs.length-1; i += 2){
        if(pt.x > xs[i] && pt.x < xs[i+1]) {
          isInside = true;
          break;
        }
      }
      if(isInside) continue;
      ptNotInside.push(pt);
    }
    line.points = ptNotInside;

    fig.push(
      fig.linePointRebar()
        .line(line)
        .offset(2*fig.h, Side.Right)
        .spec(bar.wBot, bar.wBot.count, bar.space)
        .onlineNote()
        .generate()
    );
  }
  protected buildLBot(t: PlatformStruct, rebars: PlatformRebar): void{
    const fig = this.fig;
    const as = rebars.info.as;
    const bar = rebars.dist;
    const xs = t.lBottomDivide();
    const y = -t.h/2+as;
    fig.push(
      fig.planeRebar()
        .rebar(new Line(vec(xs[0]+as, y), vec(xs[1], y)))
        .spec(bar.wBot, 0, bar.space)
        .leaderNote(vec(-t.l/2+fig.h*2, -t.h/2-4*fig.h), vec(0, 1), vec(-1, 0))
        .generate()
    );
    for(let i = 2; i < xs.length-2; i+=2){
      fig.push(
        new Line(vec(xs[i], y), vec(xs[i+1], y)).thickLine()
      );
    }
    fig.push(
      new Line(vec(xs[xs.length-2], y), vec(xs[xs.length-1]-as, y)).thickLine()
    );
  }
  protected buildLTop(t: PlatformStruct, rebars: PlatformRebar): void{
    const fig = this.fig;
    const as = rebars.info.as;
    const bar = rebars.dist;
    fig.push(
      fig.planeRebar()
        .rebar(new Polyline(-t.l/2+as, -t.h/2+as).lineBy(0, t.h-2*as).lineBy(t.l-2*as, 0).lineBy(0, -t.h+2*as))
        .spec(bar.lTop, 0, bar.space)
        .leaderNote(vec(-t.l/2+fig.h*2, t.h/2+3*fig.h), vec(0, 1), vec(-1, 0))
        .generate()
    );
  }
}