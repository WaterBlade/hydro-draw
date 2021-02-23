import { DrawItem } from "@/draw";
import { Drawing, MaterialTableFigure, RebarTableFigure } from "../utils";
import { PlatformFigure } from "./PlatformFigure";
import { PlatformRebar } from "./PlatformRebar";
import { PlatformStruct } from "./PlatformStruct";

export class PlatformController {
  struct = new PlatformStruct();
  rebar = new PlatformRebar();
  drawing = new Drawing();
  generate(): DrawItem[] {
    const fig = new PlatformFigure();
    this.rebar.build(this.struct);
    fig.build(this.struct, this.rebar);

    this.drawing.push(
      ...fig.figures,
      new RebarTableFigure(...this.rebar.rebars),
      new MaterialTableFigure(...this.rebar.rebars)
    );

    return this.drawing.generate();
  }
}