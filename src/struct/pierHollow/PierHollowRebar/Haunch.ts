import { Line, Polyline, RebarForm, RebarFormPreset, Side, vec} from "@/draw";
import { PierHollowSpaceRebar } from "./PierHollowRebar";

export class SectHaunch extends PierHollowSpaceRebar{
  get count(): number{
    const t = this.struct;
    return Math.floor((t.h - t.hTopSolid - t.hBotSolid) / this.space)*4;
  }
  get form(): RebarForm{
    const l = this.shape().lengths[0];
    return RebarFormPreset.Line(this.diameter, l);
  }
  shape(d = 0): Polyline{
    const t = this.struct;
    return new Polyline(-t.l/2, t.w/2)
      .lineBy(0, -2*t.t-t.sectHa)
      .lineBy(2*t.t+t.sectHa, 2*t.t+t.sectHa)
      .lineBy(-2*t.t-t.sectHa, 0)
      .offset(this.rebars.as + d)
      .removeStart()
      .removeEnd();
  }
}

export class VHaunch extends PierHollowSpaceRebar{
  get count(): number{
    const t = this.struct;
    return Math.floor(t.plate.wHole / this.space) * 4 + Math.floor(t.plate.lHole / this.space) * 4;
  }
  get form(): RebarForm{
    return RebarFormPreset.Line(this.diameter, this.top_shape(this.struct.l).calcLength());
  }
  top_shape(l: number, dist=0): Line{
    const t = this.struct;
    const as = this.rebars.as;
    const v = vec(t.sectHa, t.topBotHa);
    const pt = vec(-l/2+t.t, t.h-t.hTopSolid-t.topBotHa).add(v.norm().unit().mul(as+ dist));
    const h = 40 * this.diameter * v.y / v.length();
    const start = new Line(vec(-l/2+as, 0), vec(-l/2+as, t.h)).rayIntersect(pt, v)[0];
    const end = new Line(vec(-l/2, t.h - t.hTopSolid + h), vec(l/2, t.h - t.hTopSolid + h)).rayIntersect(pt, v)[0];
    return new Line(start, end);
  }
  bot_shape(l: number, dist=0): Line{
    const t = this.struct;
    const as = this.rebars.as;
    const v = vec(-t.sectHa, t.topBotHa);
    const pt = vec(-l/2+t.t, t.hBotSolid+t.topBotHa).add(v.norm().unit().mul(as+ dist));
    const h = 40 * this.diameter * v.y / v.length();
    const start = new Line(vec(-l/2+as, 0), vec(-l/2+as, t.h)).rayIntersect(pt, v)[0];
    const end = new Line(vec(-l/2, t.hBotSolid - h), vec(l/2, t.hBotSolid - h)).rayIntersect(pt, v)[0];
    return new Line(start, end);
  }
}

export class PlateLHaunch extends PierHollowSpaceRebar{
  get count(): number{
    return 4*this.struct.plate_count()*Math.floor(this.wHole / this.space);
  }
  get form(): RebarForm{
    return RebarFormPreset.Line(this.diameter, this.shape().calcLength());
  }
  get l(): number{
    return this.struct.l;
  }
  get lHole(): number{
    return this.struct.plate.lHole;
  }
  get wHole(): number{
    return this.struct.plate.wHole;
  }
  shape(y=0): Polyline{
    const t = this.struct;
    const as = this.rebars.as;
    const l = this.l/2 - this.lHole/2 - t.plate.vHa - t.t;
    if(l <= t.plate.t){
      return new Polyline(-this.l/2, t.plate.t/2 + t.plate.vHa + t.t + y - 1)
        .lineBy(0, 1)
        .lineBy(this.l/2 - this.lHole/2, -this.l/2 + this.lHole/2)
        .lineBy(0, -1)
        .offset(as, Side.Right)
        .removeStart()
        .removeEnd();
    }else{
      const h = t.plate.t + t.plate.vHa + t.t;
      return new Polyline(-this.l/2, t.plate.t/2 + t.plate.vHa + t.t + y - 1)
        .lineBy(0, 1)
        .lineBy(h, -h)
        .lineBy(-1, 0)
        .offset(as, Side.Right)
        .removeStart()
        .removeEnd();
    }
  }
}

export class PlateWHaunch extends PlateLHaunch{
  get l(): number{
    return this.struct.w;
  }
  get lHole(): number{
    return this.struct.plate.wHole;
  }
  get wHole(): number{
    return this.struct.plate.lHole;
  }
}

