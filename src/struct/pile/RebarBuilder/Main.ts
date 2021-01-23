import { Circle, Line, Polyline, RebarPathForm, Side, toRadian, vec } from "@/draw";
import { RebarBase } from "../Base";

export class Main extends RebarBase{
  buildSpec(): this{
    const bar = this.specs.main;
    const as = this.specs.as;
    const t = this.struct;
    bar
      .setId(this.specs.id.gen())
      .setCount(bar.singleCount * t.count)
      .setForm(
        new RebarPathForm(bar.diameter)
          .lineBy(1.5, 0.8).dimLength(bar.diameter * this.specs.anchorFactor, Side.Right)
          .guideLineBy(-1, 0).dimAngle(t.topAngle)
          .lineBy(4, 0).dimLength(t.h - as + t.hs-1000)
          .guideLineBy(1, 0)
          .lineBy(1.5, 0.8).dimLength(1000).dimAngle(t.botAngle)
          .text('桩顶', Side.Left, true)
          .text('桩底', Side.Right, true)
      )
    this.specs.record(bar);
    return this;
  }
  buildPos(): this{
    this.specs.main.pos.ele.dot(...this.genEleMulPos());
    
    return this;
  }
  buildFigure(): this{
    this.drawEle();
    this.drawSect();
    return this;
  }
  protected genEleMulPos(): number[]{
    const t = this.struct;
    const bar = this.specs.main;
    const as = this.specs.as;
    const n = Math.ceil(bar.singleCount / 2)-1;
    return new Line(vec(-t.d/2+as, 0), vec(t.d/2-as, 0)).divideByCount(n).points.map(p => p.x);
  }
  protected drawEle(): void{
    const t = this.struct;
    const bar = this.specs.main;
    const fig = this.figures.ele;
    const xs = this.genEleMulPos();
    const n = xs.length;
    const da = 2*t.topAngle / (n-1);
    const h0 = bar.diameter *this.specs.anchorFactor * Math.cos(toRadian(t.topAngle));
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
    rebar.spec(bar).leaderNote(vec(-t.d/2 - 2*fig.h, -5.5*this.specs.stir.denseSpace), vec(1, 0));
    fig.push(rebar.generate());
  }
  protected drawSect(): void{
    const fig = this.figures.sect;
    const bar = this.specs.main;
    const as = this.specs.as;
    const t = this.struct;
    fig.push(
      fig.circlePointRebar()
        .circle( new Circle(vec(0, 0), t.d/2 - fig.r -  as).divideByCount(bar.singleCount))
        .spec(bar, bar.singleCount)
        .offset(as + fig.h, Side.Right)
        .onlineNote(90)
        .generate()
    );
  }
}