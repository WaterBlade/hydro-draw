import { divideBySpace, last, RebarForm, RebarFormPreset, Side } from "@/draw";
import {
  CompositeRebar,
  CountRebar,
  Rebar,
  RebarRoot,
  SpaceRebar,
} from "@/struct/utils";
import { ColumnStruct } from "./ColumnStruct";

export class ColumnRebar extends CompositeRebar {
  corner = this.add(new Corner(this.struct, this));
  cross = this.add(new Cross(this.struct, this));
  along = this.add(new Along(this.struct, this));
  stir = this.add(new Stir(this.struct, this));
  stirAlong = this.add(new StirAlong(this.struct, this));
  tendonAlong = this.add(new TendonAlong(this.struct, this));
  stirCross = this.add(new StirCross(this.struct, this));
  tendonCross = this.add(new TendonCross(this.struct, this));

  constructor(
    protected struct: ColumnStruct,
    protected rebars: RebarRoot,
    protected name = ""
  ) {
    super();
  }

  get as(): number {
    return this.rebars.as;
  }
}

class Corner extends Rebar {
  constructor(protected struct: ColumnStruct, protected rebars: ColumnRebar) {
    super();
  }
  get count(): number {
    return 4 * this.struct.n;
  }
  get form(): RebarForm {
    const t = this.struct;
    return RebarFormPreset.SShape(
      this.diameter,
      300,
      t.l + t.ld - this.rebars.as * 2,
      500,
      7
    )
      .text("柱顶", Side.Left, true)
      .text("柱底", Side.Right, true);
  }
}

class Cross extends CountRebar {
  constructor(protected struct: ColumnStruct, protected rebars: ColumnRebar) {
    super();
  }
  get count(): number {
    return this.singleCount * this.struct.n * 2;
  }
  get form(): RebarForm {
    const t = this.struct;
    return RebarFormPreset.SShape(
      this.diameter,
      300,
      t.l + t.ld - this.rebars.as * 2,
      500,
      7
    )
      .text("柱顶", Side.Left, true)
      .text("柱底", Side.Right, true);
  }
}

class Along extends CountRebar {
  constructor(protected struct: ColumnStruct, protected rebars: ColumnRebar) {
    super();
  }
  get count(): number {
    return this.singleCount * this.struct.n * 2;
  }
  get form(): RebarForm {
    const t = this.struct;
    return RebarFormPreset.SShape(
      this.diameter,
      300,
      t.l + t.ld - this.rebars.as * 2,
      500,
      7
    )
      .text("柱顶", Side.Left, true)
      .text("柱底", Side.Right, true);
  }
}

class Stir extends SpaceRebar {
  constructor(protected struct: ColumnStruct, protected rebars: ColumnRebar) {
    super();
  }
  get count(): number {
    return this.pos().length * this.struct.n;
  }
  get form(): RebarForm {
    const t = this.struct;
    const as = this.rebars.as;
    return RebarFormPreset.RectStir(this.diameter, t.w - 2 * as+this.diameter, t.h - 2 * as+this.diameter);
  }

  pos(): number[] {
    const t = this.struct;
    const partition = t.partition();
    const res: number[] = [];
    const as = this.rebars.as;
    const count = partition.length;
    let h = t.l - as - (t.toTop ? 0 : t.hTopBeam);
    for (let i = 0; i < count; i++) {
      let l;
      if (i === 0) {
        l = partition[0] - as - (t.toTop ? 0 : t.hTopBeam);
      } else if (i < count - 1) {
        l = partition[i];
      } else {
        l = last(partition) - 50;
      }
      const space = i % 2 === 0 ? this.denseSpace : this.space;
      const ys = divideBySpace(h, h - l, space);
      if (i % 2 === 1) {
        res.push(...ys.slice(1, -1));
      } else {
        res.push(...ys);
      }
      h -= l;
    }
    return res;
  }
}

class StirAlong extends Stir {
  get count(): number {
    return super.count * Math.floor(this.rebars.cross.singleCount / 2);
  }
  get form(): RebarForm {
    const t = this.struct;
    const as = this.rebars.as;
    const corner = this.rebars.corner;
    const cross = this.rebars.cross;
    const h =
      (t.w - 2 * as - corner.diameter) / (cross.singleCount + 1) +
      cross.diameter;
    const w = t.h - 2 * as+this.diameter;
    return RebarFormPreset.RectStir(this.diameter, h, w);
  }
  isExist(): boolean {
    return this.rebars.cross.singleCount > 1;
  }
}

class TendonAlong extends Stir {
  get form(): RebarForm {
    const w = this.struct.h - 2 * this.rebars.as+this.diameter;
    return RebarFormPreset.HookLine(this.diameter, w, 4);
  }
  isExist(): boolean {
    return this.rebars.cross.singleCount % 2 === 1;
  }
}

class StirCross extends Stir {
  get count(): number {
    return super.count * Math.floor(this.rebars.along.singleCount / 2);
  }
  get form(): RebarForm {
    const t = this.struct;
    const as = this.rebars.as;
    const corner = this.rebars.corner;
    const along = this.rebars.along;
    const h =
      (t.h - 2 * as - corner.diameter) / (along.singleCount + 1) +
      along.diameter;
    const w = t.w - 2 * as+this.diameter;
    return RebarFormPreset.RectStir(this.diameter, h, w);
  }
  isExist(): boolean {
    return this.rebars.along.singleCount > 1;
  }
}

class TendonCross extends Stir {
  get form(): RebarForm {
    const w = this.struct.w - 2 * this.rebars.as+this.diameter;
    return RebarFormPreset.HookLine(this.diameter, w, 4);
  }
  isExist(): boolean {
    return this.rebars.along.singleCount % 2 === 1;
  }
}
