import { UShellRebarPos } from "./RebarPos";
import { UShellRebarShape } from "./RebarShape";
import { UShellFigure } from "./UShellFigure";
import { UShellRebar } from "./UShellRebar";
import { UShellStruct } from "./UShellStruct";

export class UShell{
  struct = new UShellStruct();
  rebars = new UShellRebar();
  pos = new UShellRebarPos(this.struct, this.rebars);
  shape = new UShellRebarShape(this.struct, this.rebars);
}


export abstract class UShellContext{
  protected struct;
  protected rebars;
  protected pos;
  protected shape;
  constructor(protected context: UShell){
    this.struct = context.struct;
    this.rebars = context.rebars;
    this.pos = context.pos;
    this.shape = context.shape;
  }
}

export abstract class UShellFigureContext extends UShellContext{
  figures;
  constructor(context: UShell, figures?: UShellFigure){
    super(context);
    this.figures = figures ? figures : new UShellFigure();
  }

}