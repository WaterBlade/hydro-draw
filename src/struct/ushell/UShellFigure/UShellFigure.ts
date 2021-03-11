import { Figure, FigureRoot, SectFigure, SpecFigure } from "@/struct/utils";
import { UShellRebar } from "../UShellRebar";
import { UShellStruct } from "../UShellStruct";

export class UShellFigure extends FigureRoot {
  constructor(protected struct: UShellStruct, protected rebars: UShellRebar) {
    super();
  }

  lOuter = this.add(new LOuter(this.struct, this.rebars, this));
  lInner = this.add(new LInner(this.struct, this.rebars, this));

  cMid = this.add(new CMid(this.struct, this.rebars, this));
  cEnd = this.add(new CEnd(this.struct, this.rebars, this));
  cEndCant = this.add(new CEndCant(this.struct, this.rebars, this));
  cTrans = this.add(new CTrans(this.struct, this.rebars, this));

  sEndBeamLeft = this.add(new SEndBeamLeft(this.struct, this.rebars, this));
  sEndBeamRight = this.add(new SEndBeamRight(this.struct, this.rebars, this));
  sEndWallLeft = this.add(new SEndWallLeft(this.struct, this.rebars, this));
  sEndWallRight = this.add(new SEndWallRight(this.struct, this.rebars, this));
  sBar = this.add(new SBar(this.struct, this.rebars, this));
}

export abstract class UShellBasicFigure extends Figure {
  constructor(
    protected struct: UShellStruct,
    protected rebars: UShellRebar,
    protected figures: UShellFigure
  ) {
    super();
  }
}

export abstract class UShellSectFigure extends SectFigure {
  constructor(
    protected struct: UShellStruct,
    protected rebars: UShellRebar,
    protected figures: UShellFigure
  ) {
    super();
  }
}

export abstract class UShellSpecFigure extends SpecFigure {
  constructor(
    protected struct: UShellStruct,
    protected rebars: UShellRebar,
    protected figures: UShellFigure
  ) {
    super();
  }
}

import { SBar } from "./SBar";
import { SEndWallLeft, SEndWallRight } from "./SEndWall";
import { SEndBeamLeft, SEndBeamRight } from "./SEndBeam";
import { CTrans } from "./CTrans";
import { CEnd, CEndCant } from "./CEnd";
import { CMid } from "./CMid";
import { LInner } from "./LInner";
import { LOuter } from "./LOuter";
