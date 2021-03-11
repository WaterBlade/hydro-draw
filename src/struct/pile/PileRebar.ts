import { divideByCount, divideBySpace, Line, polar, RebarForm, RebarFormPreset, RebarPathForm, Side, StrecthSide, vec } from "@/draw";
import { CountRebar, RebarRoot, SpaceRebar } from "@/struct/utils";
import { PileStruct } from "./PileStruct";

export class PileRebar extends RebarRoot{
  fixCount = 4;
  anchorFactor = 40;
  denseFactor = 5;

  main = this.add(new PileMain(this.struct, this));
  stir = this.add(new PileStir(this.struct, this));
  stirTop = this.add(new PileTopStir(this.struct, this));
  rib = this.add(new PileRib(this.struct, this));
  fix = this.add(new PileFix(this.struct, this));
  constructor(protected struct: PileStruct){super();}
}

export abstract class PileSpaceRebar extends SpaceRebar{
  constructor(protected struct: PileStruct, protected rebars: PileRebar){super();}
}

export abstract class PileCountRebar extends CountRebar{
  constructor(protected struct: PileStruct, protected rebars: PileRebar){super();}
}

class PileFix extends PileSpaceRebar{
  get count(): number{
    return this.pos().length * this.struct.count * this.rebars.fixCount;
  }
  get form(): RebarForm{
    const as = this.rebars.as;
    const len = 1.414 * as;
    return new RebarPathForm(this.diameter)
          .lineBy(1, 0)
          .dimLength(100)
          .lineBy(1, 1)
          .dimLength(len)
          .dimVector(as, as, Side.Right)
          .lineBy(1, 0)
          .dimLength(150)
          .lineBy(1, -1)
          .dimLength(len)
          .lineBy(1, 0)
          .dimLength(100)
  }
  pos(): number[] {
    const t = this.struct;
    const as = this.rebars.as;
    return divideBySpace(0, -t.h + as, this.space).slice(1, -1);
  }
}

class PileMain extends PileCountRebar{
  get count(): number{
    return this.struct.count * this.singleCount;
  }
  get form(): RebarForm{
    const t = this.struct;
    const as = this.rebars.as;
    return new RebarPathForm(this.diameter)
      .lineBy(1.5, 0.8)
      .dimLength(this.diameter * this.rebars.anchorFactor, Side.Right)
      .guideLineBy(-1, 0)
      .dimAngle(t.topAngle)
      .lineBy(4, 0)
      .dimLengthText(`H-${-t.hs + 1000 + as}`)
      .guideLineBy(1, 0)
      .lineBy(1.5, 0.8)
      .dimLength(1000)
      .dimAngle(t.botAngle)
      .setLength(t.h - as + t.hs + this.diameter * this.rebars.anchorFactor)
      .text("桩顶", Side.Left, true)
      .text("桩底", Side.Right, true)
  }
  pos(): number[] {
    const t = this.struct;
    const as = this.rebars.as;
    const n = Math.ceil(this.singleCount / 2) - 1;
    return divideByCount(-t.d / 2 + as, t.d / 2 - as, n);
  }
}

class PileRib extends PileSpaceRebar{
  get count(): number{
    return this.pos().length * this.struct.count;
  }
  get form(): RebarForm{
    const t = this.struct;
    const as = this.rebars.as;
    return RebarFormPreset.Circle(
      this.diameter,
      t.d - 2 * as - 2 * this.rebars.main.diameter
    )
  }
  pos(): number[] {
    const t = this.struct;
    const as = this.rebars.as;
    return divideBySpace(0, -t.h + as, this.space).slice(1, -1);
  }
}

class PileStir extends PileSpaceRebar{
  get count(): number{
    return this.struct.count;
  }
  get form(): RebarForm{
    const t = this.struct;
    const as = this.rebars.as;
    const peri = Math.PI * (t.d - 2 * as);
    const n = this.pos().length;
    const length = Math.sqrt((n * peri) ** 2 + (t.hs + t.h) ** 2);

    return new RebarPathForm(this.diameter)
      .lineBy(0.25, 1.6)
      .lineBy(0.25, -1.6)
      .lineBy(0.25, 1.6)
      .lineBy(0.25, -1.6)
      .lineBy(0.25, 1.6)
      .lineBy(0.25, -1.6)
      .lineBy(0.25, 1.6)
      .lineBy(0.25, -1.6)
      .lineBy(0.25, 1.6)
      .lineBy(0.25, -1.6)
      .text(`D=${t.d - 2 * as}`, Side.Right)
      .setLength(length);
  }
  pos(): number[] {
    const t= this.struct;
    const ln = t.d * this.rebars.denseFactor;
    if (t.h < ln) {
      return divideBySpace(t.hs, -t.h, this.denseSpace, StrecthSide.head);
    } else {
      return divideBySpace(t.hs, -ln, this.denseSpace, StrecthSide.head)
        .slice(0, -1)
        .concat(divideBySpace(-ln, -t.h, this.space, StrecthSide.tail));
    }
  }
}

class PileTopStir extends PileSpaceRebar{
  get count(): number{
    return this.shape().length * this.struct.count;
  }
  get form(): RebarForm{
    return RebarFormPreset.Circle(
      this.diameter,
      this.shape().map((l) => l.calcLength())
    )
  }
  shape(): Line[] {
    const t = this.struct
    const as = this.rebars.as;
    const left = new Line(
      vec(-t.d / 2 + as, t.hs),
      polar(this.rebars.main.diameter * this.rebars.anchorFactor, t.topAngle + 90).add(
        vec(-t.d / 2 + as, t.hs)
      )
    );
    const right = left.mirrorByVAxis();
    const y = left.end.y;
    return new Line(vec(0, t.hs), vec(0, y))
      .divide(this.space)
      .removeBothPt()
      .points.map(
        (p) =>
          new Line(
            left.rayIntersect(p, vec(1, 0))[0],
            right.rayIntersect(p, vec(1, 0))[0]
          )
      );
  }
}