import { CountRebarSpec, SpaceRebarSpec } from "@/draw";

export class RebarCollector {
  rebars: (CountRebarSpec | SpaceRebarSpec)[] = [];
  protected id = 1;
  add(rebar: CountRebarSpec | SpaceRebarSpec): void {
    rebar.setId(`${this.id++}`);
    this.rebars.push(rebar);
  }
}

export interface RebarBuild {
  build(): void;
  upload(col: RebarCollector): void;
  setStructure(name: string): void;
}

export class RebarContainer<T> implements RebarBuild {
  constructor(protected struct: T) {}
  rebars: RebarBuild[] = [];
  build(): void {
    const name = this.structName;
    this.rebars.forEach((bar) => {
      if (name !== "") bar.setStructure(name);
      bar.build();
    });
  }
  upload(col: RebarCollector): void {
    this.rebars.forEach((bar) => bar.upload(col));
  }
  protected structName = "";
  setStructure(name: string): void {
    this.rebars.forEach((bar) => bar.setStructure(name));
  }
  add(rebar: RebarBuild): void {
    this.rebars.push(rebar);
  }
}

export function item<T extends RebarBuild, U>(
  container: RebarContainer<U>,
  rebar: T
): T {
  container.add(rebar);
  return rebar;
}

export abstract class CountRebar<T>
  extends CountRebarSpec
  implements RebarBuild {
  constructor(protected struct: T) {
    super();
  }
  build(): void {
    this.initForm();
  }
  upload(col: RebarCollector): void {
    col.add(this);
  }
  protected abstract initForm(): void;
}

export abstract class SpaceRebar<T>
  extends SpaceRebarSpec
  implements RebarBuild {
  constructor(protected struct: T) {
    super();
  }
  build(): void {
    this.initFormAndCount();
  }
  upload(col: RebarCollector): void {
    col.add(this);
  }
  protected abstract initFormAndCount(): void;
}
