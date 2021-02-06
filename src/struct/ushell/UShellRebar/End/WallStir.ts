import { Line, RebarFormPreset, RebarSpec, Side, vec } from "@/draw";
import { SpaceRebar } from "@/struct/utils";
import { UShellStruct } from "../../UShellStruct";
import { UShellRebarInfo } from "../Info";

export class EndWallStir extends SpaceRebar<UShellRebarInfo>{
  protected _specCant?: RebarSpec;
  get specCant(): RebarSpec{
    if(!this._specCant) throw Error('spec sub not init');
    return this._specCant;
  }
  set specCant(val: RebarSpec){
    this._specCant = val;
  }
  build(u: UShellStruct, name: string): void{
    if (u.cantCount < 2) {
      this.spec = this.genSpec();
      const as = this.info.as;
      const lens = this.shape(u).map((l) => l.calcLength());
      this.spec
        .setForm(
          RebarFormPreset.RectStir(this.diameter, u.endSect.b - 2 * as, lens)
        )
        .setCount(lens.length * (2 - u.cantCount))
        .setId(this.container.id)
        .setName(name);
      this.container.record(this.spec);
    }
    if (u.cantCount > 0) {
      this.specCant = this.genSpec();
      const as = this.info.as;
      const lens = this.shapeCant(u).map((l) => l.calcLength());
      this.specCant
        .setForm(
          RebarFormPreset.RectStir(this.diameter, u.endSect.b - 2 * as, lens)
        )
        .setCount(lens.length * (2 - u.cantCount))
        .setId(this.container.id)
        .setName(name);
      this.container.record(this.specCant);
    }
  }
  shape(u: UShellStruct): Line[] {
    return this.genWStirAndCant(u, u.waterStop.h);
  }
  shapeCant(u: UShellStruct): Line[] {
    return this.genWStirAndCant(u, 0);
  }
  protected genWStirAndCant(u: UShellStruct, gap: number): Line[] {
    const as = this.info.as;
    const y0 = u.shell.hd - as;
    const y1 = -u.shell.r - gap - as;
    const leftEdge = u.genEndCOuterLeft().offset(as);
    const rightEdge = u.genEndCInnerLeft().offset(gap + as, Side.Right);

    const pts = new Line(vec(0, y0), vec(0, y1)).divide(this.space).removeEndPt()
      .points;
    return pts.map(
      (p) =>
        new Line(
          leftEdge.rayIntersect(p, vec(1, 0))[0],
          rightEdge.rayIntersect(p, vec(1, 0))[0]
        )
    );
  }

}