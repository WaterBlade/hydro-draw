import { Line, Polyline, RebarForm, RebarFormPreset, vec } from "@/draw";
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
  shape(y=0): Line{
    const t = this.struct;
    const as = this.rebars.as;
    const l = this.l/2 - this.lHole/2 - t.plate.vHa - t.t;
    if(l <= t.plate.t){
      return new Line(
        vec(-this.l/2+as, t.plate.t/2+t.plate.vHa+t.t-2*as+y),
        vec(-this.lHole/2-as, t.plate.t/2 - l+y)
      );
    }else{
      return new Line(
        vec(-this.l/2+as, t.plate.t/2+t.plate.vHa+t.t-2*as+y),
        vec(-this.lHole/2-as-(l-t.plate.t), -t.plate.t/2+y)
      );
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

