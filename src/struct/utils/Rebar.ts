import { RebarDiameter, RebarForm, RebarGrade, RebarSpec } from "@/draw";

class IdGen {
  private index = 1;
  get id(): string {
    return `${this.index++}`;
  }
}

export interface RebarComponent {
  init(outerIdGen: IdGen): void;
  genSpecs(name: string): RebarSpec[];
}

export class CompositeRebar implements RebarComponent {
  protected name = "";
  protected components: RebarComponent[] = [];
  init(outerIdGen?: IdGen): void {
    const idGen = outerIdGen ? outerIdGen : new IdGen();
    this.components.forEach((c) => c.init(idGen));
  }
  genSpecs(outerName = ""): RebarSpec[] {
    const name = outerName !== "" ? outerName : this.name;
    return this.components.reduce(
      (pre: RebarSpec[], cur) => pre.concat(cur.genSpecs(name)),
      []
    );
  }
  protected add<S extends RebarComponent>(comp: S): S {
    this.components.push(comp);
    return comp;
  }
}

export abstract class RebarRoot extends CompositeRebar {
  as = 0;
}

export abstract class Rebar implements RebarComponent {
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
  protected _diameter?: RebarDiameter;
  get diameter(): RebarDiameter {
    if (!this._diameter) throw Error("diameter not init");
    return this._diameter;
  }
  setSpec(grade: RebarGrade, dia: RebarDiameter): this {
    this._grade = grade;
    this._diameter = dia;
    return this;
  }

  layerCount = 1;
  layerSpace = 50;
  setLayer(count: number, space = 50): this {
    this.layerCount = count;
    this.layerSpace = space;
    return this;
  }

  isExist(): boolean {
    return true;
  }
  init(idGen: IdGen): void {
    if (this.isExist()) {
      this._id = idGen.id;
    }
  }
  genSpecs(name: string): RebarSpec[] {
    if (this.isExist()) {
      return [
        new RebarSpec()
          .setId(this.id)
          .setGrade(this.grade)
          .setDiameter(this.diameter)
          .setForm(this.form)
          .setCount(this.count)
          .setName(name)
          .setDesp(this.desp),
      ];
    }
    return [];
  }

  abstract get form(): RebarForm;
  abstract get count(): number;
  get desp(): string {
    return "";
  }
}

export abstract class CountRebar extends Rebar {
  protected _singleCount?: number;
  get singleCount(): number {
    if (!this._singleCount) throw Error("singleCount not init");
    return this._singleCount;
  }
  setCount(singleCount: number): this {
    this._singleCount = singleCount;
    return this;
  }
}

export abstract class SpaceRebar extends Rebar {
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
  setSpace(space: number, denseSpace?: number): this {
    this._space = space;
    if (denseSpace) this._denseSpace = denseSpace;
    return this;
  }
}
