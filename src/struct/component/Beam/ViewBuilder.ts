import { CompositeItem, divideByCount, divideBySpace, Line, Polyline, vec } from "@/draw";
import { Figure } from "@/struct/utils";
import { BeamContext } from "./Beam";

export class BeamViewBuilder extends BeamContext{
  generate(fig: Figure): CompositeItem{
    const comp = new CompositeItem();
    this.bot(fig, comp);
    this.top(fig, comp);
    this.mid(fig, comp);
    this.stir(fig, comp);
    return comp;
  }
  protected bot(fig: Figure, comp: CompositeItem):void{
    const t = this.struct;
    const bar = this.rebars.bot;
    const as = this.rebars.as;
    const x0 = -t.l / 2 + as;
    const x1 = -x0;
    const x2 = t.ln / 2 - 4 * fig.h;
    const y = -t.h/2 + as;
    comp.push(
      fig
        .planeRebar()
        .rebar(new Line(vec(x0, y), vec(x1, y)))
        .spec(bar)
        .leaderNote(vec(x2,  y -as- 2 * fig.h), vec(0, 1))
        .generate()
    );
  }
  protected top(fig: Figure, comp: CompositeItem): void{
    const t = this.struct;
    const bar = this.rebars.top;
    const as = this.rebars.as;
    const x0 = -t.l / 2 + as;
    const x1 = -x0;
    const x2 = t.ln / 2 - 4 * fig.h;
    const y = t.h / 2 - as
    comp.push(
      fig
        .planeRebar()
        .rebar(new Line(vec(x0, y), vec(x1, y)))
        .spec(bar)
        .leaderNote(vec(x2, y + 2 * fig.h), vec(0, 1))
        .generate()
    );
  }
  protected mid(fig: Figure, comp: CompositeItem): void{
    const t = this.struct;
    const bar = this.rebars.mid;
    const as = this.rebars.as;
    const ys = divideByCount(-t.h / 2 + as, t.h / 2 - as, bar.singleCount + 1).slice(
      1,
      -1
    );
    const x0 = -t.l / 2 + as;
    const x1 = -x0;
    const x2 = t.ln / 2 - 8 * fig.h;
    const rebar = fig.planeRebar();
    for (const y of ys) {
      rebar.rebar(new Line(vec(x0, y), vec(x1, y)));
    }
    comp.push(
      rebar
        .spec(bar, bar.singleCount)
        .leaderNote(vec(x2, t.h / 2 + 2 * fig.h), vec(0, 1))
        .generate()
    );
  }
  protected stir(fig: Figure, comp: CompositeItem): void{
    const t = this.struct;
    const bar = this.rebars.stir;
    const midBar = this.rebars.mid;
    const as = this.rebars.as;
    const xs = divideBySpace(-t.ln / 2, t.ln / 2, bar.space).slice(1, -1);
    const y0 = -t.h / 2 + as;
    const y1 = t.h / 2 - as;
    const y2 = t.h / 2 - as - (t.h - 2 * as) / (midBar.singleCount + 1) * 0.5;
    const x1 = -t.ln / 2 + 4 * fig.h;

    comp.push(
      fig
        .planeRebar()
        .rebar(...xs.map((x) => new Line(vec(x, y0), vec(x, y1))))
        .spec(bar, xs.length, bar.space)
        .cross(new Polyline(-t.l / 2, y2).lineTo(t.l / 2, y2))
        .leaderNote(vec(x1, t.h / 2 + 2 * fig.h), vec(0, 1))
        .generate()
    );
  }

}