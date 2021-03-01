import { CompositeItem, Line, vec } from "@/draw";
import { FigureContent } from "@/struct/utils";
import { TopBeamRebar } from "./TopBeamRebar";
import { TopBeamStruct } from "./TopBeamStruct";

export class TopBeamViewAlong{
  generate(
    fig: FigureContent,
    t: TopBeamStruct,
    rebars: TopBeamRebar,
  ): CompositeItem{
    const comp = new CompositeItem();
    this.stir(fig, comp, t, rebars);
    this.tendon(fig, comp, t, rebars);
    return comp;
  }
  protected stir(
    fig: FigureContent,
    comp: CompositeItem,
    t: TopBeamStruct,
    rebars: TopBeamRebar
  ): void {
    const bar = rebars.stir;
    comp.push(
      fig
        .planeRebar()
        .rebar(bar.shape(t))
        .spec(bar.spec)
        .leaderNote(vec(-t.w/2-fig.h, 0), vec(1, 0))
        .generate()
    );
  }
  protected tendon(
    fig: FigureContent,
    comp: CompositeItem,
    t: TopBeamStruct,
    rebars: TopBeamRebar
  ): void{
    const bar = rebars.tendon;
    const pts = rebars.mid.pos(t);
    comp.push(
      fig.planeRebar()
        .rebar(...pts.map(p => new Line(p, p.mirrorByVAxis())))
        .spec(bar.spec)
        .leaderNote(vec(t.wb/2 - fig.h, t.h/2+2*fig.h), vec(0, 1), vec(1, 0))
        .generate()
    )
  }
}