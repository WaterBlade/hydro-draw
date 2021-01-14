import { RebarSpec } from "@/draw";
import { Figure } from "@/struct/Figure";
import { TopBeamBar } from "./TopBeamBar";

export class TopBeamCantBar extends TopBeamBar {
  protected isExist(): boolean {
    return this.struct.iBeam.w > 0 && this.struct.hasCant();
  }
  protected _bar?: RebarSpec;
  protected getFactor(): number {
    if (this.struct.hasTwoCant()) {
      return 4;
    } else {
      return 2;
    }
  }
  protected getFigure(): Figure {
    return this.figures.cEndCant;
  }
  protected getGap(): number {
    return 0;
  }
}
