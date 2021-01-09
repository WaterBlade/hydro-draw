import { Line, Polyline, RebarPathForm, vec } from "@/draw";
import { RebarBase } from "../Base";

export class DirectBar extends RebarBase{
  buildSpec(): this{
    const u = this.struct;
    if (u.oBeam.w > 0) {
      const bar = this.specs.trans.direct;
      const lines = this.genShape();
      const count = (2 + (u.cantLeft > 0 ? 1 : 0) + (u.cantRight > 0 ? 1 : 0)) * lines.length * 2;
      const factor = Math.sqrt(u.trans ** 2 + u.oBeam.w ** 2) / u.oBeam.w;
      bar
        .setCount(count)
        .setForm(
          RebarPathForm.Line(bar.diameter, factor * (u.t + u.oBeam.w - 2*u.as))
        ).setId(this.id()).setStructure(this.name);
      
      this.specs.record(bar);
    }
    return this;
  }
  buildFigure(): this{
    this.drawCTrans();
    this.drawSEndWall();
    return this;
  }
  protected genShape(): Line[]{
    const u = this.struct;
    const bar = this.specs.trans.direct;
    const x = -u.r - u.t - u.oBeam.w + u.as;
    const top =u.hd -u.oBeam.hd -u.oBeam.hs - u.as;
    const bottom = 0
    const w = u.t + u.oBeam.w - 2*u.as;
    const pts = new Line(vec(x, top), vec(x, bottom)).divide(bar.space).points;
    return pts.map(p => new Line(p, vec(x+w, p.y)));
  }
  protected drawCTrans(): void{
    const u= this.struct;
    const fig = this.figures.cTrans;
    const bar = this.specs.trans.direct;
    const left = this.genShape();
    const right = left.map(l => l.mirrorByYAxis());
    fig.push(
      fig.planeRebar()
        .spec(bar, left.length, bar.space)
        .rebar(...left)
        .leaderNote(vec(-u.r-(u.t+u.oBeam.w)/2, u.hd + 2*fig.h), vec(0, 1), vec(1, 0))
        .generate(),
      fig.planeRebar()
        .spec(bar, left.length, bar.space)
        .rebar(...right)
        .leaderNote(vec(u.r+(u.t+u.oBeam.w)/2, u.hd + 2*fig.h), vec(0, 1), vec(-1, 0))
        .generate(),
    )
  }
  protected drawSEndWall(): void{
    const u= this.struct;
    const fig = this.figures.sEndWall;
    const bar = this.specs.trans.direct;
    const path = new Polyline(u.endSect.b - 1, -u.t -u.oBeam.w);
    path
      .lineBy(1, 0)
      .lineBy(u.trans + u.t * (u.trans / u.oBeam.w), u.oBeam.w + u.t)
      .lineBy(-1, 0)
    
    fig.push(
      fig.planeRebar()
        .spec(bar, 0, bar.space)
        .rebar(path.offset(u.as).removeStart().removeEnd())
        .leaderNote(vec(u.endSect.b +u.trans, -u.t - u.oBeam.w / 2), vec(1, 0))
        .generate()
    )
  }
}