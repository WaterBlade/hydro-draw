import { DrawItem, MaterialTable, RebarTable } from "@/draw";
import { Controller } from "../Controller";
import { EndSectFigure } from "./EndSectFigure";
import { InnerFigure } from "./InnerFigure";
import { MidSectFigure } from "./MidSectFigure";
import { OuterFigure } from "./OuterFigure";
import { UShell } from "./UShell";
import { UShellRebar } from "./UShellRebar";

export class UShellController extends Controller {
  struct = new UShell();
  rebar = new UShellRebar(this.struct);
  generate(): DrawItem[] {
    this.rebar.build();

    const border = this.genBorder("A1");

    border.addItemBuilder(new OuterFigure(this.struct, this.rebar), true);
    border.addItemBuilder(new InnerFigure(this.struct, this.rebar), true);
    border.addItemBuilder(new MidSectFigure(this.struct, this.rebar), true);
    border.addItemBuilder(new EndSectFigure(this.struct, this.rebar), true);

    border.addItem(new RebarTable().push(...this.rebar.specs).generate(), 1, 1);
    border.addItem(
      new MaterialTable().push(...this.rebar.specs).generate(),
      1,
      1
    );

    return border.generate();
  }
}
