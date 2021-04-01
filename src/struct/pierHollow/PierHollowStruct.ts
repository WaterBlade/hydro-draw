import { Polyline } from "@/draw";

export class PierHollowStruct {
  h = 0;
  l = 0;
  w = 0;
  fr = 0;
  t = 0;
  ha = 0;
  vHa = 0;
  hTopSolid = 0;
  hBotSolid = 0;
  vSpace = 0;
  topBeam = new TopBeam();
  found = new Found();
  plate = new Plate();

  outline(): Polyline{
      return new Polyline(-this.l/2, -this.w/2+this.fr)
        .arcBy(this.fr, -this.fr, 90)
        .lineBy(this.l - 2*this.fr, 0)
        .arcBy(this.fr, this.fr, 90)
        .lineBy(0, this.w-2*this.fr)
        .arcBy(-this.fr, this.fr, 90)
        .lineBy(-this.l + 2*this.fr, 0)
        .arcBy(-this.fr, -this.fr, 90)
        .close();
  }
  inner(): Polyline{
      return new Polyline(-this.l/2 + this.t, -this.w/2+this.t+this.ha)
        .lineBy(this.ha, -this.ha)
        .lineBy(this.l - 2*this.t -2*this.ha, 0)
        .lineBy(this.ha, this.ha)
        .lineBy(0, this.w - 2*this.t - 2*this.ha)
        .lineBy(-this.ha, this.ha)
        .lineBy(-this.l + 2*this.t + 2*this.ha, 0)
        .lineBy(-this.ha, -this.ha)
        .close();
  }
  plate_inner(): Polyline{
    return new Polyline(-this.plate.lHole/2, -this.plate.wHole/2)
      .lineBy(this.plate.lHole, 0)
      .lineBy(0, this.plate.wHole)
      .lineBy(-this.plate.lHole, 0)
      .lineBy(0, -this.plate.wHole)
      .close()
  }
  plate_count(): number{
    return Math.floor((this.h - this.hTopSolid - this.hBotSolid-this.vHa-this.plate.vHa)/(this.vSpace+this.plate.t));
  }
}

class TopBeam {
  h = 0;
  w = 0;
  l = 0;
}

class Found {
  h = 0;
  w = 0;
  l = 0;
}

class Plate{
  t = 0;
  lHole = 0;
  wHole = 0;
  vHa = 0;
  get hTotal(): number{
    return this.t + 2*this.vHa;
  }
}
