import { Line, RebarFormPreset, vec } from "@/draw";
import { RebarBase } from "../../Base";

export class Top extends RebarBase {
  buildSpec(): this {
    const t = this.struct;
    const bar = this.rebars.topBeam.top;
    const as = this.rebars.as;
    const form = RebarFormPreset.UShape(bar.diameter, 500, t.w - 2 * as);
    bar.setForm(form).setId(this.rebars.id.gen()).setName(this.name);
    this.rebars.record(bar);
    return this;
  }
  buildFigure(): this {
    this.drawCross();
    this.drawSTop();
    return this;
  }
  protected drawCross(): void {
    const t = this.struct;
    const fig = this.figures.cross;
    const bar = this.rebars.topBeam.top;
    const as = this.rebars.as;
    const x0 = -t.w / 2 + as;
    const x1 = -x0;
    const x2 = t.hsn / 2 - 4 * fig.h;
    const y = t.h - as;
    fig.push(
      fig
        .planeRebar()
        .rebar(new Line(vec(x0, y), vec(x1, y)))
        .spec(bar)
        .leaderNote(vec(x2, y + 2 * fig.h), vec(0, 1), vec(1, 0))
        .generate()
    );
  }
  protected drawSTop(): void {
    const t = this.struct;
    const fig = this.figures.sTop;
    const bar = this.rebars.topBeam.top;
    const as = this.rebars.as;
    fig.push(
      fig
        .linePointRebar()
        .line(
          new Line(
            vec(-t.topBeam.w / 2 + as + fig.r, t.topBeam.h / 2 - as - fig.r),
            vec(t.topBeam.w / 2 - as - fig.r, t.topBeam.h / 2 - as - fig.r)
          ).divideByCount(bar.singleCount - 1)
        )
        .spec(bar, bar.singleCount)
        .offset(2 * fig.h + as)
        .onlineNote()
        .generate()
    );
  }
}
