import { FigureContainer } from "@/struct/utils";
import { PlatformRebar } from "../PlatformRebar";
import { PlatformStruct } from "../PlatformStruct";
import { LView } from "./LView";
import { WView } from "./WView";
import { WSect } from "./WSect";
import { LSect } from "./LSect";

export class PlatformFigure extends FigureContainer{
  lView = new LView(this);
  wView = new WView(this);
  lSect = new LSect(this);
  wSect = new WSect(this);

  build(t: PlatformStruct, rebars: PlatformRebar): void{
    this.lView.initFigure();
    this.wView.initFigure();
    this.lSect.initFigure();
    this.wSect.initFigure();

    this.lView.build(t, rebars, this.wSect.fig);
    this.wView.build(t, rebars, this.lSect.fig);
    this.lSect.build(t, rebars);
    this.wSect.build(t, rebars);
  }
}