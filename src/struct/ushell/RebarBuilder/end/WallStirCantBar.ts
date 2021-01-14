import { SpaceRebarSpec, vec, Vector } from "@/draw";
import { Figure } from "@/struct/Figure";
import { WallStirBar } from "./WallStirBar";

export class WallStirCantBar extends WallStirBar {
  protected isExist(): boolean {
    return this.struct.hasCant();
  }
  protected isLeftExist(): boolean {
    return this.struct.isLeftCantExist();
  }
  protected isRightExist(): boolean {
    return this.struct.isRightCantExist();
  }
  protected getEndFigure(): Figure {
    return this.figures.cEndCant;
  }
  protected getLeftFigure(): Figure {
    return this.figures.sEndCantWLeft;
  }
  protected getRightFigure(): Figure {
    return this.figures.sEndCantWRight;
  }
  protected _bar?: SpaceRebarSpec;
  protected getBar(): SpaceRebarSpec {
    if (this._bar) {
      return this._bar;
    } else {
      const parent = this.specs.end.wStir;
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
      return 4;
    } else {
      return 2;
    }
  }
  protected getWallNotePos(fig: Figure): Vector {
    const u = this.struct;
    const as = this.specs.as;
    const y = -u.oBeam.w - u.shell.t + as + fig.h;
    return vec(-u.lenTrans, y);
  }
}
