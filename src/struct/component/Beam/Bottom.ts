import { Line, RebarFormPreset, Side, vec } from "@/draw";
import { Figure } from "@/struct/utils";
import { Component } from "../Component";
import { Beam, BeamRebar } from "./Beam";

export class Bottom extends Component<Beam, BeamRebar>{
  buildSpec(beamCount: number): void{
    const t = this.struct;
    const bar = this.specs.bot;
    const as = this.specs.as;
    const form = RebarFormPreset.UShape(bar.diameter, 500, t.l - 2*as);
    bar.setCount(bar.singleCount * beamCount).setForm(form).setId(this.specs.id.gen()).setStructure(this.name);
    this.specs.record(bar);
  }
  drawView(fig: Figure, y0: number, x0=0): void{
    const t = this.struct;
    const bar = this.specs.bot;
    const as = this.specs.as;
    const x1 = x0 - t.l / 2 + as;
    const x2 = x0 + t.l / 2 - as;
    const y = y0 - t.h/2 + as;
    fig.push(
      fig.planeRebar()
        .rebar(new Line(vec(x1, y), vec(x2, y)))
        .spec(bar)
        .leaderNote(vec(x2, y - 2 * fig.h), vec(0, 1))
        .generate()
    );
  }
  drawSect(fig: Figure): void{
    const t = this.struct;
    const bar = this.specs.bot;
    const as = this.specs.as;
    fig.push(
      fig.linePointRebar()
        .line(
          new Line(
            vec(-t.w / 2 + as + fig.r, -t.h / 2 + as + fig.r),
            vec(t.w / 2 - as - fig.r, -t.h / 2 + as + fig.r)
          )
          .divideByCount(bar.singleCount-1)
        )
        .spec(bar, bar.singleCount)
        .offset(2*fig.h+as, Side.Right) 
        .onlineNote()
        .generate()
    );
  }
 
}