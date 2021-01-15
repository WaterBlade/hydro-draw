import { CountRebarSpec, RebarSpec, SpaceRebarSpec } from "@/draw";
import { RebarContainer } from "../utils";

export class FrameSingleRebar extends RebarContainer{
  column = new Column();
  beam = new Beam();
  topBeam = new Beam();
  corbel = new Corbel();
}

class Column{
  corner = new RebarSpec();
  along = new CountRebarSpec();
  cross = new CountRebarSpec();
}

class Beam{
  top = new CountRebarSpec();
  bot = new CountRebarSpec();
  mid = new CountRebarSpec();
}

class Corbel{
  main = new CountRebarSpec();
  v = new SpaceRebarSpec();
  h = new SpaceRebarSpec();
}