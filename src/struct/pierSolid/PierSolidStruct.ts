export class PierSolidStruct {
  h = 0;
  l = 0;
  w = 0;
  fr = 0;
  hTopDense = 0;
  hBotDense = 0;
  topBeam = new TopBeam();
  found = new Found();
  partition(): number[]{
    if(this.h <= this.hTopDense + this.hBotDense){
      return [this.h];
    }else{
      return [this.hTopDense, this.h - this.hTopDense - this.hBotDense, this.hBotDense];
    }
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
