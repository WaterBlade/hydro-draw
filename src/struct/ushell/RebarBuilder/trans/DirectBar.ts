import { Line, Polyline, RebarFormPreset, vec } from "@/draw";
import { Figure } from "@/struct/Figure";
import { RebarBase } from "../Base";

export class DirectBar extends RebarBase {
  buildSpec(): this {
    const u = this.struct;
    const as = this.specs.as;
    if (u.oBeam.w > 0) {
      const bar = this.specs.trans.direct;
      const lines = this.genShape();
      const count =
        (2 + (u.cantLeft > 0 ? 1 : 0) + (u.cantRight > 0 ? 1 : 0)) *
        lines.length *
        2;
      const factor = Math.sqrt(u.lenTrans ** 2 + u.oBeam.w ** 2) / u.oBeam.w;
      bar
        .setCount(count)
        .setForm(
          RebarFormPreset.Line(
            bar.diameter,
            factor * (u.shell.t + u.oBeam.w - 2 * as)
          )
        )
        .setId(this.specs.id.gen())
        .setStructure(this.name);

      this.specs.record(bar);
    }
    return this;
  }
  buildFigure(): this {
    this.drawCTrans();
    if (this.struct.isLeftExist()) this.drawSEndWall(this.figures.sEndWLeft);
    if (this.struct.isRightExist()) this.drawSEndWall(this.figures.sEndWRight);
    if (this.struct.isLeftCantExist())
      this.drawSEndWall(this.figures.sEndCantWLeft, true);
    if (this.struct.isRightCantExist())
      this.drawSEndWall(this.figures.sEndCantWRight, true);
    return this;
  }
  protected genShape(): Line[] {
    const u = this.struct;
    const as = this.specs.as;
    const bar = this.specs.trans.direct;
    const x = -u.shell.r - u.shell.t - u.oBeam.w + as;
    const top = u.shell.hd - u.oBeam.hd - u.oBeam.hs - as;
    const bottom = 0;
    const w = u.shell.t + u.oBeam.w - 2 * as;
    const pts = new Line(vec(x, top), vec(x, bottom)).divide(bar.space).points;
    return pts.map((p) => new Line(p, vec(x + w, p.y)));
  }
  protected drawCTrans(): void {
    const u = this.struct;
    const fig = this.figures.cTrans;
    const bar = this.specs.trans.direct;
    const left = this.genShape();
    const right = left.map((l) => l.mirrorByVAxis());
    fig.push(
      fig
        .planeRebar()
        .spec(bar, left.length, bar.space)
        .rebar(...left)
        .leaderNote(
          vec(-u.shell.r - (u.shell.t + u.oBeam.w) / 2, u.shell.hd + 2 * fig.h),
          vec(0, 1),
          vec(1, 0)
        )
        .generate(),
      fig
        .planeRebar()
        .spec(bar, left.length, bar.space)
        .rebar(...right)
        .leaderNote(
          vec(u.shell.r + (u.shell.t + u.oBeam.w) / 2, u.shell.hd + 2 * fig.h),
          vec(0, 1),
          vec(-1, 0)
        )
        .generate()
    );
  }
  protected drawSEndWall(fig: Figure, isCant = false): void {
    const u = this.struct;
    const as = this.specs.as;
    const bar = this.specs.trans.direct;
    const path = new Polyline(u.endSect.b - 1, -u.shell.t - u.oBeam.w)
      .lineBy(1, 0)
      .lineBy(
        u.lenTrans + u.shell.t * (u.lenTrans / u.oBeam.w),
        u.oBeam.w + u.shell.t
      )
      .lineBy(-1, 0)
      .offset(as)
      .removeStart()
      .removeEnd();

    const rebar = fig.planeRebar().rebar(path);
    if (isCant) {
      const left = path.mirrorByVAxis();
      left.move(vec(u.endSect.b, 0));
      rebar.rebar(left);
    }

    fig.push(
      rebar
        .spec(bar, 0, bar.space)
        .leaderNote(
          vec(u.endSect.b + u.lenTrans, -u.shell.t - u.oBeam.w / 2),
          vec(1, 0)
        )
        .generate()
    );
  }
}
