import { DrawItem } from "@/draw";
import { Controller } from "../Controller";
import { Drawing } from "../RebarBuilder";
import { NoteBuilder } from "./NoteBuilder";
import { OutlineBuilder } from "./OutlineBuilder";
import { RebarInUShell } from "./rebar";
import { UShell } from "./UShell";
import { UShellFigure } from "./UShellFigure";
import { UShellRebar } from "./UShellRebar";

export class UShellController extends Controller {
  struct = new UShell();
  rebar = new UShellRebar();
  figure = new UShellFigure();
  generate(): DrawItem[] {
    new OutlineBuilder(this.struct, this.figure).build();
    new RebarInUShell(this.struct, this.rebar, this.figure)
      .buildRebar()
      .buildFigure();
    new NoteBuilder(this.struct, this.figure).build();

    const draw = new Drawing();
    draw.push(
      this.figure.lOuter,
      this.figure.lInner,
      this.figure.cMid,
      this.figure.cEnd,
      this.figure.rTable,
      this.figure.mTable
    );
    return draw.generate();
  }
}
