import { CompositeItem, Line, vec } from "@/draw";
import { ContextBuilder } from "@/draw/preset/Context";
import { TopBeamRebar } from "./TopBeamRebar";
import { TopBeamStruct } from "./TopBeamStruct";

export class TopBeamViewAlong {
  constructor(
    protected fig: ContextBuilder,
    protected struct: TopBeamStruct,
    protected rebars: TopBeamRebar
  ) {}
  generate(): CompositeItem {
    const comp = new CompositeItem();
    this.stir(comp);
    this.tendon(comp);
    return comp;
  }
  protected stir(comp: CompositeItem): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const bar = rebars.stir;
    comp.push(
      fig
        .planeRebar()
        .rebar(bar.shape())
        .spec(bar)
        .leaderNote(vec(-t.w / 2 - fig.h, 0), vec(1, 0))
        .generate()
    );
  }
  protected tendon(comp: CompositeItem): void {
    const t = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const bar = rebars.tendon;
    const pts = rebars.mid.pos();
    comp.push(
      fig
        .planeRebar()
        .rebar(...pts.map((p) => new Line(p, p.mirrorByVAxis())))
        .spec(bar)
        .leaderNote(
          vec(t.wb / 2 - fig.h, t.h / 2 + 2 * fig.h),
          vec(0, 1),
          vec(1, 0)
        )
        .generate()
    );
  }
}
