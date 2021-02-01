import { CountRebarSpec, divideBySpace, last, RebarSpec, SpaceRebarSpec, UnitRebarSpec } from "@/draw";
import { RebarContainer } from "@/struct/utils";

export class Column{
  pos;
  constructor(public struct: ColumnStruct, public rebars: ColumnRebar) {
    this.pos = new ColumnRebarPos(struct, rebars);
  }
}

export class ColumnContext {
  struct;
  rebars;
  pos;
  constructor(protected context: Column) {
    this.struct = context.struct;
    this.rebars = context.rebars;
    this.pos = context.pos;
  }
}

export class ColumnStruct{
  h = 0;
  w = 0;
  
  //
  l = 0;
  ld = 0;
  n = 0;
  lSpace = 0;
  hTopBeam = 0;
  hBeam = 0;
}

export class ColumnRebar extends RebarContainer {
  corner = new UnitRebarSpec();
  along = new CountRebarSpec();
  cross = new CountRebarSpec();
  stir = new SpaceRebarSpec();

  stirAlong: RebarSpec[] = [];
  stirCross: RebarSpec[] = [];
  as = 0;
}

export class ColumnRebarPos{
  constructor(protected struct: ColumnStruct, protected rebars: ColumnRebar){}
  partition(): number[]{
    const t = this.struct;
    const n = t.n;
    const h0 = t.lSpace - t.hBeam;
    const d = Math.ceil(Math.max(t.h, h0 / 6, 500) / 100) * 100;
    if (n === 0) {
      if (t.l <= 2 * d + t.hTopBeam) {
        return [t.l];
      } else {
        return [t.hTopBeam + d, t.l - 2 * d - t.hTopBeam, d];
      }
    } else {
      const res: number[] = [];
      for (let i = 0; i < n; i++) {
        if (i === 0) {
          res.push(t.hTopBeam + d, t.lSpace - t.hTopBeam - 2 * d);
        } else {
          res.push(2 * d + t.hBeam, t.lSpace - 2 * d - t.hBeam);
        }
      }
      const h = t.l - n * t.lSpace;
      if (h < 2 * d + t.hBeam) {
        res.push(h + d);
      } else {
        res.push(2 * d + t.hBeam, h - 2 * d - t.hBeam, d);
      }
      return res;
    }
  }
  stir(): number[]{
    const partition = this.partition();
    const res: number[] = [];
    const bar = this.rebars.stir;
    const as = this.rebars.as;
    const count = partition.length;
    let h = this.struct.l;
    for (let i = 0; i < count; i++) {
      let l;
      if(i === 0){
        l = partition[0]- as;
      }else if(i < count -1){
        l = partition[i];
      }else{
        l = last(partition) - 50;
      }
      const space = i % 2 === 0 ? bar.denseSpace : bar.space;
      const ys = divideBySpace(h, h-l, space);
      if (i % 2 === 1) {
        res.push(...ys.slice(1, -1));
      }else{
        res.push(...ys);
      }
      h -= l;
    }
    return res;
  }
}