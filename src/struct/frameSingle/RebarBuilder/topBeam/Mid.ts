import { divideByCount, Line, RebarFormPreset, vec } from "@/draw";
import { RebarBase } from "../../Base";

export class Mid extends RebarBase {
  buildSpec(): this {
    const t = this.struct;
    const bar = this.rebars.topBeam.mid;
    const as = this.rebars.as;
    const form = RebarFormPreset.Line(bar.diameter, t.w - 2 * as);
    bar.setForm(form).setId(this.rebars.id.gen()).setName(this.name);
    this.rebars.record(bar);
    return this;
  }
  buildPos(): this {
    const t = this.struct;
    const as = this.rebars.as;
    const bar = this.rebars.topBeam.mid;
    bar.pos.cross.dot(
      ...divideByCount(
        -t.topBeam.h / 2 + as,
        t.topBeam.h / 2 - as,
        bar.singleCount + 1
      )
    );
    const r = this.figures.sBeam.r;
    bar.pos.sBeam.dot(
      ...divideByCount(
        -t.topBeam.h / 2 + as + r,
        t.topBeam.h / 2 - as - r,
        bar.singleCount + 1
      )
    );
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
    const bar = this.rebars.topBeam.mid;
    const as = this.rebars.as;
    const ys = divideByCount(-t.topBeam.h + as, -as, bar.singleCount + 1).slice(
      1,
      -1
    );
    const x0 = -t.w / 2 + as;
    const x1 = -x0;
    const x2 = t.hsn / 2 - 8 * fig.h;
    const y0 = t.h;
    const rebar = fig.planeRebar();
    for (const y of ys) {
      rebar.rebar(new Line(vec(x0, y0 + y), vec(x1, y0 + y)));
    }
    fig.push(
      rebar
        .spec(bar, bar.singleCount)
        .leaderNote(vec(x2, t.h - t.topBeam.h - 2 * fig.h), vec(0, 1))
        .generate()
    );
  }
  protected drawSTop(): void {
    const t = this.struct;
    const fig = this.figures.sTop;
    const bar = this.rebars.topBeam.mid;
    const as = this.rebars.as;
    const left = fig
      .linePointRebar()
      .line(
        new Line(
          vec(-t.topBeam.w / 2 + as + fig.r, -t.topBeam.h / 2 + as + fig.r),
          vec(-t.topBeam.w / 2 + as + fig.r, t.topBeam.h / 2 - as - fig.r)
        )
          .divideByCount(bar.singleCount + 1)
          .removeBothPt()
      )
      .spec(bar, bar.singleCount)
      .offset(2 * fig.h + as)
      .onlineNote()
      .generate();
    const right = left.mirrorByVAxis();
    fig.push(left, right);
  }
}
