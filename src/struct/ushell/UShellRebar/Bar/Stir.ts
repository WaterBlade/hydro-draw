import { divideBySpace, RebarFormPreset } from "@/draw";
import { SpaceRebar } from "@/struct/utils";
import { UShellStruct } from "../../UShellStruct";
import { UShellRebarInfo } from "../Info";

export class BarStir extends SpaceRebar<UShellRebarInfo>{
  build(u: UShellStruct, name: string): void{
    this.spec = this.genSpec();
    const as = this.info.asBar;
    const pts = u.genBarCenters();
    const xs = this.pos(u);
    this.spec
      .setId(this.container.id)
      .setName(name)
      .setCount(pts.length * xs.length)
      .setForm(
        RebarFormPreset.RectStir(
          this.diameter,
          u.bar.h - 2 * as,
          u.bar.w - 2 * as
        )
      );
    this.container.record(this.spec);
  }
  pos(u: UShellStruct): number[] {
    const x0 = -u.shell.r + u.iBeam.w;
    const x1 = -x0;
    return divideBySpace(x0, x1, this.space).slice(1, -1);
  }
}