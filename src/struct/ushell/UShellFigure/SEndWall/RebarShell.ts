import { Line, StrecthSide, vec } from "@/draw";
import { FigureContent } from "@/struct/utils";
import { UShellRebar } from "../../UShellRebar";
import { UShellStruct } from "../../UShellStruct";

export class RebarShell{
  build(u: UShellStruct, rebars: UShellRebar, fig: FigureContent, isCant = false): void {
    this.drawCInner(u, rebars, fig, isCant);
    this.drawCInnerSub(u, rebars, fig, isCant);
    this.drawCOuter(u, rebars, fig, isCant);
    this.drawLInner(u, rebars, fig);
    this.drawLOuter(u, rebars, fig);
  }

  protected drawCInner(u: UShellStruct, rebars: UShellRebar, fig: FigureContent, isCant: boolean): void {
    const bar = rebars.shell.cInner;
    const r = fig.drawRadius;
    const as = rebars.info.as;
    const left = isCant
      ? fig.outline.getBoundingBox().left + u.waterStop.w + as + fig.r
      : u.endSect.b;
    const right = fig.outline.getBoundingBox().right;
    fig.push(
      fig
        .sparsePointRebar()
        .points(
          ...new Line(vec(left, -as + r), vec(right, -as + r))
            .divide(bar.denseSpace, StrecthSide.tail)
            .removeEndPt().points
        )
        .spec(bar.spec, 0, bar.denseSpace)
        .parallelLeader(
          vec(right + fig.textHeight, 2 * fig.textHeight),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawCInnerSub(u: UShellStruct, rebars: UShellRebar, fig: FigureContent, isCant = false): void {
    const bar = rebars.shell.cInner;
    const r = fig.drawRadius;
    const as = rebars.info.as;
    const y = -u.waterStop.h - as - r;
    const count = rebars.end.cOuter.singleCount;
    const rebar = fig.sparsePointRebar();
    const left = fig.outline.getBoundingBox().left;
    if (isCant) {
      rebar.points(vec(left + as + r, y)).spec(bar.specSub);
    } else {
      rebar
        .points(
          ...new Line(
            vec(as + r, y),
            vec(u.endSect.b - as - r, y)
          ).divideByCount(count - 1).points
        )
        .spec(bar.specSub, count);
    }
    fig.push(
      rebar
        .parallelLeader(
          vec(
            left - 2 * fig.textHeight,
            y + 2 * fig.textHeight + u.waterStop.h
          ),
          vec(-1, 0)
        )
        .generate()
    );
  }
  protected drawCOuter(u: UShellStruct, rebars: UShellRebar, fig: FigureContent, isCant = false): void {
    const bar = rebars.shell.cOuter;
    const as = rebars.info.as;
    const right = fig.outline.getBoundingBox().right;
    const y = -u.shell.t + as;
    const rebar = fig
      .sparsePointRebar(30)
      .points(
        ...new Line(vec(u.endSect.b, y), vec(right, y))
          .divide(bar.denseSpace, StrecthSide.tail)
          .removeStartPt()
          .removeEndPt().points
      );
    if (isCant) {
      const left = fig.outline.getBoundingBox().left;
      rebar.points(
        ...new Line(vec(left + as, y), vec(0, y))
          .divide(bar.denseSpace, StrecthSide.tail)
          .removeEndPt().points
      );
    }
    fig.push(
      rebar
        .spec(bar.spec, 0, bar.denseSpace)
        .parallelLeader(
          vec(right + fig.textHeight, y - 2 * fig.textHeight),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawLInner(u: UShellStruct, rebars: UShellRebar, fig: FigureContent): void {
    const bar = rebars.shell.lInner;
    const as = rebars.info.as;
    const y = -as;
    const left = fig.outline.getBoundingBox().left;
    const right = fig.outline.getBoundingBox().right;
    fig.push(
      fig
        .planeRebar()
        .rebar(new Line(vec(left + u.waterStop.w + as, y), vec(right, y)))
        .spec(bar.spec, 0, bar.space)
        .leaderNote(
          vec(u.endSect.b + 25, 4 * fig.textHeight),
          vec(0, 1),
          vec(-1, 0)
        )
        .generate()
    );
  }
  protected drawLOuter(u: UShellStruct, rebars: UShellRebar, fig: FigureContent): void {
    const bar = rebars.shell.lOuter;
    const as = rebars.info.as;
    const left = fig.outline.getBoundingBox().left;
    const right = fig.outline.getBoundingBox().right;
    const y = -u.shell.t + as + fig.drawRadius;
    fig.push(
      fig
        .planeRebar()
        .rebar(new Line(vec(left + as, y), vec(right, y)))
        .spec(bar.spec, 0, bar.space)
        .leaderNote(
          vec(u.endSect.b + 75, 4 * fig.textHeight),
          vec(0, 1),
          vec(1, 0)
        )
        .generate()
    );
  }
}
