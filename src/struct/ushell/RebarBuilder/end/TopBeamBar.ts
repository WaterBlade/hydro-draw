import { PlaneRebar, Polyline, RebarPathForm, Side, toDegree, vec } from "@/draw";
import { RebarBase } from "../Base";

export class TopBeamBar extends RebarBase{
  protected isExist(): boolean{
    return this.struct.iBeam.w > 0;
  }
  buildSpec(): this{
    if(this.isExist()){
      const u = this.struct;
      const bar = this.specs.end.topBeam;
      const dia = this.specs.shell.topBeam.diameter;
      const grade = this.specs.shell.topBeam.grade;
      const count = this.specs.end.cOuter.singleCount;
      const segs = this.genShape().segments;
      const angle = 90 + toDegree(Math.asin(u.iBeam.hs / u.iBeam.w));
      let i = 0;
      bar
        .setGrade(grade)
        .setDiameter(dia)
        .setCount(4*count)
        .setId(this.id())
        .setStructure(this.name)
        .setForm(
          new RebarPathForm(dia)
            .lineBy(0, 1.6).dimLength(40*dia)
            .lineBy(2.5, 0).dimLength(segs[i++].calcLength())
            .lineBy(0, -1.2).dimLength(segs[i++].calcLength())
            .lineBy(-1.2, -0.8).dimLength(segs[i++].calcLength()).dimAngle(angle)
        )

    this.specs.record(bar);
    }
    return this;
  }
  buildFigure(): this{
    if(this.isExist()){
      this.drawCEnd();
    }
    return this;
  }
  protected genShape(): Polyline{
    const u = this.struct;
    const d = vec(-u.iBeam.w, -u.iBeam.hs).unit().mul(150);
    const path = new Polyline(-u.r - u.t - u.oBeam.w+u.as, u.hd + u.waterStop.h - 1)
      .lineBy(0, 1)
      .lineBy(u.oBeam.w + u.t + u.iBeam.w - u.as, 0)
      .lineTo(-u.r + u.iBeam.w, u.hd - u.iBeam.hd)
      .lineBy(-u.iBeam.w , -u.iBeam.hs)
      .lineBy(0, -1)
      .offset(u.as + u.waterStop.h, Side.Right)
      .removeStart()
      .removeEnd()
    path.resetEnd(path.end.add(d));
    return path;
  }
  protected drawCEnd(): void{
    const u = this.struct;
    const bar = this.specs.end.topBeam;
    const fig = this.figures.cEnd;
    const left = this.genShape();
    const right = left.mirrorByYAxis();
    const x = u.r - u.iBeam.w - 1.5 * fig.textHeight;
    const y = u.hd - u.iBeam.hd - 2 * fig.textHeight;
    fig.push(
      new PlaneRebar(fig.textHeight)
        .rebar(left)
        .spec(bar)
        .leaderNote(vec(-x, y), vec(-1, 1), vec(1, 0))
        .generate(),
      new PlaneRebar(fig.textHeight)
        .rebar(right)
        .spec(bar)
        .leaderNote(vec(x, y), vec(1, 1), vec(-1, 0))
        .generate(),
    )

  }
}