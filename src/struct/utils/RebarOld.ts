import {
  RebarDiameter,
  RebarForm,
  RebarFormPreset,
  RebarGrade,
  RebarSpec,
} from "@/draw";

class IdGenerator {
  protected _id = 1;
  gen(): number {
    return this._id++;
  }
  clear(): void {
    this._id = 1;
  }
}

interface DefaultRebarInfoInterface {
  as: number;
}

export class DefaulRebarInfo {
  as = 0;
}

export class RebarContainer {
  protected idGen = new IdGenerator();
  protected records: RebarSpec[] = [];
  info: DefaultRebarInfoInterface = new DefaulRebarInfo();
  get rebars(): RebarSpec[] {
    return this.records;
  }
  get id(): string {
    return `${this.idGen.gen()}`;
  }
  record(spec: RebarSpec): void {
    this.records.push(spec);
  }
  clear(): void {
    this.idGen.clear();
    this.records.splice(0);
  }
}

export class CompositeRebarOld<T = DefaultRebarInfoInterface> {
  constructor(public container: RebarContainer, public info: T) {}
}

export class RebarOld<T = DefaultRebarInfoInterface> {
  protected _id?: string;
  get id(): string {
    if (!this._id) throw Error("id not init");
    return this._id;
  }
  protected _grade?: RebarGrade;
  get grade(): RebarGrade {
    if (!this._grade) throw Error("grade not init");
    return this._grade;
  }
  Grade(val: RebarGrade): this {
    this._grade = val;
    return this;
  }

  protected _diameter?: RebarDiameter;
  get diameter(): RebarDiameter {
    if (!this._diameter) throw Error("diameter not init");
    return this._diameter;
  }
  Dia(val: RebarDiameter): this {
    this._diameter = val;
    return this;
  }

  protected _layerCount?: number;
  get layerCount(): number {
    if (!this._layerCount) throw Error("layerCount not init");
    return this._layerCount;
  }
  protected _layerSpace?: number;
  get layerSpace(): number {
    if (!this._layerSpace) throw Error("layerSpace not init");
    return this._layerSpace;
  }
  Layer(count: number, space = 50): this {
    this._layerCount = count;
    this._layerSpace = space;
    return this;
  }

  constructor(protected container: RebarContainer, protected info: T) {}
  genSpec(): RebarSpec {
    return new RebarSpec().setGrade(this.grade).setDiameter(this.diameter);
  }

  isExist(): boolean {
    return true;
  }
  buildRebar(container: RebarContainer, name = ""): void {
    if (this.isExist()) {
      this._id = container.id;
      container.record(
        new RebarSpec()
          .setId(this.id)
          .setGrade(this.grade)
          .setDiameter(this.diameter)
          .setForm(this.form)
          .setName(name)
      );
    }
  }

  get form(): RebarForm {
    return RebarFormPreset.Line(this.diameter, 1000);
  }
  get count(): number {
    return 0;
  }
}

export class UnitRebarOld<T = DefaultRebarInfoInterface> extends RebarOld<T> {
  set(grade: RebarGrade, diameter: RebarDiameter): void {
    this._grade = grade;
    this._diameter = diameter;
  }
}

export class CountRebarOld<T = DefaultRebarInfoInterface> extends RebarOld<T> {
  set(
    grade: RebarGrade,
    diameter: RebarDiameter,
    singleCount: number,
    layerCount = 1,
    layerSpace = 50
  ): void {
    this._grade = grade;
    this._diameter = diameter;
    this._singleCount = singleCount;
    this._layerCount = layerCount;
    this._layerSpace = layerSpace;
  }
  protected _singleCount?: number;
  get singleCount(): number {
    if (!this._singleCount) throw Error("singleCount not init");
    return this._singleCount;
  }
  Count(val: number): this {
    this._singleCount = val;
    return this;
  }
}

export class SpaceRebarOld<T = DefaultRebarInfoInterface> extends RebarOld<T> {
  set(
    grade: RebarGrade,
    diameter: RebarDiameter,
    space: number,
    denseSpace = 0,
    layerCount = 1,
    layerSpace = 50
  ): void {
    this._grade = grade;
    this._diameter = diameter;
    this._space = space;
    this._denseSpace = denseSpace ? denseSpace : space / 2;
    this._layerCount = layerCount;
    this._layerSpace = layerSpace;
  }
  protected _space?: number;
  protected _denseSpace?: number;
  get space(): number {
    if (!this._space) throw Error("space not init");
    return this._space;
  }
  get denseSpace(): number {
    if (!this._denseSpace) throw Error("denseSpace not init");
    return this._denseSpace;
  }
  Space(space: number, denseSpace?: number): this {
    this._space = space;
    if (denseSpace) this._denseSpace = denseSpace;
    return this;
  }
}
