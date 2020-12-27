import { CompositeItem, DimensionBuilder, Polyline } from "@/draw";
import { RebarFigure } from "../Figure";
import { UShell } from "./UShell";
import { UShellRebar } from "./UShellRebar";

export class EndSectFigure extends RebarFigure<UShell, UShellRebar> {
  generate(): CompositeItem {
    this.drawScale = 50;

    this.drawOutline();
    this.setTitle("槽身端肋钢筋图", true);
    return this.composite;
  }
  protected drawOutline(): void {
    const u = this.struct;
    const path = new Polyline(-u.r - u.t - u.oBeam.w, u.hd).lineBy(
      u.beamWidth,
      0
    );
    if (u.iBeam.w > 0) {
      path.lineBy(0, -u.iBeam.hd).lineBy(-u.iBeam.w, -u.iBeam.hs);
    }
    path.lineTo(-u.r, 0).arcTo(u.r, 0, 180);
    if (u.iBeam.w > 0) {
      path
        .lineBy(0, u.hd - u.iBeam.hd - u.iBeam.hs)
        .lineBy(-u.iBeam.w, u.iBeam.hs)
        .lineBy(0, u.iBeam.hd);
    } else {
      path.lineBy(0, u.hd);
    }
    path
      .lineBy(u.beamWidth, 0)
      .lineBy(0, -u.endSect.hd)
      .lineBy(-u.endSect.w, -u.endSect.hs);
    if (u.support.w > 0) {
      path.lineBy(-u.support.w, 0).lineBy(-u.support.h, u.support.h);
    }
    const l =
      2 * u.oBeam.w +
      2 * u.r +
      2 * u.t -
      2 * u.endSect.w -
      2 * u.support.w -
      2 * u.support.h;
    path.lineBy(-l, 0);
    if (u.support.w > 0) {
      path.lineBy(-u.support.h, -u.support.h).lineBy(-u.support.w, 0);
    }
    path.lineBy(-u.endSect.w, u.endSect.hs).lineBy(0, u.endSect.hd);

    this.composite.push(path.greyLine());
  }
  protected drawDim(): void {
    const u = this.struct;
    const box = this.composite.getBoundingBox();
    const dim = new DimensionBuilder(this.unitScale, this.drawScale);
    dim.hTop(-u.r - u.t - u.oBeam.w, u.hd + 2 * this.textHeight);
  }
}
