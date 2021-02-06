export class PileStruct {
  d = 0;
  hs = 0;

  id = '';
  count = 0;
  top = 10;
  bottom = 0;
  load = 0;

  topAngle = 15;
  botAngle = 5;
  hp = 1500;

  get h(): number {
    return (this.top - this.bottom) * 1000;
  }

}