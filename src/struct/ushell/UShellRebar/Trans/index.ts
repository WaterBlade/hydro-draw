import { UShellCompositeRebar } from "../UShellRebar";
import { TransArc } from "./Arc";
import { TransDirect } from "./Direct";

export class UShellTransRebar extends UShellCompositeRebar {
  arc = this.add(new TransArc(this.struct, this.rebars));
  direct = this.add(new TransDirect(this.struct, this.rebars));
}
