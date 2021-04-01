import { Circle, Content, DrawItem, TextDraw } from "@/draw/drawItem";
import { RebarDiameter, TextAlign, vec } from "@/draw/misc";
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

  multiple = 1;
  setMultiple(multiple: number): this{
    this.multiple = multiple;
    return this;
  }

  protected _grade?: RebarGrade;
  get grade(): RebarGrade {
    if (this._grade === undefined) throw Error("grade not init");
    return this._grade;
  }
  setGrade(grade: RebarGrade): this {
    this._grade = grade;
    return this;
  }

  protected _diameter?: RebarDiameter;
  get diameter(): RebarDiameter {
    if (this._diameter === undefined) throw Error(`${this._id} diameter not init`);
    return this._diameter;
  }
  setDiameter(diameter: RebarDiameter): this {
    this._diameter = diameter;
    return this;
  }

  protected _count?: number;
  get count(): number {
    if (this._count === undefined) throw Error(`${this._id} count not init`);
    return this._count;
  }
  setCount(count: number): this {
    this._count = count;
    return this;
  }

  protected _form?: RebarForm;
  get form(): RebarForm {
    if (this._form === undefined) throw Error(`${this._id} form not init`);
    return this._form;
  }
  setForm(form: RebarForm): this {
    this._form = form;
    this._length = form.length;
    return this;
  }

  protected _length?: number;
  get length(): number {
    if (this._length === undefined) throw Error("length not init");
    return this._length;
  }

  get totalLength(): number {
    return this.length * this.count * 0.001;
  }

  protected _id?: string;
  get id(): string {
    if (this._id === undefined) throw Error("id not init");
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

  protected _desp = "";
  get desp(): string {
    return this._desp;
  }
  setDesp(desp: string): this {
    this._desp = desp;
    return this;
  }

  genId(textHeight: number): DrawItem[]{
    return [
      new Circle(vec(0, 0), textHeight),
      new TextDraw(
        this.id,
        vec(0, 0),
        textHeight,
        TextAlign.MiddleCenter
      ),
    ];
  }
  genIdSpec(textHeight: number): DrawItem[]{
    let content;
    if(this.multiple === 1){
      content = new Content().special(this.grade).text(`${this.diameter}`);
    }else{
      content = new Content().text(`${this.multiple.toFixed(0)}`).special(this.grade).text(`${this.diameter}`);
    }
    return [
      ...this.genId(textHeight),
      new TextDraw(
        content,
        vec(textHeight, 0),
        textHeight,
        TextAlign.MiddleLeft
        )
    ]
  }
}
