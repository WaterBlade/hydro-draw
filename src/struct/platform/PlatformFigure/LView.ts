import { Figure, FigureContent } from "@/struct/utils";
import { PlatformRebar } from "../PlatformRebar";
import { PlatformStruct } from "../PlatformStruct";

export class LView extends Figure{
  initFigure(): void{
    this.fig = new FigureContent();
    this.fig
      .resetScale(1, 40)
      .setTitle("承台立面钢筋图")
      .displayScale()
      .keepTitlePos()
      .centerAligned();
    this.container.record(this.fig);
  }

  build(t: PlatformStruct, rebars: PlatformRebar): void{
    ;
  }
  protected buildOutline(t: PlatformStruct): void{
    ;

  }

}