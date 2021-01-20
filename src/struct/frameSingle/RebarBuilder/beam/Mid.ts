
import { divide, Line, RebarFormPreset, vec } from "@/draw";
import { RebarBase } from "../../Base";

export class Mid extends RebarBase{
  buildSpec(): this{
    const t = this.struct;
    const bar = this.specs.beam.mid;
    const as = this.specs.as;
    const form = RebarFormPreset.Line(bar.diameter, t.w - 2*as);
    bar.setForm(form).setId(this.specs.id.gen()).setStructure(this.name);
    this.specs.record(bar);
    return this;
  }
  buildPos(): this{
    const t = this.struct;
    const as = this.specs.as;
    const bar = this.specs.beam.mid;
    bar.pos.cross.dot(...divide(-t.beam.h/2+as, t.beam.h/2-as, bar.singleCount+1));
    const r = this.figures.sBeam.r
    bar.pos.sBeam.dot(...divide(-t.beam.h/2+as+r, t.beam.h/2-as-r, bar.singleCount+1));
    return this;
  }
  buildFigure(): this{
    this.drawCross();
    this.drawSBeam();
    return this;
  }
  protected drawCross(): void{
    const t = this.struct;
    const fig = this.figures.cross;
    const bar = this.specs.beam.mid;
    const as = this.specs.as;
    const n = t.n;
    const ys = divide(-t.beam.h+as, -as, bar.singleCount+1).slice(1, -1);
    if(n > 0){
      const x0 = -t.w/2+as;
      const x1 = -x0;
      const x2 = t.hsn/2 - 8*fig.h
      let y0 = t.h - t.vs;
      for(let i = 0; i < n; i++){
        const rebar = fig.planeRebar()
        for(const y of ys){
          rebar.rebar( new Line(vec(x0, y0+y), vec(x1, y0+y)));
        }
        fig.push(
          rebar
            .spec(bar, bar.singleCount)
            .leaderNote(vec(x2, y0+2*fig.h), vec(0, 1))
            .generate()
        );
        y0 -= t.vs;
      }
    }
  }
  protected drawSBeam(): void{
    const t = this.struct;
    const fig = this.figures.sBeam;
    const bar = this.specs.beam.mid;
    const as = this.specs.as;
    const left = fig.linePointRebar()
      .line(
        new Line(
          vec(-t.beam.w / 2 + as + fig.r, -t.beam.h / 2 + as + fig.r),
          vec(-t.beam.w / 2 + as + fig.r, t.beam.h / 2 - as - fig.r)
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