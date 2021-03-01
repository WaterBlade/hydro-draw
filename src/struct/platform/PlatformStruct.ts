export class PlatformStruct {
  l = 0;
  w = 0;
  h = 0;
  d = 0;
  nl = 1;
  sl = 0;
  nw = 1;
  sw = 0;

  hs = 150;
  lBottomDivide(): number[]{
    const space = (this.l - (this.nl - 1) * this.sl - this.d)/2;
    if(space < 1e-6) throw Error('no space left');
    const res = [];

    let x = -this.l / 2;
    res.push(x);

    x += space;
    res.push(x);

    for(let i = 0; i < this.nl; i++){
      x += this.d;
      res.push(x);
      if(i < this.nl - 1){
        x += this.sl - this.d;
        res.push(x);
      }
    }

    x += space;
    res.push(x);

    return res;
  }
  wBottomDivide(): number[]{
    const space = (this.w - (this.nw - 1) * this.sw - this.d)/2;
    if(space < 1e-6) throw Error('no space left');
    const res = [];

    let x = -this.w / 2;
    res.push(x);

    x += space;
    res.push(x);

    for(let i = 0; i < this.nw; i++){
      x += this.d;
      res.push(x);
      if(i < this.nw - 1){
        x += this.sw - this.d;
        res.push(x);
      }
    }

    x += space;
    res.push(x);

    return res;
  }
}