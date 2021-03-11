import { Line, vec, Vector } from "@/draw";
import { FigureConfig } from "@/struct/utils";
import { UShellBasicFigure } from "./UShellFigure";

export class LOuter extends UShellBasicFigure {
  protected unitScale = 1;
  protected drawScale = 50;
  protected config = new FigureConfig(true, true);
  protected title = "槽身外层钢筋图";
  draw(): void {
    this.drawOutline();

    this.drawEndCOuter();
    this.drawShellCOuter();
    this.drawShellLOuter();
    this.drawShellMain();
    this.drawTransArc();

    this.drawDim();
  }
  protected drawOutline(): void {
    this.fig.addOutline(this.struct.genLOuterLine().greyLine());
  }
  protected drawDim(): void {
    const u = this.struct;
    const fig = this.fig;
    const box = fig.getBoundingBox();
    const dim = fig.dimBuilder();
    dim.hBottom(-u.len / 2, box.bottom - 2 * fig.h);
    if (u.cantLeft > 0) {
      dim.dim(u.cantLeft - u.lenTrans).dim(u.lenTrans);
    }
    dim
      .dim(u.endSect.b)
      .dim(u.lenTrans)
      .dim(u.len - u.cantLeft - u.cantRight - 2 * u.lenTrans - 2 * u.endSect.b)
      .dim(u.lenTrans)
      .dim(u.endSect.b);
    if (u.cantRight > 0) {
      dim.dim(u.lenTrans).dim(u.cantRight - u.lenTrans);
    }
    dim.next().dim(u.len);

    dim
      .vRight(box.right + 2 * fig.h, u.shell.hd)
      .dim(u.shellHeight)
      .dim(u.oBeam.w);

    const d = u.endHeight - u.shellHeight - u.oBeam.w;
    if (d > 0) dim.dim(d);
    dim.next().dim(u.endHeight);

    fig.push(dim.generate());
  }

  protected drawEndCOuter(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const bar = rebars.end.cOuter;
    const as = rebars.as;
    const y0 = u.shell.hd - as;
    const y1 = u.shell.hd - u.endHeight + as;
    const y = u.shell.hd - 6 * fig.h;
    const leftXs = new Line(
      vec(-u.len / 2 + u.cantLeft + as, 0),
      vec(-u.len / 2 + u.cantLeft + u.endSect.b - as, 0)
    )
      .divideByCount(bar.singleCount)
      .points.map((p) => p.x);
    const rightXs = new Line(
      vec(u.len / 2 - u.cantRight - as, 0),
      vec(u.len / 2 - u.cantRight - u.endSect.b + as, 0)
    )
      .divideByCount(bar.singleCount)
      .points.map((p) => p.x);
    fig.push(
      fig
        .planeRebar()
        .rebar(...leftXs.map((x) => new Line(vec(x, y0), vec(x, y1))))
        .spec(bar)
        .count(bar.singleCount)
        .leaderNote(vec(-u.len / 2 - 2 * fig.h, y), vec(1, 0))
        .generate(),
      fig
        .planeRebar()
        .rebar(...rightXs.map((x) => new Line(vec(x, y0), vec(x, y1))))
        .spec(bar)
        .count(bar.singleCount)
        .leaderNote(vec(u.len / 2 + 2 * fig.h, y), vec(1, 0))
        .generate()
    );
  }

  protected drawShellLOuter(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const bar = rebars.shell.lOuter;
    const as = rebars.as;
    const ys = bar
      .pos()
      .removeStart()
      .points.map((p) => p.y);
    const start = -u.len / 2 + as;
    const end = u.len / 2 - as;

    const x = (-0.8 * u.len) / 2;

    fig.push(
      fig
        .planeRebar()
        .spec(bar)
        .space(bar.space)
        .rebar(...ys.map((y) => new Line(vec(start, y), vec(end, y))))
        .leaderNote(vec(x, u.shell.hd + 2 * fig.h), vec(0, 1), vec(-1, 0))
        .generate()
    );
  }
  protected drawShellCOuter(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const bar = rebars.shell.cOuter;
    const as = rebars.as;
    const paths = bar.pos();
    const top = u.shell.hd - as;

    const pts = paths.reduce(
      (pre: Vector[], cur) => pre.concat(cur.points),
      []
    );
    const lines = pts.map((p) => new Line(vec(p.x, top), p));

    const y = u.shell.hd - 2 * fig.h;

    fig.push(
      fig
        .planeRebar()
        .rebar(...lines)
        .spec(bar)
        .count(pts.length)
        .leaderNote(vec(-u.len / 2 - 2 * fig.h, y), vec(1, 0))
        .generate()
    );
  }
  protected drawShellMain(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const bar = rebars.shell.main;
    const as = rebars.as;
    const y = -u.shell.r - u.shell.t - u.shell.hb + as;
    fig.push(
      fig
        .planeRebar()
        .rebar(new Line(vec(-u.len / 2 + as, y), vec(u.len / 2 - as, y)))
        .spec(bar)
        .leaderNote(vec(-u.len / 4, y - 4 * fig.h), vec(0, 1), vec(1, 0))
        .generate()
    );
  }

  protected drawTransArc(): void {
    const { struct: u, fig, rebars } = this;
    const bar = rebars.trans.arc;
    const left = bar.shapeEnd();
    const right = left.mirrorByVAxis();
    left.move(vec(-u.len / 2 + u.cantLeft, -u.shell.r));
    right.move(vec(u.len / 2 - u.cantRight, -u.shell.r));
    const leftRebar = fig
      .planeRebar()
      .spec(bar)
      .space(bar.space)
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
      .spec(bar)
      .space(bar.space)
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
}
