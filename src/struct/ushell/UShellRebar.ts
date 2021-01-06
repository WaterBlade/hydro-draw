import { CountRebarSpec, RebarSpec, SpaceRebarSpec } from "@/draw";
import { CompositeRebarBuilder, RebarBuilder } from "../RebarBuilder";
import { UShell } from "./UShell";
import { UShellFigure } from "./UShellFigure";

export class UShellRebar {
  shell = new ShellRebar();
  end = new EndRebar();
  trans = new TransRebar();
  bar = new BarRebar();
}

class ShellRebar {
  cInner = new SpaceRebarSpec();
  cInnerSub = new RebarSpec();
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
  cOuter = new CountRebarSpec();
  wStir = new SpaceRebarSpec();
  topBeam = new RebarSpec();
}

class TransRebar{
  direct = new SpaceRebarSpec();
  arc = new SpaceRebarSpec();
}

class BarRebar{
  stir = new SpaceRebarSpec();
  main = new CountRebarSpec();
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
