import { Polyline, RebarPathForm, Side, toDegree } from "@/draw";
import { CountRebar } from "@/struct/utils";
import { UShellStruct } from "../../UShellStruct";
import { UShellRebarInfo } from "../Info";

export class EndCOuter extends CountRebar<UShellRebarInfo>{
  build(u: UShellStruct, name: string): void{
    this.spec = this.genSpec();
    const path = this.shape(u);
    const lens = path.segments.map((s) => s.calcLength());
    let i = 0;
    const angle = 180 - toDegree(Math.atan(u.endSect.w / u.endSect.hs));
    this.spec
      .setForm(
        new RebarPathForm(this.diameter)
          .lineBy(0, -1.5)
          .dimLength(lens[i++], Side.Right)
          .lineBy(0.75, -1.5)
          .dimLength(lens[i++], Side.Right)
          .dimAngle(angle)
          .lineBy(1, 0)
          .dimLength(lens[i++])
          .lineBy(0.5, 0.5)
          .dimLength(500, Side.Right)
      )
      .setCount(this.singleCount * 4)
      .setId(this.container.id)
      .setName(name);
    this.container.record(this.spec);
  }
  shape(u: UShellStruct, offDist?: number): Polyline {
    const as = this.info.as;
    const dist = offDist ? offDist : as;
    const path = new Polyline(
      -u.shell.r - u.shell.t - u.oBeam.w + 1,
      u.shell.hd
    )
      .lineBy(-1, 0)
      .lineBy(0, -u.endSect.hd)
      .lineBy(u.endSect.w, -u.endSect.hs)
      .lineBy(u.support.w > 0 ? u.support.w : 500, 0)
      .lineBy(500, 500)
      .offset(dist)
      .removeStart();
    return path;
  }

}