import { CompositeRebar } from "@/struct/utils";
import { UShellStruct } from "../../UShellStruct";
import { UShellRebarInfo } from "../Info";
import { TransArc } from "./Arc";
import { TransDirect } from "./Direct";

export class TransContainer extends CompositeRebar<UShellRebarInfo> {
  arc = new TransArc(this.container, this.info);
  direct = new TransDirect(this.container, this.info);
  build(u: UShellStruct, name: string): void {
    this.arc.build(u, name);
    this.direct.build(u, name);
  }
}
