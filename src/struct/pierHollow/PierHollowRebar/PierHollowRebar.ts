import {RebarRoot, SpaceRebar} from "@/struct/utils";
import { PierHollowStruct } from "../PierHollowStruct";

export class PierHollowRebar extends RebarRoot{
  lMain = this.add(new LMain(this.struct, this));
  wMain = this.add(new WMain(this.struct, this));
  inner = this.add(new Inner(this.struct, this));
  stir = this.add(new Stir(this.struct, this));
  lStir = this.add(new LStir(this.struct, this));
  wStir = this.add(new WStir(this.struct, this));
  hHa = this.add(new HHuanch(this.struct, this));
  constructor(protected struct: PierHollowStruct){super();}
}

export abstract class PierHollowSpaceRebar extends SpaceRebar{
  constructor(protected struct: PierHollowStruct, protected rebars: PierHollowRebar){super();}
}

import { LMain, WMain } from "./Main";
import { Inner } from "./Inner";
import { LStir, Stir, WStir } from "./Stir";import { HHuanch } from "./Haunch";

