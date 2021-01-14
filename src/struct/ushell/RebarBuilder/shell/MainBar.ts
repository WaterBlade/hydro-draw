import {
  PlaneRebar,
  LayerPointRebar,
  Line,
  LinePointRebar,
  RebarFormPreset,
  vec,
} from "@/draw";
import { Figure } from "@/struct/utils/Figure";
import { RebarBase } from "../Base";

export class MainBar extends RebarBase {
  buildSpec(): this {
    const u = this.struct;
    const bar = this.specs.shell.main;
    const as = this.specs.as;
    bar.setForm(RebarFormPreset.Line(bar.diameter, u.len - 2 * as));
    bar.setId(this.specs.id.gen()).setStructure(this.name);
    this.specs.record(bar);
    return this;
  }
  buildFigure(): this {
    this.drawCMid();
    this.drawLInner();
    this.drawLOuter();
    if (this.struct.isLeftFigureExist()) this.drawSEndBeam(this.figures.sEndBLeft);
    if (this.struct.isRightFigureExist()) this.drawSEndBeam(this.figures.sEndBRight);
    if (this.struct.isLeftCantFigureExist())
      this.drawSEndBeam(this.figures.sEndCantBLeft);
    if (this.struct.isRightCantFigureExist())
      this.drawSEndBeam(this.figures.sEndCantBRight);
    return this;
  }
  protected drawCMid(): void {
    const u = this.struct;
    const bar = this.specs.shell.main;
    const fig = this.figures.cMid;
    const as = this.specs.as;
    const y = u.bottom + as + fig.drawRadius;
    const left = vec(-u.shell.wb / 2, y);
    const right = vec(u.shell.wb / 2, y);
    const pt = vec(0, y - 2 * fig.textHeight);
    if (bar.layerCount > 1) {
      fig.push(
        new LayerPointRebar(fig.textHeight, fig.drawRadius)
          .spec(bar, bar.count)
          .layers(left, right, bar.singleCount, bar.layerSpace, bar.layerCount)
          .onlineNote(pt, vec(1, 0))
          .generate()
      );
    } else {
      fig.push(
        new LinePointRebar(fig.textHeight, fig.drawRadius)
          .spec(bar, bar.count)
          .line(new Line(left, right).divideByCount(bar.count - 1))
          .onlineNote()
          .generate()
      );
    }
  }
  protected drawLInner(): void {
    const u = this.struct;
    const bar = this.specs.shell.main;
    const as = this.specs.as;
    const fig = this.figures.lInner;
    const y = -u.shell.r - u.shell.t - u.shell.hb + as + fig.drawRadius;
    fig.push(
      new PlaneRebar(fig.textHeight)
        .rebar(new Line(vec(-u.len / 2 + as, y), vec(u.len / 2 - as, y)))
        .spec(bar)
        .leaderNote(
          vec(
            u.len / 2 - u.cantRight - this.specs.denseL - 75,
            y - 4 * fig.textHeight
          ),
          vec(0, 1),
          vec(-1, 0)
        )
        .generate()
    );
  }
  protected drawLOuter(): void {
    const u = this.struct;
    const bar = this.specs.shell.main;
    const fig = this.figures.lOuter;
    const as = this.specs.as;
    const y = -u.shell.r - u.shell.t - u.shell.hb + as;
    fig.push(
      new PlaneRebar(fig.textHeight)
        .rebar(new Line(vec(-u.len / 2 + as, y), vec(u.len / 2 - as, y)))
        .spec(bar)
        .leaderNote(
          vec(-u.len / 4, y - 4 * fig.textHeight),
          vec(0, 1),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawSEndBeam(fig: Figure): void {
    const u = this.struct;
    const bar = this.specs.shell.main;
    const as = this.specs.as;
    const left = fig.outline.getBoundingBox().left;
    const right = fig.outline.getBoundingBox().right;
    const y = -u.shell.t - u.shell.hb + as + fig.drawRadius;
    fig.push(
      new PlaneRebar(fig.textHeight)
        .rebar(new Line(vec(left + as, y), vec(right, y)))
        .spec(bar)
        .leaderNote(
          vec(u.endSect.b + 75, 4 * fig.textHeight),
          vec(0, 1),
          vec(1, 0)
        )
        .generate()
    );
  }
}
