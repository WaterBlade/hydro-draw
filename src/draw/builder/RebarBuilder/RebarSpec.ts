import { RebarDiameter } from "@/draw/misc";
import { RebarForm } from "./RebarForm";

type RebarGrade = "HPB300" | "HRB400";

export class RebarSpec {
  _id = "";
  _structure = "";
  public length: number;
  constructor(
    public grade: RebarGrade,
    public diameter: RebarDiameter,
    public count: number,
    public form: RebarForm,
    length?: number
  ) {
    if (!length) {
      this.length = form.length;
    } else {
      this.length = length;
    }
  }
  get totalLength(): number {
    return this.length * this.count * 0.001;
  }
  get id(): string {
    return this._id;
  }
  get structure(): string {
    return this._structure;
  }

  setId(id: string): this {
    this._id = id;
    return this;
  }
  setStructure(name: string): this {
    this._structure = name;
    return this;
  }
}
