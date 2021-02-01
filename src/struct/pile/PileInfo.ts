import { RebarDiameter, RebarGrade } from "@/draw";

export class PileInfo{
  struct = new PileStructInfo();
  rebar = new PileRebarInfo();
}

export class PileStructInfo {
  d = 0;
  hs = 150;

  id = "";
  count = 0;
  top = 10;
  bottom = 0;
  load = 0;

  topAngle = 15;
  botAngle = 5;
  hp = 1500;

}

export class PileRebarInfo{
  main = new CountRebar();
  stir = new SpaceRebar();
  topStir = new SpaceRebar();
  fix = new SpaceRebar();
  rib = new SpaceRebar();
  as = 60;
  anchorFactor = 40;
  denseFactor = 5;
  fixCount = 4;
}

abstract class Rebar{
  protected _grade?: RebarGrade;
  protected _diameter?: RebarDiameter;
  get grade(): RebarGrade{
    if(!this._grade) throw Error('grade not init');
    return this._grade;
  }
  get diameter(): RebarDiameter{
    if(!this._diameter) throw Error('diameter not init');
    return this._diameter;
  }
}

export class CountRebar extends Rebar{
  protected _singleCount?: number;
  protected _layerCount?: number;
  protected _layerSpace?: number;
  get singleCount(): number{
    if(!this._singleCount) throw Error('singleCount not init');
    return this._singleCount;
  }
  get layerCount(): number{
    if(!this._layerCount) throw Error('layerCount not init');
    return this._layerCount;
  }
  get layerSpace(): number{
    if(!this._layerSpace) throw Error('layerSpace not init');
    return this._layerSpace;
  }
}

export class SpaceRebar extends Rebar{
  protected _space?: number;
  protected _denseSpace?: number;
  get space(): number{
    if(!this._space) throw Error('space not init');
    return this._space;
  }
  get denseSpace(): number{
    if(!this._denseSpace) throw Error('denseSpace not init');
    return this._denseSpace;
  }
}
