import {
  PlaneRebar,
  LayerPointRebar,
  Line,
  LinePointRebar,
  RebarPathForm,
  vec,
} from "@/draw";
import { RebarBase } from "../Base";

export class MainBar extends RebarBase {
  buildSpec(): this {
    const u = this.struct;
    const bar = this.specs.shell.main;
    bar.setForm(RebarPathForm.Line(bar.diameter, u.len - 2 * u.as));
    bar.setId(this.id()).setStructure(this.name);
    this.specs.record(bar);
    return this;
  }
  buildFigure(): this {
    this.drawCMid();
    this.drawLInner();
    this.drawLOuter();
    this.drawSEndBeam();
    return this;
  }
  protected drawCMid(): void {
    const u = this.struct;
    const bar = this.specs.shell.main;
    const fig = this.figures.cMid;
    const y = u.bottom + u.as + fig.drawRadius;
    const left = vec(-u.butt.w / 2, y);
    const right = vec(u.butt.w / 2, y);
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
    const fig = this.figures.lInner;
    const y = -u.r - u.t - u.butt.h + u.as + fig.drawRadius;
    fig.push(
      new PlaneRebar(fig.textHeight)
        .rebar(new Line(vec(-u.len / 2 + u.as, y), vec(u.len / 2 - u.as, y)))
        .spec(bar)
        .leaderNote(
          vec(u.len / 2 - u.cantRight - u.denseL - 75, y - 4 * fig.textHeight),
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
    const y = -u.r - u.t - u.butt.h + u.as;
    fig.push(
      new PlaneRebar(fig.textHeight)
        .rebar(new Line(vec(-u.len / 2 + u.as, y), vec(u.len / 2 - u.as, y)))
        .spec(bar)
        .leaderNote(
          vec(-u.len / 4, y - 4 * fig.textHeight),
          vec(0, 1),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawSEndBeam(): void{
    const u = this.struct;
    const bar = this.specs.shell.main;
    const fig = this.figures.sEndBeam;
    const right = fig.outline.getBoundingBox().right;
    const y = -u.t - u.butt.h + u.as + fig.drawRadius;
    fig.push(
      new PlaneRebar(fig.textHeight)
        .rebar(new Line(vec(u.as, y), vec(right, y)))
        .spec(bar)
        .leaderNote(vec(u.endSect.b + 75, 4*fig.textHeight), vec(0, 1), vec(1, 0))
        .generate()
    )
  }
}
