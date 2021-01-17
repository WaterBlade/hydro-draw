import { CountRebarSpec, SpaceRebarSpec, UnitRebarSpec } from "@/draw";
import { RebarContainer } from "../utils";

export class FrameSingleRebar extends RebarContainer{
  column = new Column();
  beam = new Beam();
  topBeam = new Beam();
  corbel = new Corbel();
  as = 0;
}

class Column{
  corner = new UnitRebarSpec();
  along = new CountRebarSpec();
  cross = new CountRebarSpec();
  stir = new SpaceRebarSpec();
}

class Beam{
  top = new CountRebarSpec();
  bot = new CountRebarSpec();
  mid = new CountRebarSpec();
  stir = new SpaceRebarSpec();
}

class Corbel{
  main = new CountRebarSpec();
  vStir = new SpaceRebarSpec();
  hStir = new SpaceRebarSpec();
}