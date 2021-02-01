import { PileStructInfo } from "./PileInfo";

export class PileStruct {
  d;
  hs;

  id;
  count;
  top;
  bottom;
  load;

  topAngle = 15;
  botAngle = 5;
  hp = 1500;

  constructor(protected info: PileStructInfo){
    const t = info;
    this.d = t.d;
    this.hs = t.hs;

    this.id = t.id;
    this.count = t.count;
    this.top = t.top;
    this.bottom = t.bottom;
    this.load = t.load;
  }

  get h(): number {
    return (this.top - this.bottom) * 1000;
  }

}