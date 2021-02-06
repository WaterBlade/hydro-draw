import { Polyline, RebarPathForm, RebarSpec, Side, toDegree, vec } from "@/draw";
import { CountRebar, UnitRebar } from "@/struct/utils";
import { UShellStruct } from "../../UShellStruct";
import { UShellRebarInfo } from "../Info";

export class EndTopBeam extends UnitRebar<UShellRebarInfo>{
  protected _specCant?: RebarSpec;
  get specCant(): RebarSpec{
    if(!this._specCant) throw Error('spec sub not init');
    return this._specCant;
  }
  set specCant(val: RebarSpec){
    this._specCant = val;
  }
  build(u: UShellStruct, name: string, cOuter: CountRebar): void{
    if (u.cantCount < 2) {
      this.spec = this.genSpec();
      const count = cOuter.singleCount;
      const segs = this.shape(u).segments;
      const angle = 90 + toDegree(Math.asin(u.iBeam.hs / u.iBeam.w));
      let i = 0;
      this.spec
        .setCount((2 - u.cantCount) * count)
        .setId(this.container.id)
        .setName(name)
        .setForm(
          new RebarPathForm(this.diameter)
            .lineBy(0, 1.6)
            .dimLength(40 * this.diameter)
            .lineBy(2.5, 0)
            .dimLength(segs[i++].calcLength())
            .lineBy(0, -1.2)
            .dimLength(segs[i++].calcLength())
            .lineBy(-1.2, -0.8)
            .dimLength(segs[i++].calcLength())
            .dimAngle(angle)
        );
      this.container.record(this.spec);
    }
    if (u.cantCount > 0) {
      this.specCant = this.genSpec();
      const count = cOuter.singleCount;
      const segs = this.shapeCant(u).segments;
      const angle = 90 + toDegree(Math.asin(u.iBeam.hs / u.iBeam.w));
      let i = 0;
      this.specCant
        .setCount((2 - u.cantCount) * count)
        .setId(this.container.id)
        .setName(name)
        .setForm(
          new RebarPathForm(this.diameter)
            .lineBy(0, 1.6)
            .dimLength(40 * this.diameter)
            .lineBy(2.5, 0)
            .dimLength(segs[i++].calcLength())
            .lineBy(0, -1.2)
            .dimLength(segs[i++].calcLength())
            .lineBy(-1.2, -0.8)
            .dimLength(segs[i++].calcLength())
            .dimAngle(angle)
        );

      this.container.record(this.specCant);
    }
  }
  shape(u: UShellStruct): Polyline {
    return this.genTopBeamAndCant(u, u.waterStop.h);
  }
  shapeCant(u: UShellStruct): Polyline {
    return this.genTopBeamAndCant(u, 0);
  }
  protected genTopBeamAndCant(u: UShellStruct, gap: number): Polyline {
    const as = this.info.as;
    const d = vec(-u.iBeam.w, -u.iBeam.hs).unit().mul(150);
    const path = new Polyline(
      -u.shell.r - u.shell.t - u.oBeam.w + as,
      u.shell.hd + gap
    )
      .lineBy(u.oBeam.w + u.shell.t + u.iBeam.w - as, 0)
      .lineTo(-u.shell.r + u.iBeam.w, u.shell.hd - u.iBeam.hd)
      .lineBy(-u.iBeam.w, -u.iBeam.hs)
      .lineBy(0, -1)
      .offset(as + gap, Side.Right)
      .removeEnd();
    path.resetEnd(path.end.add(d));
    return path;
  }

}