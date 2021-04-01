import { Line, Polyline, RebarForm, RebarPathForm, Side, vec } from "@/draw";
import { PierHollowSpaceRebar } from "./PierHollowRebar";

export class Stir extends PierHollowSpaceRebar{
  shape(d = 0): Polyline{
    return this.struct.outline().offset(this.rebars.as+d);
  }
  top_pos(x=0): Line{
    const t = this.struct;
    return new Line(vec(x, t.h-t.hTopSolid+50),  vec(x, t.h-50)).divide(this.space)
  }
  bot_pos(x=0): Line{
    const t = this.struct;
    return new Line(vec(x, 50),  vec(x, t.hBotSolid-50)).divide(this.space)
  }
  get count(): number{
    return this.top_pos().points.length + this.bot_pos().points.length;
  }
  get form(): RebarForm{
    const lens = this.shape().segments.map((s) => s.calcLength());
    const r = this.struct.fr - this.rebars.as;
    let i = 0;

    return new RebarPathForm(this.diameter)
      .arcBy(0.8, -0.8, 90)
      .dimArc(r)
      .dimLength(lens[i++])
      .lineBy(4, 0)
      .dimLength(lens[i++])
      .arcBy(0.8, 0.8, 90)
      .dimLength(lens[i++])
      .lineBy(0, 1.6)
      .dimLength(lens[i++])
      .arcBy(-0.8, 0.8, 90)
      .dimLength(lens[i++])
      .lineBy(-4, 0)
      .dimLength(lens[i++])
      .arcBy(-0.8, -0.8, 90)
      .dimLength(lens[i++])
      .lineBy(0, -1.6)
      .dimLength(lens[i++])
  }
}

export class WStir extends PierHollowSpaceRebar{
  shape(d = 0): Polyline{
    const t = this.struct;
    return new Polyline(-t.l/2+t.t, t.w/2)
      .lineBy(-t.t+t.fr, 0)
      .arcBy(-t.fr, -t.fr, 90)
      .lineBy(0, -t.w+2*t.fr)
      .arcBy(t.fr, -t.fr, 90)
      .lineBy(t.t-t.fr, 0)
      .close()
      .offset(this.rebars.as+d);
  }
  pos(x=0): Line[]{
    const t = this.struct;
    return [
      new Line(vec(x, t.h - t.hTopSolid), vec(x, t.h - 4000)).divide(this.denseSpace).removeEndPt(),
      new Line(vec(x, t.h - 4000), vec(x, 4000)).divide(this.space),
      new Line(vec(x, 4000), vec(x, t.hBotSolid)).divide(this.denseSpace).removeStartPt(),
    ];
  }
  get count(): number{
    return this.pos().map(line => line.points.length).reduce((pre, cur) => pre + cur, 0)*2;
  }
  get form(): RebarForm{
    const lens = this.shape().segments.map((s) => s.calcLength());
    const r = this.struct.fr - this.rebars.as;
    let i = 0;

    return new RebarPathForm(this.diameter)
      .lineBy(0, -0.8)
      .dimLength(lens[i++], Side.Right)
      .arcBy(0.8, -0.8, 90)
      .dimArc(r)
      .dimLength(lens[i++])
      .lineBy(4, 0)
      .dimLength(lens[i++], Side.Right)
      .arcBy(0.8, 0.8, 90)
      .dimLength(lens[i++])
      .lineBy(0, 0.8)
      .dimLength(lens[i++], Side.Right)
      .lineBy(-5.6, 0)
      .dimLength(lens[i++])
  }
}

export class LStir extends WStir{
  shape(d = 0): Polyline{
    const t = this.struct;
    return new Polyline(t.l/2, t.w/2-t.t)
      .lineBy(0, t.t-t.fr)
      .arcBy(-t.fr, t.fr, 90)
      .lineBy(-t.l + 2*t.fr, 0)
      .arcBy(-t.fr, -t.fr, 90)
      .lineBy(0, -t.t+t.fr)
      .close()
      .offset(this.rebars.as+d);
  }
}