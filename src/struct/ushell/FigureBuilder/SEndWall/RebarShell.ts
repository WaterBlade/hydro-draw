import { Line, StrecthSide, vec } from "@/draw";
import { Figure } from "@/struct/utils";
import { UShellFigureContext } from "../../UShell";

export class RebarShell extends UShellFigureContext {
  build(fig: Figure, isCant = false): void {
    this.drawCInner(fig, isCant);
    this.drawCInnerSub(fig, isCant);
    this.drawCOuter(fig, isCant);
    this.drawLInner(fig);
    this.drawLOuter(fig);
  }

  protected drawCInner(fig: Figure, isCant: boolean): void {
    const u = this.struct;
    const bar = this.rebars.shell.cInner;
    const r = fig.drawRadius;
    const as = this.rebars.as;
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
        .spec(bar, 0, bar.denseSpace)
        .parallelLeader(
          vec(right + fig.textHeight, 2 * fig.textHeight),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawCInnerSub(fig: Figure, isCant = false): void {
    const u = this.struct;
    const bar = this.rebars.shell.cInnerSub;
    const r = fig.drawRadius;
    const as = this.rebars.as;
    const y = -u.waterStop.h - as - r;
    const count = this.rebars.end.cOuter.singleCount;
    const rebar = fig.sparsePointRebar();
    const left = fig.outline.getBoundingBox().left;
    if (isCant) {
      rebar.points(vec(left + as + r, y)).spec(bar);
    } else {
      rebar
        .points(
          ...new Line(
            vec(as + r, y),
            vec(u.endSect.b - as - r, y)
          ).divideByCount(count - 1).points
        )
        .spec(bar, count);
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
  protected drawCOuter(fig: Figure, isCant = false): void {
    const u = this.struct;
    const bar = this.rebars.shell.cOuter;
    const as = this.rebars.as;
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
        .spec(bar, 0, bar.denseSpace)
        .parallelLeader(
          vec(right + fig.textHeight, y - 2 * fig.textHeight),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawLInner(fig: Figure): void {
    const u = this.struct;
    const bar = this.rebars.shell.lInner;
    const as = this.rebars.as;
    const y = -as;
    const left = fig.outline.getBoundingBox().left;
    const right = fig.outline.getBoundingBox().right;
    fig.push(
      fig
        .planeRebar()
        .rebar(new Line(vec(left + u.waterStop.w + as, y), vec(right, y)))
        .spec(bar, 0, bar.space)
        .leaderNote(
          vec(u.endSect.b + 25, 4 * fig.textHeight),
          vec(0, 1),
          vec(-1, 0)
        )
        .generate()
    );
  }
  protected drawLOuter(fig: Figure): void {
    const u = this.struct;
    const bar = this.rebars.shell.lOuter;
    const as = this.rebars.as;
    const left = fig.outline.getBoundingBox().left;
    const right = fig.outline.getBoundingBox().right;
    const y = -u.shell.t + as + fig.drawRadius;
    fig.push(
      fig
        .planeRebar()
        .rebar(new Line(vec(left + as, y), vec(right, y)))
        .spec(bar, 0, bar.space)
        .leaderNote(
          vec(u.endSect.b + 75, 4 * fig.textHeight),
          vec(0, 1),
          vec(1, 0)
        )
        .generate()
    );
  }
}
