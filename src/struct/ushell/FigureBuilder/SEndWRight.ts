import { Figure } from "@/struct/utils/Figure";
import { SEndWLeft } from "./SEndWLeft";

export class SEndWRight extends SEndWLeft {
  protected isExist(): boolean {
    return this.struct.cantLeft !== 0 && this.struct.cantRight === 0;
  }
  protected getFigure(): Figure {
    return this.figures.sEndWRight;
  }
  protected postProcess(): void {
    this.getFigure().mirror();
  }
}
