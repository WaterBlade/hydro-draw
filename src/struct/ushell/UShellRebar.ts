import { CountRebarSpec, SpaceRebarSpec } from "@/draw";
import { CompositeRebarBuilder, RebarBuilder } from "../RebarBuilder";
import { UShell } from "./UShell";
import { UShellFigure } from "./UShellFigure";

export class UShellRebar {
  shell = new ShellRebar();
  end = new EndRebar();
}

class ShellRebar {
  cInner = new SpaceRebarSpec();
  cOuter = new SpaceRebarSpec();
  lInner = new SpaceRebarSpec();
  lOuter = new SpaceRebarSpec();
  main = new CountRebarSpec();
  topBeam = new SpaceRebarSpec();
}

class EndRebar {
  bTop = new CountRebarSpec();
  bBot = new CountRebarSpec();
  bMid = new CountRebarSpec();
  bStir = new SpaceRebarSpec();
  cInner = new CountRebarSpec();
  cOuter = new CountRebarSpec();
  wStir = new SpaceRebarSpec();
}

export abstract class UShellRebarBuilder extends RebarBuilder<
  UShell,
  UShellRebar,
  UShellFigure
> {}
export abstract class UShellCompositeRebarBuilder extends CompositeRebarBuilder<
  UShell,
  UShellRebar,
  UShellFigure
> {}
