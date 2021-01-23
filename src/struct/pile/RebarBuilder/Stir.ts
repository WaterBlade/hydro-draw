import { Circle, Line, Polyline, RebarPathForm, Side, StrecthSide, vec } from "@/draw";
import { RebarBase } from "../Base";

export class Stir extends RebarBase{
  buildSpec(): this{
    const bar = this.specs.stir;
    const t = this.struct;
    const as = this.specs.as;
    bar
      .setId(this.specs.id.gen())
      .setCount(t.count)
      .setForm(
        new RebarPathForm(bar.diameter)
          .lineBy(0.25, 1.6).lineBy(0.25, -1.6)
          .lineBy(0.25, 1.6).lineBy(0.25, -1.6)
          .lineBy(0.25, 1.6).lineBy(0.25, -1.6)
          .lineBy(0.25, 1.6).lineBy(0.25, -1.6)
          .lineBy(0.25, 1.6).lineBy(0.25, -1.6)
          .text(`D=${t.d - 2*as}`, Side.Right).setLength(this.calcLength())
      );
    this.specs.record(bar);
    return this;
  }
  protected calcLength(): number{
    const t = this.struct;
    const as = this.specs.as;
    const peri = Math.PI * (t.d - 2*as);
    const n = this.genMulPos().length;
    return Math.sqrt( (n*peri)**2 + (t.hs + t.h)**2);
  }
  buildFigure(): this{
    this.drawEle();
    this.drawSect();
    return this;
  }
  protected genMulPos(): number[]{
    const t = this.struct;
    const bar = this.specs.stir;
    const ln = t.d * this.specs.denseFactor;
    if(t.h < ln){
      return new Line(vec(0, t.hs), vec(0, -t.h)).divide(bar.denseSpace, StrecthSide.head).points.map(p => p.y);
    }else{
      const p1 = new Line(vec(0, t.hs), vec(0, -ln)).divide(bar.denseSpace, StrecthSide.head).points.map(p => p.y);
      const p2 = new Line(vec(0, -ln), vec(0, -t.h)).divide(bar.space, StrecthSide.tail).points.map(p => p.y);
      return [...p1.slice(0, -1), ...p2];
    }
  }
  protected drawEle(): void{
    const t = this.struct;
    const fig = this.figures.ele;
    const as = this.specs.as;
    const bar = this.specs.stir;
    const left = -t.d/2+as;
    const right = t.d/2 - as;
    
    const ys = this.genMulPos();
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
        .leaderNote(vec(this.specs.main.pos.ele.find(-t.d/3), t.hp + 2*fig.h), vec(0, 1), vec(-1, 0))
        .generate()
    );
  }
  protected drawSect(): void{
    const t = this.struct;
    const fig = this.figures.sect;
    const as = this.specs.as;
    const bar = this.specs.stir;
    fig.push(
      fig.planeRebar()
        .rebar(new Circle(vec(0, 0), t.d/2-as))
        .spec(bar, 0, bar.space, bar.denseSpace)
        .leaderNote(vec(-t.d/2-fig.h, 0),  vec(1, 0))
        .generate()
    );
  }
}
