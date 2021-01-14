import { Figure } from "@/struct/utils/Figure";
import { SEndCantWLeft } from "./SEndCantWLeft";

export class SEndCantWRight extends SEndCantWLeft {
  protected isExist(): boolean {
    return (
      this.struct.cantRight > 0 &&
      Math.abs(this.struct.cantRight - this.struct.cantLeft) > 1e-6
    );
  }
  protected getFigure(): Figure {
    return this.figures.sEndCantWRight;
  }
  protected getLenCant(): number {
    return this.struct.cantRight;
  }
  protected postProcess(): void {
    this.getFigure().mirror();
  }
}
