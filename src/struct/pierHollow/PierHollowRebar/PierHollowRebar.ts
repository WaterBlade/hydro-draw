import {RebarRoot, SpaceRebar} from "@/struct/utils";
import { PierHollowStruct } from "../PierHollowStruct";

export class PierHollowRebar extends RebarRoot{
  lMain = this.add(new LMain(this.struct, this));
  wMain = this.add(new WMain(this.struct, this));
  inner = this.add(new Inner(this.struct, this));
  stir = this.add(new Stir(this.struct, this));
  lStir = this.add(new LStir(this.struct, this));
  wStir = this.add(new WStir(this.struct, this));
  sectHa = this.add(new SectHaunch(this.struct, this));
  plateLHa = this.add(new PlateLHaunch(this.struct, this));
  plateWHa = this.add(new PlateWHaunch(this.struct, this));
  plateLMain = this.add(new PlateLMain(this.struct, this));
  plateWMain = this.add(new PlateWMain(this.struct, this));
  plateLDist = this.add(new PlateLDist(this.struct, this));
  plateWDist = this.add(new PlateWDist(this.struct, this));
  constructor(protected struct: PierHollowStruct){super();}
}

export abstract class PierHollowSpaceRebar extends SpaceRebar{
  constructor(protected struct: PierHollowStruct, protected rebars: PierHollowRebar){super();}
}

import { LMain, WMain } from "./Main";
import { Inner } from "./Inner";
import { LStir, Stir, WStir } from "./Stir";
import { PlateLHaunch, PlateWHaunch, SectHaunch } from "./Haunch";
import { PlateLDist, PlateLMain, PlateWDist, PlateWMain } from "./Plate";

