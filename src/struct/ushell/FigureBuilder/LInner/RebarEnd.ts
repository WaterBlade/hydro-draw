import { Circle, Line, Polyline, vec } from "@/draw";
import { UShellFigureContext } from "../../UShell";

export class RebarEnd extends UShellFigureContext {
  build(): void {
    this.drawBeamBot();
    this.drawBeamMid();
    this.drawBeamTop();
    this.drawBeamStir();
  }
  protected drawBeamBot(): void {
    const u = this.struct;
    const fig = this.figures.lInner;
    const bar = this.rebars.end.bBot;
    const as = this.rebars.as;
    const r = fig.drawRadius;
    const y = u.shell.hd - u.endHeight + u.support.h + as + fig.drawRadius;
    const x0 = -u.len / 2 + u.cantLeft + as + r;
    const x1 = x0 + u.endSect.b - 2 * as - 2 * r;
    const x3 = u.len / 2 - u.cantRight - as - r;
    const x2 = x3 - u.endSect.b + 2 * as + 2 * r;
    const leftPts = new Line(vec(x0, y), vec(x1, y)).divideByCount(
      bar.singleCount - 1
    ).points;
    const leftBars = leftPts.map((p) =>
      new Circle(p, fig.drawRadius).thickLine()
    );
    const rightPts = new Line(vec(x2, y), vec(x3, y)).divideByCount(
      bar.singleCount - 1
    ).points;
    const rightBars = rightPts.map((p) =>
      new Circle(p, fig.drawRadius).thickLine()
    );
    fig.push(...leftBars, ...rightBars);
  }
  protected drawBeamMid(): void {
    const u = this.struct;
    const bar = this.rebars.end.bMid;
    const fig = this.figures.lInner;
    const as = this.rebars.as;
    const r = fig.drawRadius;
    const x0 = -u.len / 2 + u.cantLeft + as + r;
    const x1 = x0 + u.endSect.b - 2 * as - 2 * r;
    const x3 = u.len / 2 - u.cantRight - as - r;
    const x2 = x3 - u.endSect.b + 2 * as + 2 * r;
    const y0 = -u.shell.r - u.waterStop.h - as - r;
    const y1 = u.shell.hd - u.endHeight + u.support.h + as + r;
    for (const x of [x0, x1, x2, x3]) {
      const pts = new Line(vec(x, y0), vec(x, y1))
        .divideByCount(bar.singleCount + 1)
        .removeStartPt()
        .removeEndPt().points;
      fig.push(...pts.map((p) => new Circle(p, r).thickLine()));
    }
  }
  protected drawBeamStir(): void {
    const u = this.struct;
    const fig = this.figures.lInner;
    const as = this.rebars.as;
    const w = u.endSect.b - 2 * as;
    const yLeft =
      -u.shell.r - as - fig.r - (u.cantLeft === 0 ? u.waterStop.h : 0);
    const yRight =
      -u.shell.r - as - fig.r - (u.cantRight === 0 ? u.waterStop.h : 0);
    const hLeft =
      u.endHeight -
      u.shell.hd -
      u.shell.r -
      2 * as -
      u.support.h -
      (u.cantLeft === 0 ? u.waterStop.h : 0);
    const hRight =
      u.endHeight -
      u.shell.hd -
      u.shell.r -
      2 * as -
      u.support.h -
      (u.cantRight === 0 ? u.waterStop.h : 0);
    fig.push(
      new Polyline(-u.len / 2 + u.cantLeft + as, yLeft)
        .lineBy(0, -hLeft)
        .lineBy(w, 0)
        .lineBy(0, hLeft)
        .lineBy(-w, 0)
        .thickLine()
    );
    fig.push(
      new Polyline(u.len / 2 - u.cantRight - as, yRight)
        .lineBy(0, -hRight)
        .lineBy(-w, 0)
        .lineBy(0, hRight)
        .lineBy(w, 0)
        .thickLine()
    );
  }
  protected drawBeamTop(): void {
    const u = this.struct;
    const bar = this.rebars.end.bTop;
    const fig = this.figures.lInner;
    const r = fig.drawRadius;
    const as = this.rebars.as;
    const leftGap = u.cantLeft > 0 ? 0 : u.waterStop.h;
    const rightGap = u.cantRight > 0 ? 0 : u.waterStop.h;
    const y = -u.shell.r - as - 2 * r;
    const x0 = -u.len / 2 + u.cantLeft + as + r;
    const x1 = x0 + u.endSect.b - 2 * as - 2 * r;
    const x3 = u.len / 2 - u.cantRight - as - r;
    const x2 = x3 - u.endSect.b + 2 * as + 2 * r;
    const leftPts = new Line(
      vec(x0, y - leftGap),
      vec(x1, y - leftGap)
    ).divideByCount(bar.singleCount - 1).points;
    const leftBars = leftPts.map((p) => new Circle(p, r).thickLine());
    const rightPts = new Line(
      vec(x2, y - rightGap),
      vec(x3, y - rightGap)
    ).divideByCount(bar.singleCount - 1).points;
    const rightBars = rightPts.map((p) => new Circle(p, r).thickLine());
    fig.push(...leftBars, ...rightBars);
  }
  protected drawShellCInner(): void {
    const bar = this.rebars.shell.cInner;
    const fig = this.figures.lInner;
    const paths = this.pos.shell.cInner();
    fig.push(
      fig
        .linePointRebar()
        .line(paths[0])
        .offset(2 * fig.textHeight)
        .spec(bar, paths[0].points.length, bar.denseSpace)
        .onlineNote()
        .generate(),
      fig
        .linePointRebar()
        .line(paths[1])
        .offset(2 * fig.textHeight)
        .spec(bar, paths[1].points.length, bar.space)
        .onlineNote()
        .generate(),
      fig
        .linePointRebar()
        .line(paths[2])
        .offset(2 * fig.textHeight)
        .spec(bar, paths[2].points.length, bar.denseSpace)
        .onlineNote()
        .generate()
    );
  }
}
