import { RebarSpec } from "@/draw";

class IdGenerator {
  protected _id = 1;
  gen(): string {
    return `${this._id++}`;
  }
}

export class RebarContainer {
  id = new IdGenerator();
  recordRebars: RebarSpec[] = [];
  record(spec: RebarSpec): void {
    this.recordRebars.push(spec);
  }
}