import { DrawItem } from "@/draw";
import { Drawing, MaterialTableFigure, RebarTableFigure } from "../utils";
import { PlatformRebar } from "./PlatformRebar";
import { PlatformStruct } from "./PlatformStruct";

export class PlatformController {
  struct = new PlatformStruct();
  rebar = new PlatformRebar();
  drawing = new Drawing();
  generate(): DrawItem[] {
    this.rebar.build(this.struct);

    this.drawing.push(
      new RebarTableFigure(...this.rebar.rebars),
      new MaterialTableFigure(...this.rebar.rebars)
    );

    return this.drawing.generate();
  }
}