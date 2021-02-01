import {
  CompositeFigureBuilder,
  CompositeRebarBuilder,
  FigureBuilder,
  RebarBuilder,
} from "../utils";
import { FrameSingle } from "./FrameSingle";
import { FrameSingleFigure } from "./FrameSingleFigure";
import { FrameSingleRebar } from "./FrameSingleRebar";

export abstract class FigureBase extends FigureBuilder<
  FrameSingle,
  FrameSingleRebar,
  FrameSingleFigure
> {}
export abstract class RebarBase extends RebarBuilder<
  FrameSingle,
  FrameSingleRebar,
  FrameSingleFigure
> {}
export abstract class CompositeFigureBase extends CompositeFigureBuilder<
  FrameSingle,
  FrameSingleRebar,
  FrameSingleFigure
> {}
export abstract class CompositeRebarBase extends CompositeRebarBuilder<
  FrameSingle,
  FrameSingleRebar,
  FrameSingleFigure
> {}
