import {
  divideBySpace,
  Polyline,
  RebarForm,
  RebarFormPreset,
  Side,
} from "@/draw";
import {
  CompositeRebar,
  CountRebar,
  RebarRoot,
  SpaceRebar,
} from "@/struct/utils";
import { BeamStruct } from "./BeamStruct";

export class BeamRebar extends CompositeRebar {
  bot = this.add(new BeamBot(this.struct, this));
  top = this.add(new BeamTop(this.struct, this));
  mid = this.add(new BeamMid(this.struct, this));
  stir = this.add(new Stir(this.struct, this));
  tendon = this.add(new Tendon(this.struct, this));
  haunch = this.add(new Haunch(this.struct, this));
  constructor(
    protected struct: BeamStruct,
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
  constructor(protected struct: BeamStruct, protected rebars: BeamRebar) {
    super();
  }
  isExist(): boolean {
    return this.struct.n > 0;
  }
}

abstract class BeamSpaceRebar extends SpaceRebar {
  constructor(protected struct: BeamStruct, protected rebars: BeamRebar) {
    super();
  }
  isExist(): boolean {
    return this.struct.n > 0;
  }
}

class BeamBot extends BeamCountRebar {
  get count(): number {
    return this.singleCount * this.struct.n;
  }
  get form(): RebarForm {
    return RebarFormPreset.UShape(
      this.diameter,
      500,
      this.struct.l - 2 * this.rebars.as
    );
  }
}

class BeamTop extends BeamCountRebar {
  get count(): number {
    return this.singleCount * this.struct.n;
  }
  get form(): RebarForm {
    return RebarFormPreset.Line(
      this.diameter,
      this.struct.l - 2 * this.rebars.as
    );
  }
}

class BeamMid extends BeamCountRebar {
  get count(): number {
    return this.singleCount * this.struct.n * 2;
  }
  get form(): RebarForm {
    return RebarFormPreset.Line(
      this.diameter,
      this.struct.l - 2 * this.rebars.as
    );
  }
}

class Stir extends BeamSpaceRebar {
  get count(): number {
    const t = this.struct;
    return (
      divideBySpace(-t.ln / 2, t.ln / 2, this.space).slice(1, -1).length * t.n
    );
  }
  get form(): RebarForm {
    const t = this.struct;
    const as = this.rebars.as;
    return RebarFormPreset.RectStir(this.diameter, t.w - 2 * as, t.h - 2 * as);
  }
}

class Tendon extends BeamSpaceRebar {
  get count(): number {
    const t = this.struct;
    const midBar = this.rebars.mid;
    return Math.floor(t.ln / this.space) * t.n * midBar.singleCount;
  }
  get form(): RebarForm {
    const t = this.struct;
    const as = this.rebars.as;
    return RebarFormPreset.HookLine(this.diameter, t.w - 2 * as, 4);
  }
}

class Haunch extends BeamCountRebar {
  isExist(): boolean {
    return this.struct.botHa || this.struct.topHa;
  }
  get count(): number {
    const t = this.struct;
    let count = 0;
    if (t.botHa) {
      count += this.singleCount * 2;
    }
    if (t.topHa) {
      count += this.singleCount * 2;
    }
    return count;
  }
  get form(): RebarForm {
    const len = this.shapeBot().calcLength();
    return RebarFormPreset.Line(this.diameter, len);
  }
  shapeBot(): Polyline {
    const t = this.struct;
    const as = this.rebars.as;
    const w = (t.l - t.ln) / 2;
    return new Polyline(-t.l / 2, -t.h / 2 - t.ha - w + 1)
      .lineBy(0, -1)
      .lineBy(w + t.ha + t.h, w + t.ha + t.h)
      .lineBy(-1, 0)
      .offset(as)
      .removeStart()
      .removeEnd();
  }
  shapeTop(): Polyline {
    const t = this.struct;
    const as = this.rebars.as;
    const w = (t.l - t.ln) / 2;
    return new Polyline(-t.l / 2, t.h / 2 + t.ha + w - 1)
      .lineBy(0, 1)
      .lineBy(w + t.ha + t.h, -w - t.ha - t.h)
      .lineBy(-1, 0)
      .offset(as, Side.Right)
      .removeStart()
      .removeEnd();
  }
}
