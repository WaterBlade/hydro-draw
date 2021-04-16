import { Line, Polyline, vec, Side } from "@/draw";
import { Figure, FigureConfig, FigureRoot } from "@/struct/utils";
import { FoundRebar } from "./FoundRebar";
import { FoundStruct } from "./FoundStruct";
import {LTop, WTop, LBot, WBot} from "./FoundRebar";

export class FoundFigure extends FigureRoot{
  lSect = this.add(new LSect(this.struct, this.rebars));
  wSect = this.add(new WSect(this.struct, this.rebars));
  constructor(protected struct: FoundStruct, protected rebars: FoundRebar){super();}
}

class LSect extends Figure{
  protected unitScale = 1;
  protected drawScale = 40;
  protected config = new FigureConfig(true, true);
  protected title = "垂直水流向基础钢筋图";

  get topSize(): number{
    return this.struct.lTop;
  }
  get botSize(): number{
    return this.struct.lBot;
  }

  get topLineBar(): LTop | WTop{
    return this.rebars.lTop;
  }
  get topDotBar(): LTop | WTop{
    return this.rebars.wTop;
  }
  get botLineBar(): LBot | WBot{
    return this.rebars.lBot;
  }
  get botDotBar(): LBot | WBot{
    return this.rebars.wBot;
  }

  constructor(protected struct: FoundStruct, protected rebars: FoundRebar){super();}

  protected draw(): void{
    this.outline();
    this.drawBotLineBar();
    this.drawTopLineBar();
    this.drawBotDotBar();
    this.drawTopDotBar();
    this.dim();
  }
  protected outline(): void{
    const t = this.struct;
    const fig = this.fig;
    fig.addOutline(
      new Polyline(-this.botSize/2, 0)
        .lineBy(0, t.hBot)
        .lineBy((this.botSize - this.topSize)/2, 0)
        .lineBy(0, t.hTop)
        .lineBy(this.topSize, 0)
        .lineBy(0, -t.hTop)
        .lineBy((this.botSize - this.topSize)/2, 0)
        .lineBy(0, -t.hBot)
        .lineBy(-this.botSize, 0).greyLine()
    );
  }
  protected dim(): void{
    const fig= this.fig;
    const t = this.struct;
    const {bottom, right} = fig.getBoundingBox();
    const d = fig.dimBuilder();
    d.hBottom(-this.botSize/2, bottom-fig.h)
    .dim((this.botSize-this.topSize)/2)
    .dim(this.topSize)
    .dim((this.botSize-this.topSize)/2)
    .next()
    .dim(this.botSize);

    d.vRight(right+fig.h, t.hBot+t.hTop)
    .dim(t.hTop).dim(t.hBot).next().dim(t.hTop + t.hBot);

    fig.push(d.generate());
  }
  protected drawTopLineBar(): void{
    const fig = this.fig;
    const t = this.struct;
    const as = this.rebars.as;
    const bar = this.topLineBar;
    const w= this.topSize;
    const h = t.hBot + t.hTop;
    fig.push(
      fig.planeRebar()
        .rebar(new Line(vec(-w/2+as, h-as), vec(w/2-as, h-as)))
        .spec(bar).space(bar.space)
        .leaderNote(vec(-w/4, h+4*fig.h), vec(0, 1), vec(-1, 0))
        .generate()
    )
  }
  protected drawBotLineBar(): void{
    const fig = this.fig;
    const as = this.rebars.as;
    const bar = this.botLineBar;
    const w= this.botSize;
    fig.push(
      fig.planeRebar()
        .rebar(new Line(vec(-w/2+as, as), vec(w/2-as, as)))
        .spec(bar).space(bar.space)
        .leaderNote(vec(-w/4, -4*fig.h), vec(0, 1), vec(-1, 0))
        .generate()
    )
  }
  get dotOffset(): number{
    return -this.fig.r;
  }
  protected drawTopDotBar(): void{
    const fig = this.fig;
    const t = this.struct;
    const as = this.rebars.as;
    const bar = this.topDotBar;
    const w= this.topSize;
    const h = t.hBot + t.hTop;
    const r = this.dotOffset;
    fig.push(
      fig.linePointRebar()
        .line(new Line(vec(-w/2+as, h-as+r), vec(w/2-as, h-as+r)).divide(bar.space))
        .offset(2*fig.h)
        .spec(bar).space(bar.space).count(bar.count)
        .onlineNote()
        .generate()
    )
  }
  protected drawBotDotBar(): void{
    const fig = this.fig;
    const as = this.rebars.as;
    const bar = this.botDotBar;
    const w= this.botSize;
    const r = this.dotOffset;
    fig.push(
      fig.linePointRebar()
        .line(new Line(vec(-w/2+as, as+r), vec(w/2-as, as+r)).divide(bar.space))
        .offset(2*fig.h, Side.Right)
        .spec(bar).space(bar.space).count(bar.count)
        .onlineNote()
        .generate()
    )
  }
}

class WSect extends LSect{
  protected title = "顺水流向基础钢筋图";

  get topSize(): number{
    return this.struct.wTop;
  }
  get botSize(): number{
    return this.struct.wBot;
  }

  get topLineBar(): LTop | WTop{
    return this.rebars.wTop;
  }
  get topDotBar(): LTop | WTop{
    return this.rebars.lTop;
  }
  get botLineBar(): LBot | WBot{
    return this.rebars.wBot;
  }
  get botDotBar(): LBot | WBot{
    return this.rebars.lBot;
  }
  get dotOffset(): number{
    return this.fig.r;
  }
}