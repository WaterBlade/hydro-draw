import { Line, RebarFormPreset, Side, vec } from "@/draw";
import { RebarBase } from "../../Base";

export class Bottom extends RebarBase{
  buildSpec(): this{
    const t = this.struct;
    const bar = this.specs.beam.bot;
    const as = this.specs.as;
    const form = RebarFormPreset.UShape(bar.diameter, 500, t.w - 2*as);
    bar.setForm(form).setId(this.specs.id.gen()).setStructure(this.name);
    this.specs.record(bar);
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
    const bar = this.specs.beam.bot;
    const as = this.specs.as;
    const n = t.n;
    if(n > 0){
      const x0 = -t.w/2+as;
      const x1 = -x0;
      const x2 = t.hsn/2 - 4*fig.h
      let y = t.h - t.vs - t.beam.h + as;
      for(let i = 0; i < n; i++){
        fig.push(
          fig.planeRebar()
            .rebar( new Line(vec(x0, y), vec(x1, y)))
            .spec(bar)
            .leaderNote(vec(x2, y-2*fig.h), vec(0, 1))
            .generate()
        );
        y -= t.vs;
      }
    }
  }
  protected drawSBeam(): void{
    const t = this.struct;
    const fig = this.figures.sBeam;
    const bar = this.specs.beam.bot;
    const as = this.specs.as;
    fig.push(
      fig.linePointRebar()
        .line(
          new Line(
            vec(-t.beam.w / 2 + as + fig.r, -t.beam.h / 2 + as + fig.r),
            vec(t.beam.w / 2 - as - fig.r, -t.beam.h / 2 + as + fig.r)
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