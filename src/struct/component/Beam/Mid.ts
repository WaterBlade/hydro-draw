
import { divideByCount, Line, RebarFormPreset, vec } from "@/draw";
import { Figure } from "@/struct/utils";
import { Component } from "../Component";
import { Beam, BeamRebar } from "./Beam";

export class Mid extends Component<Beam, BeamRebar>{
  buildSpec(beamCount: number): void{
    const t = this.struct;
    const bar = this.specs.mid;
    const as = this.specs.as;
    const form = RebarFormPreset.Line(bar.diameter, t.l - 2*as);
    bar.setCount(bar.singleCount * beamCount).setForm(form).setId(this.specs.id.gen()).setStructure(this.name);
    this.specs.record(bar);
  }
  buildPos(fig: Figure): void{
    const t = this.struct;
    const as = this.specs.as;
    const bar = this.specs.mid;
    const r = fig.r;
    bar.pos.sect.dot(...divideByCount(-t.h/2+as+r, t.h/2-as-r, bar.singleCount+1));
    bar.pos.view.dot(...divideByCount(-t.h/2+as, t.h/2-as, bar.singleCount+1));
  }
  drawView(fig: Figure, y0: number, x0=0): void{
    const t = this.struct;
    const bar = this.specs.mid;
    const as = this.specs.as;
    const ys = divideByCount(t.h/2-as, -t.h/2+as, bar.singleCount+1).slice(1, -1);
    const x1 = x0 - t.l / 2 + as;
    const x2 = x0 + t.l / 2 - as;
    const rebar = fig.planeRebar()
    for (const y of ys) {
      rebar.rebar(new Line(vec(x0, y0 + y), vec(x1, y0 + y)));
    }
    fig.push(
      rebar
        .spec(bar, bar.singleCount)
        .leaderNote(vec(x2, y0 + t.h/2 + 2 * fig.h), vec(0, 1))
        .generate()
    );
  }
  drawSect(fig: Figure): void{
    const t = this.struct;
    const bar = this.specs.mid;
    const as = this.specs.as;
    const left = fig.linePointRebar()
      .line(
        new Line(
          vec(-t.w / 2 + as + fig.r, -t.h / 2 + as + fig.r),
          vec(-t.w / 2 + as + fig.r, t.h / 2 - as - fig.r)
        )
          .divideByCount(bar.singleCount + 1).removeBothPt()
      )
      .spec(bar, bar.singleCount)
      .offset(2 * fig.h + as)
      .onlineNote()
      .generate();
    const right = left.mirrorByVAxis();
    fig.push(left, right);
  }
}