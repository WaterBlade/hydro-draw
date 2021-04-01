import { divideBySpace, RebarForm, RebarFormPreset } from "@/draw";
import { RebarRoot, SpaceRebar } from "../utils";
import { FoundStruct } from "./FoundStruct";

export class FoundRebar extends RebarRoot{
  lTop = this.add(new LTop(this.struct, this));
  wTop = this.add(new WTop(this.struct, this));
  lBot = this.add(new LBot(this.struct, this));
  wBot = this.add(new WBot(this.struct, this));

  constructor(protected struct: FoundStruct){super();}

}

abstract class FoundSpaceRebar extends SpaceRebar{
  constructor(protected struct: FoundStruct, protected rebars: FoundRebar){super();}
}

export class LTop extends FoundSpaceRebar{
  get count(): number{
    return this.pos().length;
  }
  get form(): RebarForm{
    const t = this.struct;
    return RebarFormPreset.Line(this.diameter, t.lTop - 2*this.rebars.as);
  }
  pos(): number[]{
    const t = this.struct;
    const as = this.rebars.as;
    return divideBySpace(-t.wTop/2+as, t.wTop/2-as, this.space);
  }
}

export class WTop extends FoundSpaceRebar{
  get count(): number{
    return this.pos().length;
  }
  get form(): RebarForm{
    const t = this.struct;
    return RebarFormPreset.Line(this.diameter, t.wTop - 2*this.rebars.as);
  }
  pos(): number[]{
    const t = this.struct;
    const as = this.rebars.as;
    return divideBySpace(-t.lTop/2+as, t.lTop/2-as, this.space);
  }
}

export class LBot extends FoundSpaceRebar{
  get count(): number{
    return this.pos().length;
  }
  get form(): RebarForm{
    const t = this.struct;
    return RebarFormPreset.Line(this.diameter, t.lBot - 2*this.rebars.as);
  }
  pos(): number[]{
    const t = this.struct;
    const as = this.rebars.as;
    return divideBySpace(-t.wBot/2+as, t.wBot/2-as, this.space);
  }
}

export class WBot extends FoundSpaceRebar{
  get count(): number{
    return this.pos().length;
  }
  get form(): RebarForm{
    const t = this.struct;
    return RebarFormPreset.Line(this.diameter, t.wBot - 2*this.rebars.as);
  }
  pos(): number[]{
    const t = this.struct;
    const as = this.rebars.as;
    return divideBySpace(-t.lBot/2+as, t.lBot/2-as, this.space);
  }
}