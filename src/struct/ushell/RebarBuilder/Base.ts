import { CompositeRebarBuilder, RebarBuilder } from "@/struct/utils/RebarBuilder";
import { UShell } from "../UShell";
import { UShellFigure } from "../UShellFigure";
import { UShellRebar } from "../UShellRebar";

export abstract class RebarBase extends RebarBuilder<
  UShell,
  UShellRebar,
  UShellFigure
> {}
export abstract class CompositeRebarBase extends CompositeRebarBuilder<
  UShell,
  UShellRebar,
  UShellFigure
> {}
