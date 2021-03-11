import {
  divideBySpace,
  RebarForm,
  RebarFormPreset,
  RebarPathForm,
  Side,
} from "@/draw";
import { RebarRoot, SpaceRebar } from "../utils";
import { PlatformStruct } from "./PlatformStruct";

export class PlatformRebar extends RebarRoot {
  as = 0;
  lMain = this.add(new LMain(this.struct, this));
  wMain = this.add(new WMain(this.struct, this));
  lTop = this.add(new LTop(this.struct, this));
  lBot = this.add(new LBot(this.struct, this));
  wTop = this.add(new WTop(this.struct, this));
  wBot = this.add(new WBot(this.struct, this));
  round = this.add(new Round(this.struct, this));
  constructor(protected struct: PlatformStruct) {
    super();
  }
}

export class LMain extends SpaceRebar {
  constructor(
    protected struct: PlatformStruct,
    protected rebars: PlatformRebar
  ) {
    super();
  }
  pos(): number[] {
    const t = this.struct;
    const as = this.rebars.as;
    return divideBySpace(-t.w / 2 + as, t.w / 2 - as, this.space);
  }
  get count(): number {
    return this.pos().length * this.layerCount;
  }
  get form(): RebarForm {
    const t = this.struct;
    const as = this.rebars.as;
    return RebarFormPreset.Line(this.diameter, t.l - 2 * as);
  }
}

export class WMain extends SpaceRebar {
  constructor(
    protected struct: PlatformStruct,
    protected rebars: PlatformRebar
  ) {
    super();
  }
  pos(): number[] {
    const t = this.struct;
    const as = this.rebars.as;
    return divideBySpace(-t.l / 2 + as, t.l / 2 - as, this.space);
  }
  get count(): number {
    return this.pos().length * this.layerCount;
  }
  get form(): RebarForm {
    const t = this.struct;
    const as = this.rebars.as;
    return RebarFormPreset.Line(this.diameter, t.w - 2 * as);
  }
}

export class LTop extends SpaceRebar {
  constructor(
    protected struct: PlatformStruct,
    protected rebars: PlatformRebar
  ) {
    super();
  }
  pos(): number[] {
    const as = this.rebars.as;
    const w = this.lDist;
    return divideBySpace(-w / 2 + as, w / 2 - as, this.space);
  }
  get lRebar(): number {
    return this.struct.l;
  }
  get lDist(): number {
    return this.struct.w;
  }
  get count(): number {
    return this.pos().length;
  }
  get form(): RebarForm {
    const t = this.struct;
    const as = this.rebars.as;
    return RebarFormPreset.UShape(
      this.diameter,
      t.h - t.hs - 2 * as,
      this.lRebar - 2 * as
    );
  }
}

export class LBot extends LTop {
  get form(): RebarForm {
    const as = this.rebars.as;
    return RebarFormPreset.UShape(
      this.diameter,
      10 * this.diameter,
      this.lRebar - 2 * as
    );
  }
  get desp(): string {
    return `与${this.rebars.lTop.id}#焊接`;
  }
}

export class WTop extends LTop {
  get lRebar(): number {
    return this.struct.w;
  }
  get lDist(): number {
    return this.struct.l;
  }
}

export class WBot extends LBot {
  get lRebar(): number {
    return this.struct.w;
  }
  get lDist(): number {
    return this.struct.l;
  }
  get desp(): string {
    return `与${this.rebars.wTop.id}#焊接`;
  }
}

export class Round extends SpaceRebar {
  constructor(
    protected struct: PlatformStruct,
    protected rebars: PlatformRebar
  ) {
    super();
  }
  pos(): number[] {
    const t = this.struct;
    const as = this.rebars.as;
    return divideBySpace(-t.h / 2 + t.hs + as, t.h / 2 - as, this.space).slice(
      1,
      -1
    );
  }
  get count(): number {
    return this.pos().length * 2;
  }
  get form(): RebarForm {
    const t = this.struct;
    const as = this.rebars.as;
    return new RebarPathForm(this.diameter)
      .lineBy(-1.5, 0)
      .dimLength(10 * this.diameter)
      .lineBy(0, -1.5)
      .dimLength(t.w - 2 * as, Side.Right)
      .lineBy(5, 0)
      .dimLength(t.l - 2 * as);
  }
}
