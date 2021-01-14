import { CompositeFigureBase } from "./Base";
import { CEnd } from "./CEnd";
import { CEndCant } from "./CEndCant";
import { CMid } from "./CMid";
import { CTrans } from "./CTrans";
import { LInner } from "./LInner";
import { LOuter } from "./LOuter";
import { SBar } from "./SBar";
import { SEndBLeft } from "./SEndBLeft";
import { SEndBRight } from "./SEndBRight";
import { SEndCantBLeft } from "./SEndCantBLeft";
import { SEndCantBRight } from "./SEndCantBRight";
import { SEndCantWLeft } from "./SEndCantWLeft";
import { SEndCantWRight } from "./SEndCantWRight";
import { SEndWLeft } from "./SEndWLeft";
import { SEndWRight } from "./SEndWRight";

export class UShellFigureBuilder extends CompositeFigureBase {
  init(): void {
    this.push(
      new LOuter(this.struct, this.specs, this.figures),
      new LInner(this.struct, this.specs, this.figures),
      new CMid(this.struct, this.specs, this.figures),
      new CEnd(this.struct, this.specs, this.figures),
      new CEndCant(this.struct, this.specs, this.figures),
      new CTrans(this.struct, this.specs, this.figures),
      new SEndBLeft(this.struct, this.specs, this.figures),
      new SEndBRight(this.struct, this.specs, this.figures),
      new SEndCantBLeft(this.struct, this.specs, this.figures),
      new SEndCantBRight(this.struct, this.specs, this.figures),
      new SEndWLeft(this.struct, this.specs, this.figures),
      new SEndWRight(this.struct, this.specs, this.figures),
      new SEndCantWLeft(this.struct, this.specs, this.figures),
      new SEndCantWRight(this.struct, this.specs, this.figures),
      new SBar(this.struct, this.specs, this.figures)
    );
  }
}
