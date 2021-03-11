export class TopBeamStruct {
  get h(): number {
    return this.hd + this.hs;
  }
  get w(): number {
    return this.ws * 2 + this.wb;
  }

  ws = 0;
  wb = 0;
  hd = 0;
  hs = 0;

  l = 0;
  ln = 0;
  n = 0;
}
