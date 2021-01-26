
import { Line, Polyline, RebarDraw, RebarFormPreset, UnitRebarSpec, vec } from "@/draw";
import { Figure } from "@/struct/utils";
import { Component } from "../Component";
import { Beam, BeamRebar } from "./Beam";

export class Stir extends Component<Beam, BeamRebar>{
  tendon = new UnitRebarSpec();
  buildSpec(beamCount: number): void{
    const t = this.struct;
    const bar = this.specs.stir;
    const as = this.specs.as;
    const form = RebarFormPreset.RectStir(
      bar.diameter, t.w - 2* as, t.h - 2*as 
    );
    const count = this.genMulPos().length * beamCount;
    bar.setCount(count).setForm(form).setId(this.specs.id.gen()).setStructure(this.name);
    this.specs.record(bar);

    const tendonBar = this.tendon;
    tendonBar.set(bar.grade, 8)
    tendonBar.setForm(RebarFormPreset.HookLine(tendonBar.diameter, t.w-2*as, 4))
    tendonBar.setCount(Math.floor(t.ln/200) * beamCount).setId(this.specs.id.gen()).setStructure(this.name);
    this.specs.record(tendonBar);
  }
  buildPos(): this{
    this.specs.stir.pos.dot(...this.genMulPos());
    return this;
  }
  protected genMulPos(): number[]{
    const t = this.struct;
    const d = 50;
    return new Line(vec(-t.ln/2+d, 0), vec(t.ln/2-d, 0)).divide(this.specs.stir.space).points.map(p=>p.x);
  }

  drawView(fig: Figure, y0: number, x0=0): void{
    const t = this.struct;
    const bar = this.specs.stir;
    const midBar = this.specs.mid;
    const as = this.specs.as;
    const xs = this.genMulPos();
    const y1 = as - t.h / 2 + midBar.pos.view.tail + y0;
    const x1 = bar.pos.find(-t.ln / 2 + t.ha + 2 * fig.h);

    fig.push(
      fig.planeRebar()
        .rebar(...xs.map(x => new Line(vec(x+x0, y0-t.h/2 +as), vec(x+x0, y0 +t.h/2-as))))
        .spec(bar, xs.length, bar.space)
        .cross(new Polyline(-t.l / 2+x0, y1).lineTo(t.l / 2+x0, y1))
        .leaderNote(vec(x1, y0+t.h/2 + 2 * fig.h), vec(0, 1))
        .generate(),
    );
  }
  drawSect(fig: Figure): void{
    const t = this.struct;
    const bar = this.specs.stir;
    const as = this.specs.as;
    const y = this.specs.mid.pos.sect.tail;
    fig.push(
      fig.planeRebar()
        .rebar(RebarDraw.stir(t.h-2*as, t.w-2*as, fig.r))
        .spec(bar)
        .leaderNote(vec(-t.w/2-2*fig.h, y), vec(1, 0))
        .generate(),
    );
    const ys = this.specs.mid.pos.sect.dots.slice(1, -1);
    const rebar = fig.planeRebar().spec(this.tendon, 0, 200);

    for(const y of ys){
      const l = RebarDraw.hLineHook(t.w-2*as, fig.r);
      l.move(vec(0, y));
      rebar.rebar(l);
    }
    fig.push(
      rebar
        .cross(new Polyline(0, -t.h / 2).lineTo(0, y).lineBy(t.w / 2 + fig.h, 0))
        .note()
        .generate()
    )
  }
}