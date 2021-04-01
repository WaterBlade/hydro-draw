import { divideBySpace, Polyline, RebarForm, RebarFormPreset, RebarPathForm } from "@/draw";
import { RebarRoot, SpaceRebar } from "@/struct/utils";
import { PierSolidStruct } from "./PierSolidStruct";

export class PierSolidRebar extends RebarRoot{
  lMain = this.add(new LMain(this.struct, this));
  wMain = this.add(new WMain(this.struct, this));
  stir = this.add(new Stir(this.struct, this));
  lStir = this.add(new LStir(this.struct, this));
  wStir = this.add(new WStir(this.struct, this));
  constructor(protected struct: PierSolidStruct){super();}
}

abstract class PierSolidSpaceRebar extends SpaceRebar{
  constructor(protected struct: PierSolidStruct, protected rebars: PierSolidRebar){super();}
}

class LMain extends PierSolidSpaceRebar{
  get count(): number{
    return this.pos().length * 2
  }
  get form(): RebarForm{
    const t = this.struct;
    return RebarFormPreset.LShape(
      this.diameter,
      500,
      t.h + t.topBeam.h + t.found.h - 2 * this.rebars.as
    );
  }
  pos(): number[] {
    const t = this.struct;
    return divideBySpace(
      -t.l / 2 + t.fr,
      t.l / 2 - t.fr,
      this.space
    );
  }
}

class WMain extends PierSolidSpaceRebar{
  get count(): number{
    return this.pos().length * 2
  }
  get form(): RebarForm{
    const t = this.struct;
    return RebarFormPreset.LShape(
      this.diameter,
      500,
      t.h + t.topBeam.h + t.found.h - 2 * this.rebars.as
    )
  }
  
  pos(): number[] {
    const t = this.struct;
    return divideBySpace(
      -t.w / 2 + t.fr,
      t.w / 2 - t.fr,
      this.space
    );
  }
}

export class Stir extends PierSolidSpaceRebar {
  get desp(): string{
    return "绑扎连接"
  }
  get count(): number{
    return this.pos().length;
  }
  get form(): RebarForm{
    const lens = this.shape().segments.map((s) => s.calcLength());
    const r = this.struct.fr - this.rebars.as;
    let i = 0;

    return new RebarPathForm(this.diameter)
      .arcBy(0.8, -0.8, 90)
      .dimArc(r)
      .dimLength(lens[i++])
      .lineBy(4, 0)
      .dimLength(lens[i++])
      .arcBy(0.8, 0.8, 90)
      .dimLength(lens[i++])
      .lineBy(0, 1.6)
      .dimLength(lens[i++])
      .arcBy(-0.8, 0.8, 90)
      .dimLength(lens[i++])
      .lineBy(-4, 0)
      .dimLength(lens[i++])
      .arcBy(-0.8, -0.8, 90)
      .dimLength(lens[i++])
      .lineBy(0, -1.6)
      .dimLength(lens[i++])
  }
  pos(): number[] {
    const hs = this.struct.partition();
    const ys: number[] = [];
    let h = this.struct.h;
    for(let i = 0; i < hs.length; i++){
      const l = hs[i];
      ys.push(...divideBySpace(h, h-l, i % 2 === 0 ? this.denseSpace : this.space));
      h -= l;
    }

    return ys;
  }
  shape(): Polyline {
    const t = this.struct;
    const r = t.fr;
    const l = t.l - 2 * r;
    const w = t.w - 2 * r;
    return new Polyline(-t.l / 2, -w / 2)
      .arcBy(r, -r, 90)
      .lineBy(l, 0)
      .arcBy(r, r, 90)
      .lineBy(0, w)
      .arcBy(-r, r, 90)
      .lineBy(-l, 0)
      .arcBy(-r, -r, 90)
      .close()
      .offset(this.rebars.as);
  }
}

export class LStir extends PierSolidSpaceRebar{
  get count(): number{
    const cnt = divideBySpace(50, this.struct.h - 50, this.space).length;
    return Math.floor(((this.rebars.wMain.count/2)-2)/3) * cnt;
  }
  get form(): RebarForm{
    const t = this.struct;
    const rebars = this.rebars;
    return RebarFormPreset.RectStir(this.diameter, 2*rebars.lMain.space, t.w-2*rebars.as);
  }
}

export class WStir extends PierSolidSpaceRebar{
  get count(): number{
    const cnt = divideBySpace(50, this.struct.h - 50, this.space).length;
    return Math.floor(((this.rebars.lMain.count/2)-2)/3) * cnt;
  }
  get form(): RebarForm{
    const t = this.struct;
    const rebars = this.rebars;
    return RebarFormPreset.RectStir(this.diameter, 2*rebars.wMain.space, t.l-2*rebars.as);
  }
}