import { Arc, Line, Polyline, RebarPathForm, Side, vec } from "@/draw";
import { RebarBase } from "../Base";

export class ArcBar extends RebarBase{
  buildSpec(): this{
    const u = this.struct;
    if (u.oBeam.w > 0) {
      const bar = this.specs.trans.arc;
      const lines = this.genShape();
      const count = (2 + (u.cantLeft > 0 ? 1 : 0) + (u.cantRight > 0 ? 1 : 0)) * lines.length;
      const factor = Math.sqrt(u.trans ** 2 + u.oBeam.w ** 2) / u.oBeam.w;
      bar
        .setCount(count)
        .setForm(
          RebarPathForm.Line(bar.diameter, lines.map(l => factor * l.calcLength()))
        ).setId(this.id()).setStructure(this.name);
      
      this.specs.record(bar);
    }
    return this;
  }
  buildPos(): this{
    this.figures.cTrans.pos.xPos = this.genShape().map(l => l.start.x);
    return this;
  }
  buildFigure(): this{
    this.drawCTrans();
    this.drawSEndBeam();
    return this;
  }
  protected genShape(): Line[]{
    const u = this.struct;
    const bar = this.specs.trans.direct;
    const pts = new Arc(vec(0, 0), u.r + u.as, 180, 0).divide(bar.space).removeStartPt().removeEndPt().points;
    const x = u.r + u.t + u.oBeam.w
    const first = u.genEndCOuter().resetStart(vec(-x, 0)).resetEnd(vec(x, 0)).offset(u.as);
    const second = u.genTransCOuter().offset(u.endSect.b * u.oBeam.w / u.trans - u.as, Side.Right);
    return pts.map(p => {
      const p1 = first.rayIntersect(p, p)[0];
      const p2 = second.rayIntersect(p, p)[0];
      const end = p1.sub(p).length() > p2.sub(p).length() ? p2 : p1;
      return new Line(p, end);
    });
  }
  protected drawCTrans(): void{
    const u = this.struct;
    const fig = this.figures.cTrans;
    const bar = this.specs.trans.arc;
    const x = fig.pos.findX(0);
    const lines = this.genShape();
    fig.push(
      fig.planeRebar()
        .spec(bar, lines.length, bar.space)
        .rebar(...lines)
        .cross(new Polyline(-u.r - u.t/2 - u.oBeam.w/2, 0).arcTo(u.r + u.t/2 + u.oBeam.w/2, 0, 180))
        .leaderNote(vec(x, -u.r/2), vec(0, 1), vec(-1, 0))
        .generate(),
    );
  }
  protected drawSEndBeam(): void{
    const u = this.struct;
    const fig = this.figures.sEndBeam;
    const bar = this.specs.trans.arc;
    const d = u.endHeight - u.hd - u.r - u.t - u.butt.h -u.oBeam.w - u.support.h;
    const x0 = u.endSect.b - d * u.trans / u.oBeam.w;
    const y0 = u.hd +u.r -u.endHeight + u.support.h;
    const x1 = u.endSect.b + u.trans + (u.t + u.butt.h) * u.trans/ u.oBeam.w;
    const p = new Polyline(x0 - 1, y0).lineBy(1, 0).lineTo(x1, 0).lineBy(-1, 0).offset(u.as).removeStart().removeEnd();
    fig.push(
      fig.planeRebar()
        .spec(bar)
        .rebar(p)
        .leaderNote(vec(u.endSect.b + u.trans, (-u.t-u.butt.h + y0)/2), vec(1, 0))
        .generate()
    )
  }
}