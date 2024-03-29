import { BeamStruct, ColumnStruct } from "../component";

export class FrameSingleStruct {
  col = new ColumnStruct();
  topBeam = new BeamStruct();
  beam = new BeamStruct();
  corbel = new Corbel();
  found = new Foundation();

  initComponent(): void {
    // col;
    const col = this.col;
    col.hBeam = this.beam.h;
    col.hTopBeam = this.topBeam.h;
    col.l = this.h;
    col.lSpace = this.vs;
    col.ld = this.found.hn;
    col.n = 2;
    col.partitionCount = this.n;
    // beam
    const beam = this.beam;
    beam.l = this.w;
    beam.ln = this.hsn;
    beam.n = this.n;
    // topBeam
    const tb = this.topBeam;
    tb.l = this.w;
    tb.ln = this.hsn;
    tb.n = 1;
    tb.isTop = true;
  }
  h = 0;
  hs = 0;
  vs = 0;
  get w(): number {
    return this.hs + this.col.w;
  }
  get n(): number {
    return Math.floor((this.h - this.beam.h - this.beam.ha) / this.vs);
  }
  get hsn(): number {
    return this.hs - this.col.w;
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
