import { PileFigure } from "./PileFigure";
import { PileRebar } from "./PileRebar";
import { PileStruct } from "./PileStruct";
import { PileRebarPos } from "./RebarPos";
import { PileRebarShape } from "./RebarShape";

export class Pile {
  struct = new PileStruct();
  rebars = new PileRebar();
  pos = new PileRebarPos(this.struct, this.rebars);
  shape = new PileRebarShape(this.struct, this.rebars);
}

export abstract class PileContext{
  protected struct;
  protected rebars;
  protected shape;
  protected pos;
  constructor(protected context: Pile){
    this.struct = context.struct;
    this.rebars = context.rebars;
    this.shape = context.shape;
    this.pos = context.pos;
  }
}

export abstract class PileFigureContext extends PileContext{
  figures;
  constructor(context: Pile, figures?: PileFigure){
    super(context);
    this.figures = figures ? figures : new PileFigure();
  }
}