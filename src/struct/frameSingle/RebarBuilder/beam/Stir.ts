
import { Line, Polyline, RebarDraw, RebarFormPreset, UnitRebarSpec, vec } from "@/draw";
import { RebarBase } from "../../Base";

export class Stir extends RebarBase{
  tendon = new UnitRebarSpec();
  buildSpec(): this{
    const t = this.struct;
    const bar = this.specs.beam.stir;
    const as = this.specs.as;
    const form = RebarFormPreset.RectStir(
      bar.diameter, t.topBeam.w - 2* as, t.topBeam.h - 2*as 
    );
    const count = this.genMulPos().length * t.n;
    bar.setCount(count).setForm(form).setId(this.specs.id.gen()).setStructure(this.name);
    this.specs.record(bar);
    this.buildTendonSpec();
    return this;
  }
  protected buildTendonSpec(): void{
    const t = this.struct;
    const bar = this.tendon;
    const preBar = this.specs.beam.stir;
    const as = this.specs.as;
    bar.set(preBar.grade, 8)
    bar.setForm(RebarFormPreset.HookLine(bar.diameter, t.beam.w-2*as, 4))
    bar.setCount(Math.floor(t.hsn/200) * t.n).setId(this.specs.id.gen()).setStructure(this.name);
    this.specs.record(bar);
  }
  buildPos(): this{
    this.specs.beam.stir.pos.dot(...this.genMulPos());
    return this;
  }
  protected genMulPos(): number[]{
    const t = this.struct;
    const d = 50;
    return new Line(vec(-t.hsn/2+d, 0), vec(t.hsn/2-d, 0)).divide(this.specs.beam.stir.space).points.map(p=>p.x);
  }
  buildFigure(): this{
    this.drawCross();
    this.drawSBeam();
    return this;
  }
  protected drawCross(): void{
    const t = this.struct;
    const fig = this.figures.cross;
    const bar = this.specs.beam.stir;
    const midBar = this.specs.beam.mid;
    const as = this.specs.as;
    const n = t.n;
    if(n > 0){
      const xs = this.genMulPos();
      let y = t.h - t.vs - as;
      const d = t.beam.h - 2*as;
      let y1 = as -t.beam.h/2 + midBar.pos.cross.tail + y;
      const x1 = bar.pos.find(-t.hsn/2+t.beam.ha+2*fig.h);
      
      for(let i = 0; i < n; i++){
        fig.push(
          fig.planeRebar()
            .rebar(...xs.map(x => new Line(vec(x, y), vec(x, y-d))))
            .spec(bar, xs.length, bar.space)
            .cross(new Polyline(-t.w/2, y1).lineTo(t.w/2, y1))
            .leaderNote(vec(x1, y+2*fig.h), vec(0, 1))
            .generate(),
        );
        y1 -= t.vs;
        y -= t.vs;
      }
    }
  }
  protected drawSBeam(): void{
    const t = this.struct;
    const fig = this.figures.sBeam;
    const bar = this.specs.beam.stir;
    const as = this.specs.as;
    const y = this.specs.beam.mid.pos.sBeam.tail;
    fig.push(
      fig.planeRebar()
        .rebar(RebarDraw.stir(t.beam.h-2*as, t.beam.w-2*as, fig.r))
        .spec(bar)
        .leaderNote(vec(-t.beam.w/2-2*fig.h, y), vec(1, 0))
        .generate(),
    );
    const ys = this.specs.beam.mid.pos.sBeam.dots.slice(1, -1);
    const rebar = fig.planeRebar().spec(this.tendon, 0, 200);

    for(const y of ys){
      const l = RebarDraw.hLineHook(t.beam.w-2*as, fig.r);
      l.move(vec(0, y));
      rebar.rebar(l);
    }
    fig.push(
      rebar
        .cross(new Polyline(0, -t.beam.h / 2).lineTo(0, y).lineBy(t.beam.w / 2 + fig.h, 0))
        .note()
        .generate()
    )
  }
}