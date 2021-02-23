import { RebarDiameter } from "@/draw/misc";
import { RebarForm } from "./RebarForm";

export type RebarGrade = "HPB300" | "HRB400";

export class RebarSpec {
  constructor(
    grade?: RebarGrade,
    diameter?: RebarDiameter,
    count?: number,
    form?: RebarForm
  ) {
    if (grade) this.setGrade(grade);
    if (diameter) this.setDiameter(diameter);
    if (count) this.setCount(count);
    if (form) this.setForm(form);
  }

  protected _grade?: RebarGrade;
  get grade(): RebarGrade {
    if (!this._grade) throw Error("grade not init");
    return this._grade;
  }
  setGrade(grade: RebarGrade): this {
    this._grade = grade;
    return this;
  }

  protected _diameter?: RebarDiameter;
  get diameter(): RebarDiameter {
    if (!this._diameter) throw Error("diameter not init");
    return this._diameter;
  }
  setDiameter(diameter: RebarDiameter): this {
    this._diameter = diameter;
    return this;
  }

  protected _count?: number;
  get count(): number {
    if (!this._count) throw Error("count not init");
    return this._count;
  }
  setCount(count: number): this {
    this._count = count;
    return this;
  }

  protected _form?: RebarForm;
  get form(): RebarForm {
    if (!this._form) throw Error("form not init");
    return this._form;
  }
  setForm(form: RebarForm): this {
    this._form = form;
    this._length = form.length;
    return this;
  }

  protected _length?: number;
  get length(): number {
    if (!this._length) throw Error("length not init");
    return this._length;
  }

  get totalLength(): number {
    return this.length * this.count * 0.001;
  }

  protected _id?: string;
  get id(): string {
    if(!this._id) throw Error('id not init');
    return this._id;
  }
  setId(id: string): this {
    this._id = id;
    return this;
  }

  protected _name = "";
  get name(): string {
    return this._name;
  }
  setName(name: string): this {
    this._name = name;
    return this;
  }
}
