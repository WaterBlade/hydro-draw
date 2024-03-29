export class ColumnStruct {
  h = 0;
  w = 0;

  //
  l = 0;
  ld = 0;
  n = 0;

  lSpace = 0;
  hTopBeam = 0;
  hBeam = 0;
  partitionCount = 0;
  toTop = true;
  partition(): number[] {
    const n = this.partitionCount;
    const h0 = this.lSpace - this.hBeam;
    const d = Math.ceil(Math.max(this.h, h0 / 6, 500) / 100) * 100;
    const botD = Math.ceil(((this.lSpace - this.hBeam) / 3) / 100) * 100;
    if (n === 0) {
      if (this.l <= d + botD + this.hTopBeam) {
        return [this.l, this.ld];
      } else {
        return [this.hTopBeam + d, this.l - d - botD - this.hTopBeam, botD, this.ld];
      }
    } else {
      const res: number[] = [];
      for (let i = 0; i < n; i++) {
        if (i === 0) {
          res.push(this.hTopBeam + d, this.lSpace - this.hTopBeam - 2 * d);
        } else {
          res.push(2 * d + this.hBeam, this.lSpace - 2 * d - this.hBeam);
        }
      }
      const h = this.l - n * this.lSpace;
      if (h <=  d + this.hBeam + botD) {
        res.push(h + d);
      } else {
        res.push(2 * d + this.hBeam, h - d - this.hBeam - botD, botD);
      }
      res.push(this.ld)
      return res;
    }
  }
}
