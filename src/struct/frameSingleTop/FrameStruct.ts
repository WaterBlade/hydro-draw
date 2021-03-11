import { BeamStruct, ColumnStruct, TopBeamStruct } from "../component";

export class FrameSingleStruct {
  col = new ColumnStruct();
  topBeam = new TopBeamStruct();
  beam = new BeamStruct();
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
    col.toTop = false;
    // beam
    const beam = this.beam;
    beam.l = this.w;
    beam.ln = this.hsn;
    beam.n = this.n;
    beam.topHa = true;
    beam.botHa = true;
    // topBeam
    const tb = this.topBeam;
    tb.ln = this.hsn;
    tb.n = 1;
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

class Foundation {
  h = 0;
  s = 0;
  get hn(): number {
    return this.h - this.s;
  }
}
