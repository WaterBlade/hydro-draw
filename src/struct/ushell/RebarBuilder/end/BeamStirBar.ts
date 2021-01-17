import {
  Arc,
  PlaneRebar,
  Line,
  Polyline,
  RebarFormPreset,
  vec,
  SpaceRebarSpec,
  Vector,
} from "@/draw";
import { Figure } from "@/struct/utils/Figure";
import { RebarBase } from "../Base";

export class BeamStirBar extends RebarBase {
  protected isExist(): boolean {
    return this.struct.hasUnCant();
  }
  protected isLeftExist(): boolean {
    return this.struct.cantLeft === 0;
  }
  protected isRightExist(): boolean {
    return this.struct.cantRight === 0;
  }
  protected isLeftFigureExist(): boolean {
    return this.struct.isLeftFigureExist();
  }
  protected isRightFigureExist(): boolean {
    return this.struct.isRightFigureExist();
  }
  protected getEndFigure(): Figure {
    return this.figures.cEnd;
  }
  protected getLeftFigure(): Figure {
    return this.figures.sEndBLeft;
  }
  protected getRightFigure(): Figure {
    return this.figures.sEndBRight;
  }
  protected getBar(): SpaceRebarSpec {
    return this.specs.end.bStir;
  }
  protected getGap(): number {
    return this.struct.waterStop.h;
  }
  protected getFactor(): number {
    if (this.struct.hasNoCant()) {
      return 2;
    } else {
      return 1;
    }
  }
  buildSpec(): this {
    if (this.isExist()) {
      const u = this.struct;
      const bar = this.getBar();
      const as = this.specs.as;
      const lens = this.genMulShape().map((l) => l.calcLength());
      bar
        .setForm(
          RebarFormPreset.RectStir(
            bar.diameter,
            u.endSect.b - 2 * as,
            lens
          )
        )
        .setCount(this.getFactor() * lens.length)
        .setId(this.specs.id.gen())
        .setStructure(this.name);
      this.specs.record(bar);
    }
    return this;
  }
  buildFigure(): this {
    this.drawCEnd();
    this.drawLInner();
    if (this.isLeftFigureExist()) this.drawSEndBeam(this.getLeftFigure());
    if (this.isRightFigureExist()) this.drawSEndBeam(this.getRightFigure());
    return this;
  }
  protected genMulShape(): Line[] {
    const u = this.struct;
    const bar = this.specs.end.bStir;
    const as = this.specs.as;
    const l = Math.min(
      u.shell.r,
      u.shell.r + u.shell.t + u.oBeam.w - u.endSect.w
    );
    const y = u.shell.hd - u.endHeight + u.support.h + as;
    const pts = new Line(vec(-l, y), vec(l, y)).divide(bar.space).points;
    const topEdge = new Arc(vec(0, 0), u.shell.r + this.getGap() + as, 180, 0);
    return pts.map((p) => new Line(p, topEdge.rayIntersect(p, vec(0, 1))[0]));
  }
  protected drawCEnd(): void {
    if (this.isExist()) {
      const u = this.struct;
      const bar = this.getBar();
      const midCount = this.specs.end.bMid.singleCount;
      const fig = this.getEndFigure();
      const as = this.specs.as;
      const y0 = u.shell.hd - u.endHeight + u.support.h + as;
      const y1 = -u.shell.r - u.waterStop.h - as;
      const y = y0 + (0.5 * (y1 - y0)) / (midCount + 1);
      const lens = this.genMulShape();
      fig.push(
        new PlaneRebar(fig.textHeight)
          .spec(bar, lens.length, bar.space)
          .rebar(...lens)
          .leaderNote(
            vec(
              -u.shell.r -
                u.shell.t -
                u.oBeam.w +
                u.endSect.w -
                2 * fig.textHeight,
              y
            ),
            vec(1, 0)
          )
          .generate()
      );
    }
  }
  protected drawLInner(): void {
    const u = this.struct;
    const fig = this.figures.lInner;
    const as = this.specs.as;
    const gap = this.getGap();
    const h = u.endHeight - u.shell.hd - u.shell.r - 2 * as - gap - u.support.h;
    const w = u.endSect.b - 2 * as;
    if (this.isLeftExist()) {
      fig.push(
        new Polyline(
          -u.len / 2 + u.cantLeft + as,
          -u.shell.r - gap - as - fig.r
        )
          .lineBy(0, -h)
          .lineBy(w, 0)
          .lineBy(0, h)
          .lineBy(-w, 0)
          .thickLine()
      );
    }
    if (this.isRightExist()) {
      fig.push(
        new Polyline(
          u.len / 2 - u.cantRight - as,
          -u.shell.r - gap - as - fig.r
        )
          .lineBy(0, -h)
          .lineBy(-w, 0)
          .lineBy(0, h)
          .lineBy(w, 0)
          .thickLine()
      );
    }
  }
  protected getSEndBeamPos(fig: Figure): Vector {
    const u = this.struct;
    const r = fig.drawRadius;
    const as = this.specs.as;
    const gap = this.getGap();
    const h = u.endHeight - u.shell.hd - u.shell.r - u.support.h - 2 * as - gap;
    const y = h / 2;
    return vec(-2 * fig.textHeight, -gap - as - r - y);
  }
  protected drawSEndBeam(fig: Figure): void {
    const u = this.struct;
    const bar = this.getBar();
    const gap = this.getGap();
    const as = this.specs.as;
    const w = u.endSect.b - 2 * as;
    const h = u.endHeight - u.shell.hd - u.shell.r - u.support.h - 2 * as - gap;
    fig.push(
      fig
        .planeRebar()
        .rebar(
          new Polyline(as, -gap - as)
            .lineBy(w, 0)
            .lineBy(0, -h)
            .lineBy(-w, 0)
            .lineBy(0, h)
        )
        .spec(bar, 0, bar.space)
        .leaderNote(this.getSEndBeamPos(fig), vec(1, 0))
        .generate()
    );
  }
}
