import { BeamStruct, ColumnStruct } from "@/struct/component";

export class FrameSingleStruct {
  h = 0;
  vs = 0;
  hs = 0;
  col = new ColumnStruct();
  beam = new BeamStruct();
  topBeam = new BeamStruct();
  corbel = new Corbel();
  found = new Foundation();
  get w(): number {
    return this.hs + this.col.w;
  }
  get n(): number {
    return Math.floor(
      (this.h - 0.5 * this.topBeam.h + 0.5 * this.beam.h) / this.vs
    );
  }
}

class Corbel {
  w = 0;
  hs = 0;
  hd = 0;
  get h(): number {
    return this.hs + this.hd;
  }
}

class Foundation {
  h = 0;
  s = 0;
  get hn(): number {
    return this.h - this.s;
  }
}
