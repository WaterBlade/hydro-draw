import { RebarDiameter, RebarGrade, RebarSpec } from "@/draw";


class IdGenerator{
  protected _id = 1;
  gen(): number{
    return this._id++;
  }
  clear(): void{
    this._id = 1;
  }
}

interface DefaultRebarInfoInterface{
  as: number;
}

export class DefaulRebarInfo{
  as = 0;
}


export class RebarContainer{
  protected idGen = new IdGenerator();
  protected records: RebarSpec[] = [];
  info: DefaultRebarInfoInterface = new DefaulRebarInfo();
  get rebars(): RebarSpec[]{
    return this.records;
  }
  get id(): string{
    return `${this.idGen.gen()}`
  }
  record(spec: RebarSpec): void{
    this.records.push(spec);
  }
  clear(): void{
    this.idGen.clear();
    this.records.splice(0);
  }
}


export class CompositeRebar<T=DefaultRebarInfoInterface>{
  constructor(public container: RebarContainer, public info: T){
  }
}


export class Rebar<T = DefaultRebarInfoInterface>{
  protected _grade?: RebarGrade;
  get grade(): RebarGrade{
    if(!this._grade) throw Error('grade not init');
    return this._grade;
  }
  protected _diameter?: RebarDiameter;
  get diameter(): RebarDiameter{
    if(!this._diameter) throw Error('diameter not init');
    return this._diameter;
  }
  protected _spec?: RebarSpec;
  get spec(): RebarSpec{
    if(!this._spec) throw Error('spec not init');
    return this._spec;
  }
  set spec(val: RebarSpec){
    this._spec = val;
  }
  constructor(protected container: RebarContainer, protected info: T){}
  genSpec(): RebarSpec{
    return new RebarSpec().setGrade(this.grade).setDiameter(this.diameter);
  }
}


export class UnitRebar<T = DefaultRebarInfoInterface> extends Rebar<T>{
  set(grade: RebarGrade, diameter: RebarDiameter): void{
    this._grade = grade;
    this._diameter = diameter;
  }
}


export class CountRebar<T = DefaultRebarInfoInterface> extends Rebar<T>{
  set(grade: RebarGrade, diameter: RebarDiameter, singleCount: number, layerCount=1, layerSpace=50): void{
    this._grade = grade;
    this._diameter = diameter;
    this._singleCount = singleCount;
    this._layerCount = layerCount;
    this._layerSpace = layerSpace;
  }
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


export class SpaceRebar<T = DefaultRebarInfoInterface> extends Rebar<T>{
  set(grade: RebarGrade, diameter: RebarDiameter, space: number, denseSpace=0): void{
    this._grade = grade;
    this._diameter = diameter;
    this._space = space;
    this._denseSpace = denseSpace ? denseSpace : space / 2;
  }
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
