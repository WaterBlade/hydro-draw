import { PlaneRebar, Polyline, RebarPathForm, Side, toDegree, vec } from "@/draw";
import { UShellRebarBuilder } from "../../../UShellRebar";

export class TopBeamBar extends UShellRebarBuilder{
  isExist(): boolean{
    return this.struct.iBeam.w > 0;
  }
  build(): this{
    if(this.isExist()){
      const u = this.struct;
      const bar = this.rebars.end.topBeam;
      const dia = this.rebars.shell.topBeam.diameter;
      const grade = this.rebars.shell.topBeam.grade;
      const count = this.rebars.end.cOuter.singleCount;
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

      this.figures.rTable.push(bar);
      this.figures.mTable.push(bar);

      this.drawCEnd();
    }
    return this;
  }
  protected genShape(): Polyline{
    const u = this.struct;
    const d = vec(-u.iBeam.w, -u.iBeam.hs).unit().mul(150);
    const path = new Polyline(-u.r - u.t - u.oBeam.w - u.waterStop.h, u.hd + u.waterStop.h - 1)
      .lineBy(0, 1)
      .lineBy(u.oBeam.w + u.t + u.iBeam.w + u.waterStop.h, 0)
      .lineTo(-u.r + u.iBeam.w, u.hd - u.iBeam.hd)
      .lineBy(-u.iBeam.w , -u.iBeam.hs)
      .lineBy(0, -1)
      .offset(u.as + u.waterStop.h, Side.Right)
      .removeStart()
      .removeEnd()
    path.resetEnd(path.end.add(d));
    return path;
  }

  cEnd: PlaneRebar[] = [];
  protected drawCEnd(): void{
    const bar = this.rebars.end.topBeam;
    const fig = this.figures.cEnd;
    const left = this.genShape();
    const right = left.mirrorByYAxis();
    this.cEnd.push(
      fig.planeRebar()
        .rebar(left)
        .spec(bar),
      fig.planeRebar()
        .rebar(right)
        .spec(bar)
    )

  }
}