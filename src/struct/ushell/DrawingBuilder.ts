import { Drawing } from "../Drawing";
import { UShell } from "./UShell";
import { UShellFigure } from "./UShellFigure";

export class DrawingBuilder{
  constructor(protected struct: UShell, protected figures: UShellFigure, protected drawing: Drawing){}
  build(): this{
    const figs = this.figures;
    this.drawing.push(
      figs.lOuter.reset(1, 50)
        .title("槽身跨中钢筋图")
        .displayScale()
        .centerAligned()
        .keepTitlePos(),
      figs.lInner.reset(1, 50)
        .title("槽身纵剖钢筋图")
        .displayScale()
        .centerAligned()
        .keepTitlePos(),
      figs.cMid.reset(1, 50)
        .title("槽身跨中钢筋图")
        .displayScale()
        .centerAligned()
        .keepTitlePos(),
      figs.cEnd.reset(1, 50)
        .title("槽身端肋钢筋图")
        .displayScale()
        .centerAligned()
        .keepTitlePos(),
      figs.sEndBeam.reset(1, 25)
        .title('大样A')
        .displayScale(),
      figs.sEndWall.reset(1, 25)
        .title('Ⅰ--Ⅰ')
        .displayScale(),
      figs.sBar.reset(1, 10)
        .title('大样B')
        .displayScale()
        .centerAligned()
        .keepTitlePos(),
      figs.rTable,
      figs.mTable
    )
    return this;
  }
}