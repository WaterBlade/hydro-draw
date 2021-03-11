import {
  CompositeRebar,
  CountRebar,
  Rebar,
  RebarRoot,
  SpaceRebar,
} from "@/struct/utils";
import { UShellStruct } from "../UShellStruct";

export class UShellRebar extends RebarRoot {
  as = 0;
  asBar = 0;
  denseL = 0;

  shell = this.add(new UShellShellRebar(this.struct, this, "槽壳"));
  end = this.add(new UShellEndRebar(this.struct, this, "端肋"));
  trans = this.add(new UShellTransRebar(this.struct, this, "渐变段"));
  bar = this.add(new UShellBarRebar(this.struct, this, "拉杆"));

  constructor(protected struct: UShellStruct) {
    super();
  }
}

export abstract class UShellUnitRebar extends Rebar {
  constructor(protected struct: UShellStruct, protected rebars: UShellRebar) {
    super();
  }
}

export abstract class UShellSpaceRebar extends SpaceRebar {
  constructor(protected struct: UShellStruct, protected rebars: UShellRebar) {
    super();
  }
}

export abstract class UShellCountRebar extends CountRebar {
  constructor(protected struct: UShellStruct, protected rebars: UShellRebar) {
    super();
  }
}

export abstract class UShellCompositeRebar extends CompositeRebar {
  constructor(
    protected struct: UShellStruct,
    protected rebars: UShellRebar,
    protected name: string
  ) {
    super();
  }
}

import { UShellBarRebar } from "./Bar";
import { UShellEndRebar } from "./End";
import { UShellShellRebar } from "./Shell";
import { UShellTransRebar } from "./Trans";
