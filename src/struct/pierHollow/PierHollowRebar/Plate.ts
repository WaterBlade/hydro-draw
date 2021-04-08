import { Line, Polyline, RebarForm, RebarFormPreset, vec } from "@/draw";
import { PierHollowSpaceRebar } from "./PierHollowRebar";

export class PlateLMain extends PierHollowSpaceRebar{
  get l(): number{
    return this.struct.l;
  }
  get lHole(): number{
    return this.struct.plate.lHole;
  }
  get wHole(): number{
    return this.struct.plate.wHole;
  }
  get count(): number{
    return this.struct.plate_count() * 2 * this.pos().points.length;
  }
  get form(): RebarForm{
    const as = this.rebars.as;
    const t = this.struct;
    return RebarFormPreset.CShape(this.diameter, t.plate.t - 2*as, this.l/2 - this.lHole/2-2*as);
  }
  pos(x=0): Line{
    return new Line(vec(x, -this.wHole/2), vec(x, this.wHole/2)).divide(this.space);
  }
  shape(y=0): Polyline{
    const t = this.struct;
    const as = this.rebars.as;
    return new Polyline(-this.l/2, y-t.t/2+1)
      .lineBy(0, -1)
      .lineBy(this.l/2 - this.lHole/2, 0)
      .lineBy(0, t.t)
      .lineBy(-this.l/2 + this.lHole/2, 0)
      .lineBy(0, -1)
      .offset(as)
      .removeStart()
      .removeEnd()
  }
}

export class PlateWMain extends PlateLMain{
  get l(): number{
    return this.struct.w;
  }
  get lHole(): number{
    return this.struct.plate.wHole;
  }
  get wHole(): number{
    return this.struct.plate.lHole;
  }
  pos(y = 0): Line{
    return new Line(vec(-this.wHole/2, y), vec(this.wHole/2, y)).divide(this.space);
  }
}

export class PlateLDist extends PierHollowSpaceRebar{
  get l(): number{
    return this.struct.l;
  }
  get count(): number{
    return this.struct.plate_count() * 2 * 1;
  }
  get form(): RebarForm{
    return RebarFormPreset.Line(this.diameter, this.l-2*this.rebars.as);
  }
}

export class PlateWDist extends PlateLDist{
  get l(): number{
    return this.struct.w;
  }
}