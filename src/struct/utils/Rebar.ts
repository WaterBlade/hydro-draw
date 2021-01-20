import { CountRebarSpec, SpaceRebarSpec, UnitRebarSpec } from "@/draw";

export class CountRebar<T> extends CountRebarSpec{
  constructor(public pos: T){
    super();
  }
}

export class SpaceRebar<T> extends SpaceRebarSpec{
  constructor(public pos: T){
    super();
  }
}

export class UnitRebar<T> extends UnitRebarSpec{
  constructor(public pos: T){
    super();
  }
}