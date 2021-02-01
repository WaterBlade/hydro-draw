import { RebarSpec } from "@/draw";

class IdGenerator {
  protected _id = 1;
  gen(): string {
    return `${this._id++}`;
  }
  clear(): void {
    this._id = 1;
  }
}

export class RebarContainer {
  id: IdGenerator;
  recordRebars: RebarSpec[];
  constructor(parent?: RebarContainer){
    this.id = parent ? parent.id : new IdGenerator();
    this.recordRebars = parent ? parent.recordRebars : [];
  }
  record(spec: RebarSpec): void {
    this.recordRebars.push(spec);
  }
  clear(): void {
    this.recordRebars.splice(0);
    this.id.clear();
  }
}
