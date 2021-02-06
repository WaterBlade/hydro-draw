import { CountRebarSpec, SpaceRebarSpec, UnitRebarSpec } from "@/draw";

export class CountRebarOld<T> extends CountRebarSpec {
  constructor(public pos: T) {
    super();
  }
}

export class SpaceRebarOld<T> extends SpaceRebarSpec {
  constructor(public pos: T) {
    super();
  }
}

export class UnitRebarOld<T> extends UnitRebarSpec {
  constructor(public pos: T) {
    super();
  }
}
