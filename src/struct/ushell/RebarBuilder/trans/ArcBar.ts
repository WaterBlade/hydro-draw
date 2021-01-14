import { Arc, Line, Polyline, RebarFormPreset, Side, vec } from "@/draw";
import { Figure } from "@/struct/utils/Figure";
import { RebarBase } from "../Base";

export class ArcBar extends RebarBase {
  buildSpec(): this {
    const u = this.struct;
    if (u.oBeam.w > 0) {
      const bar = this.specs.trans.arc;
      const lines = this.genShape();
      const count =
        (2 + (u.cantLeft > 0 ? 1 : 0) + (u.cantRight > 0 ? 1 : 0)) *
        lines.length;
      const factor = Math.sqrt(u.lenTrans ** 2 + u.oBeam.w ** 2) / u.oBeam.w;
      bar
        .setCount(count)
        .setForm(
          RebarFormPreset.Line(
            bar.diameter,
            lines.map((l) => factor * l.calcLength())
          )
        )
        .setId(this.specs.id.gen())
        .setStructure(this.name);

      this.specs.record(bar);
    }
    return this;
  }
  buildPos(): this {
    this.figures.cTrans.pos.xPos = this.genShape().map((l) => l.start.x);
    return this;
  }
  buildFigure(): this {
    this.drawCTrans();
    if (this.struct.isLeftFigureExist()) this.drawSEndBeam(this.figures.sEndBLeft);
    if (this.struct.isRightFigureExist()) this.drawSEndBeam(this.figures.sEndBRight);
    if (this.struct.isLeftCantFigureExist())
      this.drawSEndBeam(this.figures.sEndCantBLeft, true);
    if (this.struct.isRightCantFigureExist())
      this.drawSEndBeam(this.figures.sEndCantBRight, true);
    this.drawLOuter();
    this.drawLInner();
    return this;
  }
  protected genShape(): Line[] {
    const u = this.struct;
    const as = this.specs.as;
    const bar = this.specs.trans.direct;
    const pts = new Arc(vec(0, 0), u.shell.r + as, 180, 0)
      .divide(bar.space)
      .removeStartPt()
      .removeEndPt().points;
    const x = u.shell.r + u.shell.t + u.oBeam.w;
    const first = u
      .genEndCOuter()
      .resetStart(vec(-x, 0))
      .resetEnd(vec(x, 0))
      .offset(as);
    const second = u
      .genTransCOuter()
      .offset((u.endSect.b * u.oBeam.w) / u.lenTrans - as, Side.Right);
    return pts.map((p) => {
      const p1 = first.rayIntersect(p, p)[0];
      const p2 = second.rayIntersect(p, p)[0];
      const end = p1.sub(p).length() > p2.sub(p).length() ? p2 : p1;
      return new Line(p, end);
    });
  }
  protected drawLOuter(): void {
    const u = this.struct;
    const fig = this.figures.lOuter;
    const bar = this.specs.trans.arc;
    const left = this.genSEndShape();
    const right = left.mirrorByVAxis();
    left.move(vec(-u.len / 2 + u.cantLeft, -u.shell.r));
    right.move(vec(u.len / 2 - u.cantRight, -u.shell.r));
    const leftRebar = fig
      .planeRebar()
      .spec(bar, 0, bar.space)
      .rebar(left)
      .leaderNote(
        vec(
          -u.len / 2 + u.cantLeft + u.endSect.b + u.lenTrans,
          -u.shell.r - u.shell.tb - 2 * fig.h
        ),
        vec(1, 0)
      )
      .generate();
    const rightRebar = fig
      .planeRebar()
      .spec(bar, 0, bar.space)
      .rebar(right)
      .leaderNote(
        vec(
          u.len / 2 - u.cantRight - u.endSect.b - u.lenTrans,
          -u.shell.r - u.shell.tb - 2 * fig.h
        ),
        vec(1, 0)
      )
      .generate();
    fig.push(leftRebar, rightRebar);
    if (u.cantLeft > 0) {
      fig.push(
        leftRebar.mirrorByVAxis(-u.len / 2 + u.cantLeft + u.endSect.b / 2)
      );
    }
    if (u.cantRight > 0) {
      fig.push(
        rightRebar.mirrorByVAxis(u.len / 2 - u.cantRight - u.endSect.b / 2)
      );
    }
  }
  protected drawLInner(): void {
    const u = this.struct;
    const fig = this.figures.lInner;
    const bar = this.specs.trans.arc;
    const left = this.genSEndShape();
    const right = left.mirrorByVAxis();
    left.move(vec(-u.len / 2 + u.cantLeft, -u.shell.r));
    right.move(vec(u.len / 2 - u.cantRight, -u.shell.r));
    const leftRebar = fig
      .planeRebar()
      .spec(bar, 0, bar.space)
      .rebar(left)
      .leaderNote(
        vec(
          -u.len / 2 + u.cantLeft + u.endSect.b + u.lenTrans,
          -u.shell.r - u.shell.t - u.shell.hb - u.oBeam.w - 2 * fig.h
        ),
        vec(-1, 1),
        vec(1, 0)
      )
      .generate();
    const rightRebar = fig
      .planeRebar()
      .spec(bar, 0, bar.space)
      .rebar(right)
      .leaderNote(
        vec(
          u.len / 2 - u.cantRight - u.endSect.b - u.lenTrans,
          -u.shell.r - u.shell.t - u.shell.hb - u.oBeam.w - 2 * fig.h
        ),
        vec(1, 1),
        vec(-1, 0)
      )
      .generate();
    fig.push(leftRebar, rightRebar);
    if (u.cantLeft > 0) {
      fig.push(
        leftRebar.mirrorByVAxis(-u.len / 2 + u.cantLeft + u.endSect.b / 2)
      );
    }
    if (u.cantRight > 0) {
      fig.push(
        rightRebar.mirrorByVAxis(u.len / 2 - u.cantRight - u.endSect.b / 2)
      );
    }
  }
  protected drawCTrans(): void {
    const u = this.struct;
    const fig = this.figures.cTrans;
    const bar = this.specs.trans.arc;
    const x = fig.pos.findX(0);
    const lines = this.genShape();
    fig.push(
      fig
        .planeRebar()
        .spec(bar, lines.length, bar.space)
        .rebar(...lines)
        .cross(
          new Polyline(-u.shell.r - u.shell.t / 2 - u.oBeam.w / 2, 0).arcTo(
            u.shell.r + u.shell.t / 2 + u.oBeam.w / 2,
            0,
            180
          )
        )
        .leaderNote(vec(x, -u.shell.r / 2), vec(0, 1), vec(-1, 0))
        .generate()
    );
  }
  protected drawSEndBeam(fig: Figure, isCant = false): void {
    const u = this.struct;
    const bar = this.specs.trans.arc;
    const y0 = u.shell.hd + u.shell.r - u.endHeight + u.support.h;
    const p = this.genSEndShape();
    const rebar = fig.planeRebar().rebar(p);
    if (isCant) {
      const left = p.mirrorByVAxis();
      left.move(vec(u.endSect.b, 0));
      rebar.rebar(left);
    }
    fig.push(
      rebar
        .spec(bar)
        .leaderNote(
          vec(u.endSect.b + u.lenTrans, (-u.shell.t - u.shell.hb + y0) / 2),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected genSEndShape(): Polyline {
    const as = this.specs.as;
    const u = this.struct;
    const d =
      u.endHeight -
      u.shell.hd -
      u.shell.r -
      u.shell.t -
      u.shell.hb -
      u.oBeam.w -
      u.support.h;
    const x0 = u.endSect.b - (d * u.lenTrans) / u.oBeam.w;
    const y0 = u.shell.hd + u.shell.r - u.endHeight + u.support.h;
    const x1 =
      u.endSect.b +
      u.lenTrans +
      ((u.shell.t + u.shell.hb) * u.lenTrans) / u.oBeam.w;
    const p = new Polyline(x0 - 1, y0)
      .lineBy(1, 0)
      .lineTo(x1, 0)
      .lineBy(-1, 0)
      .offset(as)
      .removeStart()
      .removeEnd();
    return p;
  }
}
