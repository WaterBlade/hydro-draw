import { Line, Polyline, Text, TextAlign, toRadian, vec } from "@/draw";
import { Pile, PileFigure, PileRebar, PileRebarPos, PileRebarShape } from "../Basic";

export class Ele {
  constructor(
    protected struct: Pile,
    protected rebars: PileRebar,
    protected figures: PileFigure
  ){}
  initFigure(): this{
    const fig = this.figures.ele;
    fig
      .resetScale(1, 50)
      .setTitle('桩身结构钢筋图')
      .displayScale()
      .keepTitlePos()
      .centerAligned();
    this.figures.record(fig);
    return this;
  }
  build(): void{
    this.buildOutline();
    this.buildRebar();
    this.buildNote();
    this.buildDim();
  }
  buildOutline(): this{
    const t = this.struct;
    const fig = this.figures.ele;
    const s = 500;
    fig.addOutline(
      new Polyline(-t.d/2, t.hs)
        .lineBy(0, -t.hs-t.h)
        .arcBy(t.d, 0, 60)
        .lineBy(0, t.hs+t.h).close().greyLine(),
      new Line(vec(-t.d/2, 0), vec(-t.d/2-s, 0)).greyLine(),
      new Line(vec(t.d/2, 0), vec(t.d/2+s, 0)).greyLine(),
      new Line(vec(-t.d/2-s, t.hp), vec(t.d/2+s, t.hp)).greyLine(),
    );
    return this;
  }
  buildNote(): this{
    const fig = this.figures.ele;
    const {left, right, top} = fig.outline.getBoundingBox();
    fig.breakline(vec(left, 0), vec(left, top));
    fig.breakline(vec(right, 0), vec(right, top));
    return this;
  }
  buildDim(): this{
    const fig = this.figures.ele;
    const t = this.struct;
    const dim = fig.dimBuilder();
    const bar = this.rebars.stir;
    const right = fig.getBoundingBox().right+fig.h;
    const bottom = fig.getBoundingBox().bottom;
    dim.vRight(right+0.5*fig.h, t.hs)
    if(t.hs > 0){
      dim.dim(t.hs)
    }
    const ln = this.rebars.denseFactor * t.d;
    dim.dim(ln).dim(t.h-ln, `H-${ln}`).next().skip(t.hs).dim(t.h, '桩长H');

    dim.hBottom(-t.d/2, bottom-fig.h).dim(t.d);
    fig.push(
      dim.generate(),
      new Text(`间距${bar.denseSpace}`, vec(right, -0.5*ln), fig.h, TextAlign.BottomCenter, 90),
      new Text(`间距${bar.space}`, vec(right, (-t.h-ln)/2), fig.h, TextAlign.BottomCenter, 90),
      )
    return this;
  }
  
  buildRebar(): this{
    this.drawMain();
    this.drawFix();
    this.drawStir();
    this.drawRib();
    return this;
  }

  protected drawMain(): void{
    const t = this.struct;
    const bar = this.rebars.main;
    const fig = this.figures.ele;
    const xs = PileRebarPos.main(this.struct, this.rebars);
    const n = xs.length;
    const da = 2*t.topAngle / (n-1);
    const h0 = bar.diameter *this.rebars.anchorFactor * Math.cos(toRadian(t.topAngle));
    let a = -t.topAngle;
    const rebar = fig.planeRebar();
    const y0 = h0 + t.hs;
    const h = t.hs + t.h;
    
    for(const x of xs){
      const l0 = h0 * Math.tan(toRadian(a));
      const x0 = x + l0;
      rebar.rebar(
        new Polyline(x0, y0).lineBy(-l0, -h0).lineBy(0, -h)
      );
      a += da;
    }
    rebar.spec(bar).leaderNote(vec(-t.d/2 - 2*fig.h, -5.5*this.rebars.stir.denseSpace), vec(1, 0));
    fig.push(rebar.generate());
  }
  protected drawFix(): void{
    const t = this.struct;
    const fig = this.figures.ele;
    const as = this.rebars.as;
    const spec = this.rebars.fix;
    const ys = PileRebarPos.fix(this.struct, this.rebars);
    for(const y of ys){
      const left = new Polyline(-t.d/2 + as, y+50+as).lineBy(-as, -as).lineBy(0, -100).lineBy(as, -as);
      const right = left.mirrorByVAxis();
      fig.push(
        fig.planeRebar()
          .rebar(left, right)
          .spec(spec, this.rebars.fixCount, spec.space)
          .leaderNote(vec(-t.d / 2 - fig.h, y), vec(1, 0)).generate()
      );
    }
  }
  protected drawRib(): void{
    const bar = this.rebars.rib;
    const t = this.struct;
    const fig = this.figures.ele;
    const as = this.rebars.as;
    const lines = PileRebarPos.rib(this.struct, this.rebars).map(y => new Line(vec(-t.d/2+as, y), vec(t.d/2-as, y)));
    fig.push(
      fig.planeRebar()
        .rebar(...lines)
        .spec(bar, lines.length, bar.space)
        .leaderNote(vec(t.d/3, t.hp + 2*fig.h), vec(0, 1), vec(1, 0))
        .generate()
    );
  }
  protected drawStir(): void{
    const t = this.struct;
    const fig = this.figures.ele;
    const as = this.rebars.as;
    const bar = this.rebars.stir;
    const left = -t.d/2+as;
    const right = t.d/2 - as;
    
    const ys = PileRebarPos.stir(this.struct, this.rebars);
    const rebar = fig.planeRebar();
    for(let i = 1; i < ys.length; i++){
      const mid = (ys[i-1]+ys[i])/2;
      rebar.rebar(
        new Polyline(left, ys[i-1]).lineTo(right, mid).lineTo(left, ys[i])
      );
    }
    fig.push(
      rebar
        .spec(bar, 0, bar.space, bar.denseSpace)
        .leaderNote(vec(-t.d/3, t.hp + 2*fig.h), vec(0, 1), vec(-1, 0))
        .generate()
    );
  }
  protected drawTopStir(): void{
    const t = this.struct;
    const bar = this.rebars.topStir;
    const fig = this.figures.ele;
    const lines = PileRebarShape.stirTop(this.struct, this.rebars);
    fig.push(
      fig.planeRebar()
        .rebar(...lines)
        .spec(bar, lines.length, bar.space)
        .leaderNote(vec(0, t.hp + 6*fig.h), vec(0, 1), vec(-1, 0))
        .generate()
    );
  }

}