import { SpaceRebarSpec, vec, Vector } from "@/draw";
import { Figure } from "@/struct/utils/Figure";
import { BeamStirBar } from "./BeamStirBar";

export class BeamStirCantBar extends BeamStirBar {
  protected isExist(): boolean {
    return this.struct.hasCant();
  }
  protected isLeftExist(): boolean {
    return this.struct.cantLeft > 0;
  }
  protected isRightExist(): boolean {
    return this.struct.cantRight > 0;
  }
  protected isLeftFigureExist(): boolean {
    return this.struct.isLeftCantFigureExist();
  }
  protected isRightFigureExist(): boolean {
    return this.struct.isRightCantFigureExist();
  }
  protected getEndFigure(): Figure {
    return this.figures.cEndCant;
  }
  protected getLeftFigure(): Figure {
    return this.figures.sEndCantBLeft;
  }
  protected getRightFigure(): Figure {
    return this.figures.sEndCantBRight;
  }
  protected _bar?: SpaceRebarSpec;
  protected getBar(): SpaceRebarSpec {
    if (this._bar) {
      return this._bar;
    } else {
      const parent = this.specs.end.bStir;
      this._bar = new SpaceRebarSpec();
      this._bar.set(parent.grade, parent.diameter, parent.space);
      return this._bar;
    }
  }
  protected getGap(): number {
    return 0;
  }
  protected getFactor(): number {
    if (this.struct.hasTwoCant()) {
      return 2;
    } else {
      return 1;
    }
  }
  protected getSEndBeamPos(fig: Figure): Vector {
    const u = this.struct;
    const as = this.specs.as;
    const y = u.shell.hd + u.shell.r - u.endHeight + u.support.h + as;
    return vec(u.endSect.b + 2 * fig.h, y + fig.h);
  }
}
