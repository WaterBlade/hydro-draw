import { Builder, CompositeFigureBuilder, CompositeRebarBuilder, FigureBuilder, RebarBuilder } from "../utils";
import { Pile } from "./Pile";
import { PileFigure } from "./PileFigure";
import { PileRebar } from "./PileRebar";

export abstract class FigureBase extends FigureBuilder<Pile, PileRebar, PileFigure>{}
export abstract class RebarBase extends RebarBuilder<Pile, PileRebar, PileFigure>{}
export abstract class CompositeFigureBase extends CompositeFigureBuilder<Pile, PileRebar, PileFigure>{}
export abstract class CompositeRebarBase extends CompositeRebarBuilder<Pile, PileRebar, PileFigure>{}
export abstract class PileBuilder extends Builder<Pile, PileRebar, PileFigure>{}