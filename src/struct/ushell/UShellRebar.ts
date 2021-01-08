import { CountRebarSpec, RebarSpec, SpaceRebarSpec } from "@/draw";

export class UShellRebar {
  recordRebars: RebarSpec[] = [];
  record(spec: RebarSpec): void{
    this.recordRebars.push(spec);
  }
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
