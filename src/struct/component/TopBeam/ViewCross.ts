import { CompositeItem, Line, Polyline, vec } from "@/draw";
import { ContextBuilder } from "@/draw/preset/Context";
import { TopBeamRebar } from "./TopBeamRebar";
import { TopBeamStruct } from "./TopBeamStruct";

export class TopBeamViewCross {
  constructor(
    protected fig: ContextBuilder,
    protected struct: TopBeamStruct,
    protected rebars: TopBeamRebar
  ) {}
  generate(): CompositeItem {
    const comp = new CompositeItem();
    this.bot(comp);
    this.top(comp);
    this.mid(comp);
    this.stir(comp);
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
    const ys = bar.pos().map((p) => p.y);
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
        .count(ys.length)
        .leaderNote(vec(x2, -t.h / 2 - 0.5 * fig.h), vec(0, 1))
        .generate()
    );
  }
  protected stir(comp: CompositeItem): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const bar = rebars.stir;
    const as = rebars.as;
    const xs = bar.pos();
    const y0 = -t.h / 2 + as;
    const y1 = t.h / 2 - as;
    const y2 = 0;
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
}
