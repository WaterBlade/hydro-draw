import {
  PlaneRebar,
  Polyline,
  RebarPathForm,
  RebarSpec,
  Side,
  toDegree,
  vec,
} from "@/draw";
import { Figure } from "@/struct/utils/Figure";
import { RebarBase } from "../Base";

export class TopBeamBar extends RebarBase {
  protected isExist(): boolean {
    return this.struct.iBeam.w > 0 && this.struct.hasUnCant();
  }
  protected _bar?: RebarSpec;
  protected getBar(): RebarSpec {
    if (!this._bar) {
      this._bar = new RebarSpec();
    }
    return this._bar;
  }
  protected getFigure(): Figure {
    return this.figures.cEnd;
  }
  protected getFactor(): number {
    if (this.struct.hasNoCant()) {
      return 4;
    } else {
      return 2;
    }
  }
  protected getGap(): number {
    return this.struct.waterStop.h;
  }
  buildSpec(): this {
    if (this.isExist()) {
      const u = this.struct;
      const bar = this.getBar();
      const dia = this.specs.shell.topBeam.diameter;
      const grade = this.specs.shell.topBeam.grade;
      const count = this.specs.end.cOuter.singleCount;
      const segs = this.genShape().segments;
      const angle = 90 + toDegree(Math.asin(u.iBeam.hs / u.iBeam.w));
      let i = 0;
      bar
        .setGrade(grade)
        .setDiameter(dia)
        .setCount(this.getFactor() * count)
        .setId(this.specs.id.gen())
        .setStructure(this.name)
        .setForm(
          new RebarPathForm(dia)
            .lineBy(0, 1.6)
            .dimLength(40 * dia)
            .lineBy(2.5, 0)
            .dimLength(segs[i++].calcLength())
            .lineBy(0, -1.2)
            .dimLength(segs[i++].calcLength())
            .lineBy(-1.2, -0.8)
            .dimLength(segs[i++].calcLength())
            .dimAngle(angle)
        );

      this.specs.record(bar);
    }
    return this;
  }
  buildFigure(): this {
    if (this.isExist()) {
      this.drawCEnd();
    }
    return this;
  }
  protected genShape(): Polyline {
    const u = this.struct;
    const as = this.specs.as;
    const d = vec(-u.iBeam.w, -u.iBeam.hs).unit().mul(150);
    const gap = this.getGap();
    const path = new Polyline(
      -u.shell.r - u.shell.t - u.oBeam.w + as,
      u.shell.hd + gap
    )
      .lineBy(u.oBeam.w + u.shell.t + u.iBeam.w - as, 0)
      .lineTo(-u.shell.r + u.iBeam.w, u.shell.hd - u.iBeam.hd)
      .lineBy(-u.iBeam.w, -u.iBeam.hs)
      .lineBy(0, -1)
      .offset(as + gap, Side.Right)
      .removeEnd();
    path.resetEnd(path.end.add(d));
    return path;
  }
  protected drawCEnd(): void {
    const u = this.struct;
    const bar = this.getBar();
    const fig = this.getFigure();
    const left = this.genShape();
    const right = left.mirrorByVAxis();
    const x = u.shell.r - u.iBeam.w - 1.5 * fig.textHeight;
    const y = u.shell.hd - u.iBeam.hd - 2 * fig.textHeight;
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
        .generate()
    );
  }
}
