import { UShellRebar } from "../UShellRebar";
import { UShellStruct } from "../UShellStruct";
import { ShapeEnd } from "./ShapeEnd";
import { ShapeShell } from "./ShapeShell";
import { ShapeTrans } from "./ShapeTrans";

export class UShellRebarShape {
  shell = new ShapeShell(this.struct, this.rebars);
  trans = new ShapeTrans(this.struct, this.rebars);
  end = new ShapeEnd(this.struct, this.rebars);
  constructor(protected struct: UShellStruct, protected rebars: UShellRebar) {}
}
