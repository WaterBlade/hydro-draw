import { Figure } from "@/struct/Figure";
import { SEndCantBLeft } from "./SEndCantBLeft";

export class SEndCantBRight extends SEndCantBLeft {
  protected isExist(): boolean {
    return (
      this.struct.cantRight !== 0 &&
      Math.abs(this.struct.cantRight - this.struct.cantLeft) > 1e-6
    );
  }
  protected getFigure(): Figure {
    return this.figures.sEndCantBRight;
  }
  protected getLenCant(): number {
    return this.struct.cantRight;
  }
  protected postProcess(): void {
    this.getFigure().mirror();
  }
}
