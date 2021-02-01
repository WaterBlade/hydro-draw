import { CountRebarSpec, RebarSpec, SpaceRebarSpec } from "@/draw";
import { RebarContainer } from "../../utils";

export class UShellRebar extends RebarContainer {
  shell = new ShellRebar();
  end = new EndRebar();
  trans = new TransRebar();
  bar = new BarRebar();
  denseL = 0;
  as = 0;
  asBar = 0;
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

  bStirCant = new SpaceRebarSpec();
  wStirCant = new SpaceRebarSpec();
  topBeam = new RebarSpec();
  topBeamCant = new RebarSpec();
}

class TransRebar {
  direct = new SpaceRebarSpec();
  arc = new SpaceRebarSpec();
}

class BarRebar {
  stir = new SpaceRebarSpec();
  main = new CountRebarSpec();
}
