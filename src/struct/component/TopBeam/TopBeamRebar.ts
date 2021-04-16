import {
  divideByCount,
  divideBySpace,
  Polyline,
  RebarForm,
  RebarFormPreset,
  RebarPathForm,
  Side,
  sum,
  vec,
  Vector,
} from "@/draw";
import { getSafe } from "@/misc";
import {
  CompositeRebar,
  CountRebar,
  RebarRoot,
  SpaceRebar,
} from "@/struct/utils";
import { TopBeamStruct } from "./TopBeamStruct";

export class TopBeamRebar extends CompositeRebar {
  bot = this.add(new BeamBot(this.struct, this));
  top = this.add(new BeamTop(this.struct, this));
  mid = this.add(new BeamMid(this.struct, this));
  stir = this.add(new Stir(this.struct, this));
  stirInner = this.add(new StirInner(this.struct, this));
  tendon = this.add(new Tendon(this.struct, this));

  constructor(
    protected struct: TopBeamStruct,
    protected rebars: RebarRoot,
    protected name = ""
  ) {
    super();
  }

  get as(): number {
    return this.rebars.as;
  }
}

abstract class BeamCountRebar extends CountRebar {
  constructor(protected struct: TopBeamStruct, protected rebars: TopBeamRebar) {
    super();
  }
}

abstract class BeamSpaceRebar extends SpaceRebar {
  constructor(protected struct: TopBeamStruct, protected rebars: TopBeamRebar) {
    super();
  }
}

class BeamBot extends BeamCountRebar {
  get count(): number {
    return this.singleCount * this.struct.n;
  }
  get form(): RebarForm {
    const t = this.struct;
    const as = this.rebars.as;
    return RebarFormPreset.Line(this.diameter, t.l - 2 * as);
  }
}

class BeamTop extends BeamCountRebar {
  get count(): number {
    return this.singleCount * this.struct.n;
  }
  get form(): RebarForm {
    const t = this.struct;
    const as = this.rebars.as;
    return RebarFormPreset.Line(this.diameter, t.l - 2 * as);
  }
}

class BeamMid extends BeamCountRebar {
  get count(): number {
    return this.singleCount * this.struct.n * 2;
  }
  get form(): RebarForm {
    const t = this.struct;
    const as = this.rebars.as;
    return RebarFormPreset.Line(this.diameter, t.l - 2 * as);
  }
  pos(r = 0): Vector[] {
    const t = this.struct;
    const pl = new Polyline(-t.w / 2, t.h / 2)
      .lineBy(0, -t.hd)
      .lineBy(t.ws, -t.hs)
      .offset(this.rebars.as + r);
    const ys = divideByCount(-t.h / 2, t.h / 2, this.singleCount + 1).slice(
      1,
      -1
    );
    return ys.map((y) => getSafe(0, pl.rayIntersect(vec(0, y), vec(1, 0))));
  }
}

class Stir extends BeamSpaceRebar {
  get count(): number {
    return this.pos().length * this.struct.n;
  }
  get form(): RebarForm {
    const lens = this.shape().segments.map((s) => s.calcLength());
    let i = 0;
    return new RebarPathForm(this.diameter)
      .lineBy(5, 0)
      .dimLength(lens[i++])
      .lineBy(0, -1.5)
      .dimLength(lens[i++])
      .lineBy(-1.5, -1.5)
      .dimLength(lens[i++])
      .lineBy(-2, 0)
      .dimLength(lens[i++])
      .lineBy(-1.5, 1.5)
      .dimLength(lens[i++])
      .lineBy(0, 1.5)
      .dimLength(lens[i++])
      .moveTo(4.9, 0)
      .lineBy(-0.4, -0.4)
      .moveTo(5, -0.1)
      .lineBy(-0.4, -0.4)
      .setLength(sum(...lens, 15 * this.diameter));
  }
  pos(): number[] {
    const t = this.struct;
    return divideBySpace(
      -t.l / 2 + this.rebars.as,
      t.l / 2 - this.rebars.as,
      this.space
    );
  }
  shape(): Polyline {
    const t = this.struct;
    return new Polyline(-t.w / 2, t.h / 2)
      .lineBy(t.w, 0)
      .lineBy(0, -t.hd)
      .lineBy(-t.ws, -t.hs)
      .lineBy(-t.wb, 0)
      .lineBy(-t.ws, t.hs)
      .close()
      .offset(this.rebars.as, Side.Right);
  }
}

class StirInner extends Stir {
  get form(): RebarForm {
    const t = this.struct;
    const as = this.rebars.as;
    return RebarFormPreset.RectStir(this.diameter, t.h - 2 * as, t.wb - 2 * as);
  }
}

class Tendon extends BeamSpaceRebar {
  get count(): number {
    const t = this.struct;
    return this.rebars.mid.pos().length * divideBySpace(-t.l/2, t.l/2, this.space).length;
  }
  get form(): RebarForm {
    const lens = this.rebars.mid.pos().map((p) => Math.abs(p.x) * 2);
    return RebarFormPreset.HookLine(this.diameter, lens, 4);
  }
}
