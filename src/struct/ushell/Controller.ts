import { DrawItem } from "@/draw";
import { Drawing } from "../Drawing";
import { DrawingBuilder } from "./Builder/DrawingBuilder";
import { DimBuilder } from "./Builder/DimBuilder";
import { OutlineBuilder } from "./Builder/OutlineBuilder";
import { RebarInUShell } from "./Builder/RebarBuilder";
import { UShell } from "./UShell";
import { UShellFigure } from "./UShellFigure";
import { UShellRebarSpec } from "./UShellRebar";
import { RebarDrawBuilder } from "./Builder/RebarDrawBuilder";

export class UShellController {
  struct = new UShell();
  rebar = new UShellRebarSpec();
  drawing = new Drawing();
  generate(): DrawItem[] {
    const figure = new UShellFigure();

    new DrawingBuilder(this.struct, figure, this.drawing).build();
    new OutlineBuilder(this.struct, figure).build();
    const rebarEntity =new RebarInUShell(this.struct, this.rebar, figure).build();
    new RebarDrawBuilder(this.struct, rebarEntity, figure).build();
    new DimBuilder(this.struct, figure).build();

    return this.drawing.generate();
  }
}
