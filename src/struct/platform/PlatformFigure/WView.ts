import { average, Line, Polyline, vec } from "@/draw";
import { Figure, FigureContent } from "@/struct/utils";
import { PlatformRebar } from "../PlatformRebar";
import { PlatformStruct } from "../PlatformStruct";

export class WView extends Figure{
  initFigure(): void{
    this.fig = new FigureContent();
    this.fig
      .resetScale(1, 40)
      .setTitle("承台顺水流向立面钢筋图")
      .displayScale()
      .keepTitlePos()
      .centerAligned();
    this.container.record(this.fig);
  }

  build(t: PlatformStruct, rebars: PlatformRebar, lSect: FigureContent): void{
    this.buildOutline(t);
    this.buildNote(t, lSect)
    this.buildRebar(t, rebars);
    this.buildDim(t);
  }
  protected buildOutline(t: PlatformStruct): void{
    const fig = this.fig;
    fig.addOutline(
      new Polyline(-t.w/2, -t.h/2).lineBy(0, t.h).lineBy(t.w, 0).lineBy(0, -t.h).lineBy(-t.w, 0).greyLine(),
    );
    const xs = t.wBottomDivide().slice(1, -1);
    const y0 = -t.h/2;
    const y1 = -t.h/2-1000;
    let i = 0;
    while(i < xs.length){
      const left = xs[i++];
      const right = xs[i++];
      fig.addOutline(
        new Line(vec(left, y0), vec(left, y1)).greyLine(),
        new Line(vec(right, y0), vec(right, y1)).greyLine(),
        new Polyline(left, y1).arcBy(t.d/2, 0, 60).arcBy(t.d/2, 0, 60).arcBy(-t.d/2, 0, 60).greyLine()
      );
    }
  }
  protected buildNote(t: PlatformStruct, sect: FigureContent): void{
    const fig = this.fig;
    const {top, bottom} = fig.outline.getBoundingBox();
    const x = average(...t.wBottomDivide().slice(1, 3));
    fig.sectSymbol(sect.id, vec(x, bottom-fig.h), vec(x, top+fig.h));
  }
  protected buildDim(t: PlatformStruct): void{
    const fig = this.fig;
    const {bottom, right} = fig.getBoundingBox();
    const dim = fig.dimBuilder();

    dim.vRight(right+fig.h, t.h/2).dim(t.h);

    const xs = t.wBottomDivide();
    dim.hBottom(-t.w/2, bottom-fig.h);
    for(let i = 1; i < xs.length; i++){
      dim.dim(xs[i] - xs[i-1]);
    }
    dim.next().dim(t.w);
    fig.push(dim.generate());
  }
  protected buildRebar(t: PlatformStruct, rebars: PlatformRebar): void{
    this.buildWMain(t, rebars);
    this.buildRound(t, rebars);
    this.buildLTop(t, rebars);
    this.buildWBot(t, rebars);
    this.buildWTop(t, rebars);
  }
  protected buildWMain(t: PlatformStruct, rebars: PlatformRebar): void{
    const fig = this.fig;
    const as = rebars.info.as;
    let y = -t.h/2 + t.hs + as;
    const x = t.wBottomDivide()[2];
    const bar = rebars.lMain;
    const rebar = fig.planeRebar();
    for(let i = 0; i < bar.layerCount; i++){
      rebar.rebar(
        new Line(vec(-t.w / 2 + as, y), vec(t.w / 2 - as, y))
      )
      y += bar.layerSpace;
    }
    fig.push(
      rebar
        .spec(bar.spec, 0, bar.space)
        .leaderNote(vec(x+2*fig.h, -t.h/2-3*fig.h), vec(0, 1), vec(1, 0))
        .generate()
    )
  }
  protected buildRound(t: PlatformStruct, rebars: PlatformRebar): void{
    const fig = this.fig;
    const as = rebars.info.as;
    const bar = rebars.dist;
    const x = t.wBottomDivide()[2];

    fig.push(
      fig.planeRebar()
        .rebar(
          ...rebars.dist.hPos(t).map(y => new Line(vec(-t.w/2+as, y), vec(t.w/2-as, y)))
        )
        .spec(bar.round, bar.round.count, bar.space)
        .leaderNote(vec(x+2*fig.h, t.h/2+3*fig.h), vec(0, 1), vec(1, 0))
        .generate()
    );
  }

  protected buildLTop(t: PlatformStruct, rebars: PlatformRebar): void{
    const fig = this.fig;
    const as = rebars.info.as;
    const bar = rebars.dist;

    fig.push(
      fig.planeRebar()
        .rebar(
          ...rebars.dist.wPos(t).map(x => new Line(vec(x, -t.h/2+as), vec(x, t.h/2-as)))
        )
        .spec(bar.lTop, bar.lTop.count, bar.space)
        .leaderNote(vec(-t.w/2-fig.h, 0), vec(1, 0))
        .generate()
    )
  }
  protected buildWBot(t: PlatformStruct, rebars: PlatformRebar): void{
    const fig = this.fig;
    const as = rebars.info.as;
    const bar = rebars.dist;
    fig.push(
      fig.planeRebar()
        .rebar(new Line(vec(-t.w/2+as, -t.h/2+as), vec(t.w/2-as, -t.h/2+as)))
        .spec(bar.wBot, 0, bar.space)
        .leaderNote(vec(-t.w/2+fig.h*2, -t.h/2-3*fig.h), vec(0, 1), vec(-1, 0))
        .generate()
    );
  }
  protected buildWTop(t: PlatformStruct, rebars: PlatformRebar): void{
    const fig = this.fig;
    const as = rebars.info.as;
    const bar = rebars.dist;
    fig.push(
      fig.planeRebar()
        .rebar(new Line(vec(-t.w/2+as, t.h/2-as), vec(t.w/2-as, t.h/2-as)))
        .spec(bar.wTop, 0, bar.space)
        .leaderNote(vec(-t.w/2+fig.h*2, t.h/2+3*fig.h), vec(0, 1), vec(-1, 0))
        .generate()
    );
  }
  

}