import {
  CompositeItem,
  divideByCount,
  divideBySpace,
  Line,
  Polyline,
  vec,
} from "@/draw";
import { ContextBuilder } from "@/draw/preset/Context";
import { BeamRebar } from "./BeamRebar";
import { BeamStruct } from "./BeamStruct";

export class BeamView {
  constructor(
    protected fig: ContextBuilder,
    protected struct: BeamStruct,
    protected rebars: BeamRebar
  ) {}
  generate(): CompositeItem {
    const comp = new CompositeItem();
    this.bot(comp);
    this.top(comp);
    this.mid(comp);
    this.stir(comp);
    this.haunch(comp);
    return comp;
  }
  protected bot(comp: CompositeItem): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const bar = rebars.bot;
    const as = rebars.as;
    const x0 = -t.l / 2 + as;
    const x1 = -x0;
    const x2 = -t.ln / 2 + 4 * fig.h;
    const y = -t.h / 2 + as;
    comp.push(
      fig
        .planeRebar()
        .rebar(new Line(vec(x0, y), vec(x1, y)))
        .spec(bar)
        .leaderNote(vec(x2, -t.h / 2 - 0.5 * fig.h), vec(0, 1))
        .generate()
    );
  }
  protected top(comp: CompositeItem): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const bar = rebars.top;
    const as = rebars.as;
    const x0 = -t.l / 2 + as;
    const x1 = -x0;
    const x2 = t.ln / 2 - 4 * fig.h;
    const y = t.h / 2 - as;
    comp.push(
      fig
        .planeRebar()
        .rebar(new Line(vec(x0, y), vec(x1, y)))
        .spec(bar)
        .leaderNote(vec(x2, t.h / 2 + 0.5 * fig.h), vec(0, 1))
        .generate()
    );
  }
  protected mid(comp: CompositeItem): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const bar = rebars.mid;
    const as = rebars.as;
    const ys = divideByCount(
      -t.h / 2 + as,
      t.h / 2 - as,
      bar.singleCount + 1
    ).slice(1, -1);
    const x0 = -t.l / 2 + as;
    const x1 = -x0;
    const x2 = t.ln / 2 - 4 * fig.h;
    const rebar = fig.planeRebar();
    for (const y of ys) {
      rebar.rebar(new Line(vec(x0, y), vec(x1, y)));
    }
    comp.push(
      rebar
        .spec(bar)
        .count(bar.singleCount)
        .leaderNote(vec(x2, -t.h / 2 - 0.5 * fig.h), vec(0, 1))
        .generate()
    );
  }
  protected stir(comp: CompositeItem): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const bar = rebars.stir;
    const midBar = rebars.mid;
    const as = rebars.as;
    const xs = divideBySpace(-t.ln / 2, t.ln / 2, bar.space).slice(1, -1);
    const y0 = -t.h / 2 + as;
    const y1 = t.h / 2 - as;
    const y2 = t.h / 2 - as - ((t.h - 2 * as) / (midBar.singleCount + 1)) * 0.5;
    const x1 = -t.ln / 2 + 4 * fig.h;

    comp.push(
      fig
        .planeRebar()
        .rebar(...xs.map((x) => new Line(vec(x, y0), vec(x, y1))))
        .spec(bar)
        .count(xs.length)
        .space(bar.space)
        .cross(new Polyline(-t.l / 2, y2).lineTo(t.l / 2, y2))
        .leaderNote(vec(x1, t.h / 2 + 0.5 * fig.h), vec(0, 1))
        .generate()
    );
  }
  protected haunch(comp: CompositeItem): void {
    const rebars = this.rebars;
    const bar = rebars.haunch;
    if (this.struct.botHa) {
      comp.push(
        bar.shapeBot().thickLine(),
        bar.shapeBot().mirrorByVAxis().thickLine()
      );
    }
    if (this.struct.topHa) {
      comp.push(
        bar.shapeTop().thickLine(),
        bar.shapeTop().mirrorByVAxis().thickLine()
      );
    }
  }
}
