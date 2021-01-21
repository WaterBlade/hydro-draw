export class Pile{
  d = 0;
  hs = 150;

  id = '';
  count = 0;
  top = 10;
  bottom = 0;
  load = 0;

  topAngle = 15;
  botAngle = 5;

  get h(): number{
    return (this.top - this.bottom)*1000;
  }
}