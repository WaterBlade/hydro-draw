import { Figure } from "@/struct/utils/Figure";
import { CEnd } from "./CEnd";

export class CEndCant extends CEnd {
  protected isExist(): boolean {
    return this.struct.hasCant();
  }
  protected getFigure(): Figure {
    return this.figures.cEndCant;
  }
  protected getTitle(): string {
    if (this.struct.hasOneCant()) {
      return "槽身端肋钢筋图（悬挑侧）";
    } else {
      return "槽身端肋钢筋图";
    }
  }
  protected getInnerGap(): number {
    return 0;
  }
  protected getSectSymbolId(): string{
    return this.struct.isLeftCantFigureExist() ? this.figures.sEndCantWLeft.id : this.figures.sEndCantWRight.id;
  }
}
