import { Figure } from "@/struct/utils/Figure";
import { SEndBLeft } from "./SEndBLeft";

export class SEndBRight extends SEndBLeft {
  protected isExist(): boolean {
    return this.struct.cantLeft !== 0 && this.struct.cantRight === 0;
  }
  protected getFigure(): Figure {
    return this.figures.sEndBRight;
  }
  protected postProcess(): void {
    this.getFigure().mirror();
  }
}
