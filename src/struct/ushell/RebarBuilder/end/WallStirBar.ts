import {
  Line,
  Polyline,
  RebarFormPreset,
  Side,
  SpaceRebarSpec,
  vec,
  Vector,
} from "@/draw";
import { Figure } from "@/struct/utils/Figure";
import { RebarBase } from "../Base";

export class WallStirBar extends RebarBase {
  protected isExist(): boolean {
    return this.struct.hasUnCant();
  }
  protected isLeftExist(): boolean {
    return this.struct.isLeftFigureExist();
  }
  protected isRightExist(): boolean {
    return this.struct.isRightFigureExist();
  }
  protected getEndFigure(): Figure {
    return this.figures.cEnd;
  }
  protected getLeftFigure(): Figure {
    return this.figures.sEndWLeft;
  }
  protected getRightFigure(): Figure {
    return this.figures.sEndWRight;
  }
  protected getBar(): SpaceRebarSpec {
    return this.specs.end.wStir;
  }
  protected getGap(): number {
    return this.struct.waterStop.h;
  }
  protected getFactor(): number {
    if (this.struct.hasNoCant()) {
      return 4;
    } else {
      return 2;
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
          RebarFormPreset.RectWidthHook(
            bar.diameter,
            u.endSect.b - 2 * as,
            lens
          )
        )
        .setCount(lens.length * this.getFactor())
        .setId(this.specs.id.gen())
        .setStructure(this.name);
      this.specs.record(bar);
    }
    return this;
  }
  buildFigure(): this {
    this.drawCEnd();
    if (this.isLeftExist()) this.drawSEndWall(this.getLeftFigure());
    if (this.isRightExist()) this.drawSEndWall(this.getRightFigure());
    return this;
  }
  protected genMulShape(): Line[] {
    const u = this.struct;
    const bar = this.specs.end.wStir;
    const as = this.specs.as;
    const gap = this.getGap();
    const y0 = u.shell.hd - as;
    const y1 = -u.shell.r - gap - as;
    const leftEdge = u.genEndCOuterLeft().offset(as);
    const rightEdge = u.genEndCInnerLeft().offset(gap + as, Side.Right);

    const pts = new Line(vec(0, y0), vec(0, y1)).divide(bar.space).removeEndPt()
      .points;
    return pts.map(
      (p) =>
        new Line(
          leftEdge.rayIntersect(p, vec(1, 0))[0],
          rightEdge.rayIntersect(p, vec(1, 0))[0]
        )
    );
  }
  protected drawCEnd(): void {
    if (this.isExist()) {
      const u = this.struct;
      const bar = this.getBar();
      const fig = this.getEndFigure();
      const lines = this.genMulShape();
      fig.push(
        fig
          .planeRebar()
          .spec(bar, lines.length, bar.space)
          .rebar(...lines.reverse())
          .cross(
            new Polyline(
              -u.shell.r -
                u.shell.t -
                u.oBeam.w +
                u.endSect.w +
                Math.max(u.support.w / 2, 200),
              u.shell.hd - u.endHeight
            )
              .lineBy(-u.endSect.w, u.endSect.hs)
              .lineBy(0, u.endSect.hd + 3 * fig.textHeight)
          )
          .note(vec(1, 0))
          .generate(),
        fig
          .planeRebar()
          .spec(bar, lines.length, bar.space)
          .rebar(...lines.map((l) => l.mirrorByVAxis()))
          .cross(
            new Polyline(
              u.shell.r +
                u.shell.t +
                u.oBeam.w -
                u.endSect.w -
                Math.max(u.support.w / 2, 200),
              u.shell.hd - u.endHeight
            )
              .lineBy(u.endSect.w, u.endSect.hs)
              .lineBy(0, u.endSect.hd + 3 * fig.textHeight)
          )
          .note(vec(-1, 0))
          .generate()
      );
    }
  }
  protected getWallNotePos(fig: Figure): Vector {
    const u = this.struct;
    const as = this.specs.as;
    const gap = this.getGap();
    const h0 = u.oBeam.w + u.shell.t - gap - 2 * as;
    const y = -gap - as - h0 / 2;
    return vec(-2 * fig.h, y);
  }
  protected drawSEndWall(fig: Figure): void {
    const u = this.struct;
    const bar = this.getBar();
    const as = this.specs.as;
    const w0 = u.endSect.b - 2 * as;
    const gap = this.getGap();
    const h0 = u.oBeam.w + u.shell.t - gap - 2 * as;
    fig.push(
      fig
        .planeRebar()
        .rebar(
          new Polyline(as, -gap - as)
            .lineBy(w0, 0)
            .lineBy(0, -h0)
            .lineBy(-w0, 0)
            .lineBy(0, h0)
        )
        .spec(bar, 0, bar.space)
        .leaderNote(this.getWallNotePos(fig), vec(1, 0))
        .generate()
    );
  }
}
