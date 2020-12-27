import { RebarSpec } from "@/draw";

export abstract class RebarInStruct {
  specs: RebarSpec[] = [];
  protected id = 1;
  add(spec: RebarSpec): void {
    spec.setId(`${this.id++}`);
    this.specs.push(spec);
  }
  abstract build(): void;
}
