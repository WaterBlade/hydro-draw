import { DrawItem } from "@/draw";
import { Drawing } from "../Drawing";
import { DrawingBuilder } from "./DrawingBuilder";
import { NoteBuilder } from "./NoteBuilder";
import { OutlineBuilder } from "./OutlineBuilder";
import { RebarInUShell } from "./rebar";
import { UShell } from "./UShell";
import { UShellFigure } from "./UShellFigure";
import { UShellRebar } from "./UShellRebar";

export class UShellController {
  struct = new UShell();
  rebar = new UShellRebar();
  drawing = new Drawing();
  generate(): DrawItem[] {
    const figure = new UShellFigure();

    new DrawingBuilder(this.struct, figure, this.drawing).build();
    new OutlineBuilder(this.struct, figure).build();
    new RebarInUShell(this.struct, this.rebar, figure).build();
    new NoteBuilder(this.struct, figure).build();

    return this.drawing.generate();
  }
}
