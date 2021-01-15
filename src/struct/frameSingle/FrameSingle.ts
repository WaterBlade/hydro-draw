export class FrameSingle{
  h = 0;
  vs = 0;
  hs = 0;
  col = new Column();
  beam = new Beam();
  topBeam = new Beam();
  corbel = new Corbel();
  found = new Foundation();
  get w(): number{
    return this.hs + this.col.w;
  }
  get n(): number{
    return Math.floor((this.h - 0.5*this.topBeam.h + 0.5*this.beam.h)/ this.vs)
  }
}

class Column{
  h = 0;
  w = 0;
}

class Beam{
  h = 0;
  w = 0;
  ha = 0;
}

class Corbel{
  w = 0;
  hs = 0;
  hd = 0;
  get h(): number{
    return this.hs + this.hd;
  }
}

class Foundation{
  h = 0;
  s = 0;
}