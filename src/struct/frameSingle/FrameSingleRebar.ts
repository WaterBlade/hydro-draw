import { CountRebarSpec, SpaceRebarSpec, UnitRebarSpec } from "@/draw";
import { CountRebar, PosGen, RebarContainer, SpaceRebar } from "../utils";

export class FrameSingleRebar extends RebarContainer{
  column = new Column();
  beam = new Beam();
  topBeam = new Beam();
  corbel = new Corbel();
  as = 0;
}

class Column{
  corner = new UnitRebarSpec();
  along = new CountRebar({
    along: new PosGen(),
    sCol: new PosGen()
  });
  cross = new CountRebar({
    cross: new PosGen(),
    sCol: new PosGen()
  });
  stir = new SpaceRebar(new PosGen());
}

class Beam{
  top = new CountRebarSpec();
  bot = new CountRebarSpec();
  mid = new CountRebar({
    cross: new PosGen(),
    sBeam: new PosGen()
  });
  stir = new SpaceRebar(new PosGen());
}

class Corbel{
  main = new CountRebarSpec();
  vStir = new SpaceRebarSpec();
  hStir = new SpaceRebarSpec();
}