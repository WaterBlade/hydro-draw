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
  get hsn(): number{
    return this.hs - this.col.w;
  }
  get h0(): number{
    return this.hs - this.beam.h;
  }
  calcColStirSpace(): number[]{
    const n = this.n;
    const d = Math.ceil(Math.max(this.col.h, this.h0/6, 500)/100)*100;
    if(n === 0){
      if(this.h <= 2*d + this.topBeam.h){
        return [this.h];
      }else{
        return [this.topBeam.h + d, this.h - 2*d - this.topBeam.h, d];
      }
    }else{
      const res: number[] = [];
      for(let i = 0; i < n; i++){
        if(i === 0){
          res.push(
            this.topBeam.h+d,
            this.hs - this.topBeam.h - 2*d
            );
        }else{
          res.push(
            2*d + this.beam.h,
            this.hs - 2*d - this.beam.h
          )
        }
      }
      const h = this.h - n * this.hs;
      if(h < 2*d + this.beam.h){
        res.push(h + d)
      }else{
        res.push(
          2*d + this.beam.h,
          h - 2*d - this.beam.h,
          d
          );
      }
      return res;
    }
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
  get hn(): number{
    return this.h - this.s;
  }
}