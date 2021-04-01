export class PierSolidStruct {
  h = 0;
  l = 0;
  w = 0;
  fr = 0;
  topBeam = new TopBeam();
  found = new Found();
  partition(): number[]{
    if(this.h <= 8000){
      return [this.h];
    }else{
      return [4000, this.h - 8000, 4000];
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
