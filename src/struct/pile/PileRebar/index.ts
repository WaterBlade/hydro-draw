import { PileStruct } from "../PileStruct";
import { RebarContainer } from "../../utils/Rebar";
import { Main } from "./Main";
import { Stir } from "./Stir";
import { StirTop } from "./StirTop";
import { Fix } from "./Fix";
import { Rib } from "./Rib";
import { PileRebarInfo } from "./Info";

export class PileRebar extends RebarContainer {
  info = new PileRebarInfo();
  main = new Main(this, this.info);
  stir = new Stir(this, this.info);
  stirTop = new StirTop(this, this.info);
  fix = new Fix(this, this.info);
  rib = new Rib(this, this.info);

  build(t: PileStruct): this {
    this.main.build(t);
    this.stir.build(t);
    this.stirTop.build(t, this.main);
    this.fix.build(t);
    this.rib.build(t, this.main);
    return this;
  }
}
