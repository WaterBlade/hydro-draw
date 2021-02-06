import { last, Line, Polyline, vec } from "@/draw";
import { FigureContent } from "@/struct/utils";
import { UShellRebar } from "../../UShellRebar";
import { UShellStruct } from "../../UShellStruct";

export class RebarEnd{
  build(u: UShellStruct, rebars: UShellRebar, fig: FigureContent, isCant = false): void {
    this.drawBeamBot(u, rebars, fig);
    this.drawBeamMid(u, rebars, fig);
    this.drawBeamStir(u, rebars, fig, isCant);
    this.drawBeamTop(u, rebars, fig, isCant);
  }
  protected drawBeamBot(u: UShellStruct, rebars: UShellRebar, fig: FigureContent): void {
    const bar = rebars.end.bBot;
    const as = rebars.info.as;
    const r = fig.drawRadius;
    const y = -u.endHeight + u.shell.r + u.shell.hd + u.support.h + as + r;
    fig.push(
      fig
        .sparsePointRebar()
        .points(
          ...new Line(
            vec(as + r, y),
            vec(u.endSect.b - as - r, y)
          ).divideByCount(bar.singleCount - 1).points
        )
        .spec(bar.spec, bar.singleCount)
        .parallelLeader(
          vec(-2 * fig.textHeight, y - 2 * fig.textHeight - u.support.h),
          vec(-1, 0)
        )
        .generate()
    );
  }
  protected drawBeamMid(u: UShellStruct, rebars: UShellRebar, fig: FigureContent): void {
    const bar = rebars.end.bMid;
    const as = rebars.info.as;
    const r = fig.drawRadius;
    const x0 = as + r;
    const x1 = u.endSect.b - as - r;
    const y0 = -u.waterStop.h - as - r;
    const y1 = u.shell.hd + u.shell.r - u.endHeight + u.support.h + as + r;
    const pts0 = new Line(vec(x0, y0), vec(x0, y1))
      .divideByCount(bar.singleCount + 1)
      .removeStartPt()
      .removeEndPt().points;
    const pts1 = new Line(vec(x1, y0), vec(x1, y1))
      .divideByCount(bar.singleCount + 1)
      .removeStartPt()
      .removeEndPt().points;
    const y2 = (last(pts0).y + y1) / 2;
    fig.push(
      fig
        .sparsePointRebar()
        .points(...pts0, ...pts1)
        .spec(bar.spec, 2 * bar.singleCount)
        .jointLeader(vec(u.endSect.b / 2, y2), vec(-2 * fig.textHeight, y2))
        .generate()
    );
  }
  protected drawBeamStir(u: UShellStruct, rebars: UShellRebar, fig: FigureContent, isCant = false): void {
    const bar =  rebars.end.bStir;
    const spec = isCant ? bar.specCant : bar.spec;
    const gap = isCant ? 0 : u.waterStop.h;
    const as = rebars.info.as;
    const w = u.endSect.b - 2 * as;
    const h = u.endHeight - u.shell.hd - u.shell.r - u.support.h - 2 * as - gap;

    let pos;
    if (isCant) {
      pos = vec(-u.lenTrans, -u.shell.tb - 3 * fig.h);
    } else {
      const y = h / 2;
      pos = vec(-2 * fig.h, -gap - as - fig.r - y);
    }
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
        .spec(spec, 0, bar.space)
        .leaderNote(pos, vec(1, 0))
        .generate()
    );
  }
  protected drawBeamTop(u: UShellStruct, rebars: UShellRebar, fig: FigureContent, isCant = false): void {
    const bar = rebars.end.bTop;
    const as = rebars.info.as;
    const r = fig.drawRadius;
    const gap = isCant ? 0 : u.waterStop.h;
    const y = -gap - as - r;
    fig.push(
      fig
        .sparsePointRebar()
        .points(
          ...new Line(
            vec(as + r, y),
            vec(u.endSect.b - as - r, y)
          ).divideByCount(bar.singleCount - 1).points
        )
        .spec(bar.spec, bar.singleCount)
        .parallelLeader(
          vec(-2 * fig.textHeight, y - 2 * fig.textHeight),
          vec(-1, 0)
        )
        .generate()
    );
  }
}
