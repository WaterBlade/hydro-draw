import { BeamStruct, ColumnStruct } from "../component";

export class FrameDoubleStruct {
  col = new ColumnStruct();
  topCross = new BeamStruct();
  topAlong = new BeamStruct();
  beamCross = new BeamStruct();
  beamAlong = new BeamStruct();
  found = new Foundation();

  h = 0;
  hsCross = 0;
  hsAlong = 0;
  vs = 0;
  get wCross(): number {
    return this.hsCross + this.col.w;
  }
  get wAlong(): number {
    return this.hsAlong + this.col.h;
  }
  get n(): number {
    return Math.floor(
      (this.h - 0.5 * this.topCross.h + 0.5 * this.beamCross.h) / this.vs
    );
  }
  get hsnCross(): number {
    return this.hsCross - this.col.w;
  }
  get hsnAlong(): number {
    return this.hsAlong - this.col.h;
  }
  get h0(): number {
    return this.hsCross - this.beamCross.h;
  }

  initComponent(): void {
    // col;
    const col = this.col;
    col.hBeam = Math.max(this.beamCross.h, this.beamAlong.h);
    col.hTopBeam = Math.max(this.topCross.h, this.topAlong.h);
    col.l = this.h;
    col.lSpace = this.vs;
    col.ld = this.found.hn;
    col.n = 2;
    col.partitionCount = this.n;
    // beam
    const bCross = this.beamCross;
    bCross.l = this.wCross;
    bCross.ln = this.hsnCross;
    bCross.n = this.n - 1;
    const bAlong = this.beamAlong;
    bAlong.l = this.wAlong;
    bAlong.ln = this.hsnAlong;
    bAlong.n = this.n - 1;
    // topBeam
    const tCross = this.topCross;
    tCross.l = this.wCross;
    tCross.ln = this.hsnCross;
    tCross.n = 1;
    const tAlong = this.topAlong;
    tAlong.l = this.wAlong;
    tAlong.ln = this.hsnAlong;
    tAlong.n = 1;
  }
}

class Foundation {
  h = 0;
  s = 0;
  get hn(): number {
    return this.h - this.s;
  }
}
