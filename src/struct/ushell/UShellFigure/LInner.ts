import { Circle, Line, Polyline, Side, vec } from "@/draw";
import { FigureConfig } from "@/struct/utils";
import { UShellBasicFigure } from "./UShellFigure";

export class LInner extends UShellBasicFigure {
  protected unitScale = 1;
  protected drawScale = 50;
  protected title = "槽身纵剖钢筋图";
  protected config = new FigureConfig(true, true);

  draw(): void {
    this.drawOutline();

    this.drawBarMain();
    this.drawBarStir();

    this.drawEndBeamBot();
    this.drawEndBeamMid();
    this.drawEndBeamStir();
    this.drawEndBeamTop();

    this.drawShellCInner();
    this.drawShellCInnerSub();
    this.drawShellCOuter();
    this.drawShellLInner();
    this.drawShellMain();

    this.drawTransArc();

    this.drawNote();
    this.drawDim();
  }
  protected drawOutline(): void {
    const u = this.struct;
    const fig = this.fig;
    fig.addOutline(u.genLOuterLine().greyLine());
    const left = new Polyline(-u.len / 2 + u.waterStop.w, u.shell.hd)
      .lineBy(0, -u.shell.hd - u.shell.r - u.waterStop.h)
      .lineBy(-u.waterStop.w, 0);
    const right = left.mirrorByVAxis();
    fig.addOutline(
      new Line(
        vec(-u.len / 2 + u.waterStop.w, -u.shell.r),
        vec(u.len / 2 - u.waterStop.w, -u.shell.r)
      ).greyLine(),
      left.greyLine(),
      right.greyLine()
    );
    if (u.support.h > 0) {
      const y = u.shell.hd - u.endHeight + u.support.h;
      fig.addOutline(
        new Line(
          vec(-u.len / 2 + u.cantLeft, y),
          vec(-u.len / 2 + u.cantLeft + u.endSect.b, y)
        ).greyLine(),
        new Line(
          vec(u.len / 2 - u.cantRight, y),
          vec(u.len / 2 - u.cantRight - u.endSect.b, y)
        ).greyLine()
      );
    }
    const pts = u.genBarCenters();
    const { w, h } = u.bar;
    for (const p of pts) {
      const { x, y } = p;
      fig.addOutline(
        new Polyline(x - w / 2, y + h / 2)
          .lineBy(w, 0)
          .lineBy(0, -h)
          .lineBy(-w, 0)
          .lineBy(0, h)
          .greyLine()
      );
    }
  }
  protected drawNote(): void {
    const u = this.struct;
    const fig = this.fig;
    const h = u.endHeight - u.shell.hd - u.shell.r - u.shell.tb;
    const bot = u.shell.hd - u.endHeight;
    const y = -u.shell.r - u.shell.tb - 0.25 * h;
    const r = 0.75 * h;
    // end beam
    if (u.isLeftFigureExist() || u.isEndCantFigureExist()) {
      const id = this.figures.sEndBeamLeft.id;
      const x = -u.len / 2 + u.endSect.b / 2 + u.cantLeft;
      fig.push(
        fig.leaderSpec(
          `大样${id}`,
          vec(x, y),
          r,
          vec(x - fig.h, bot - 2 * fig.h)
        )
      );
    }
    if (u.isRightFigureExist() || u.isRightCantFigureExist()) {
      const id = this.figures.sEndBeamRight.id;
      const x = u.len / 2 - u.endSect.b / 2 - u.cantRight;
      fig.push(
        fig.leaderSpec(
          `大样${id}`,
          vec(x, y),
          r,
          vec(x + fig.h, bot - 2 * fig.h)
        )
      );
    }
    // bar
    const pts = u.genBarCenters();
    const pt = pts[Math.floor(pts.length / 2)];
    const id = this.figures.sBar.id;
    fig.push(
      fig.leaderSpec(
        `大样${id}`,
        pt,
        1.5 * u.bar.w,
        pt.add(vec(3 * fig.h, -5 * fig.h))
      )
    );
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
      .dim(u.shell.hd + u.shell.r)
      .dim(u.shell.t + u.shell.hb)
      .dim(u.oBeam.w);

    const d = u.endHeight - u.shellHeight - u.oBeam.w;
    if (d > 0) dim.dim(d);
    dim.next().dim(u.endHeight);

    const pts = u.genBarCenters();
    const { w } = u.bar;

    dim.hTop(-u.len / 2, box.top + 2 * fig.h).dim(u.waterStop.w);
    for (let i = 0; i < pts.length - 1; i++) {
      const l = pts[i + 1].x - pts[i].x;
      dim.dim(w).dim(l - w);
    }
    dim.dim(w).dim(u.waterStop.w);

    fig.push(dim.generate());
  }

  protected drawBarMain(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const { w, h } = u.bar;
    const r = fig.r;
    const as = rebars.asBar;
    const w0 = w / 2 - as - r;
    const h0 = h / 2 - as - r;
    const pts = u.genBarCenters();
    for (const p of pts) {
      fig.push(
        new Circle(p.add(vec(-w0, h0)), r).thickLine(),
        new Circle(p.add(vec(w0, h0)), r).thickLine(),
        new Circle(p.add(vec(-w0, -h0)), r).thickLine(),
        new Circle(p.add(vec(w0, -h0)), r).thickLine()
      );
    }
  }
  protected drawBarStir(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const as = rebars.asBar;
    const w0 = u.bar.w - 2 * as;
    const h0 = u.bar.h - 2 * as;
    const pts = u.genBarCenters();
    for (const p of pts) {
      const { x, y } = p;
      fig.push(
        new Polyline(x - w0 / 2, y + h0 / 2)
          .lineBy(w0, 0)
          .lineBy(0, -h0)
          .lineBy(-w0, 0)
          .lineBy(0, h0)
          .thickLine()
      );
    }
  }

  protected drawEndBeamBot(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const bar = rebars.end.bBot;
    const as = rebars.as;
    const r = fig.r;
    const y = u.shell.hd - u.endHeight + u.support.h + as + fig.r;
    const x0 = -u.len / 2 + u.cantLeft + as + r;
    const x1 = x0 + u.endSect.b - 2 * as - 2 * r;
    const x3 = u.len / 2 - u.cantRight - as - r;
    const x2 = x3 - u.endSect.b + 2 * as + 2 * r;
    const leftPts = new Line(vec(x0, y), vec(x1, y)).divideByCount(
      bar.singleCount - 1
    ).points;
    const leftBars = leftPts.map((p) => new Circle(p, fig.r).thickLine());
    const rightPts = new Line(vec(x2, y), vec(x3, y)).divideByCount(
      bar.singleCount - 1
    ).points;
    const rightBars = rightPts.map((p) => new Circle(p, fig.r).thickLine());
    fig.push(...leftBars, ...rightBars);
  }
  protected drawEndBeamMid(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const bar = rebars.end.bMid;
    const as = rebars.as;
    const r = fig.r;
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
  protected drawEndBeamStir(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const as = rebars.as;
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
  protected drawEndBeamTop(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
    const bar = rebars.end.bTop;
    const r = fig.r;
    const as = rebars.as;
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
    const fig = this.fig;
    const rebars = this.rebars;
    const bar = rebars.shell.cInner;
    const paths = bar.pos();
    fig.push(
      fig
        .linePointRebar()
        .line(paths[0])
        .offset(2 * fig.h)
        .spec(bar)
        .count(paths[0].points.length)
        .space(bar.denseSpace)
        .onlineNote()
        .generate(),
      fig
        .linePointRebar()
        .line(paths[1])
        .offset(2 * fig.h)
        .spec(bar)
        .count(paths[1].points.length)
        .space(bar.space)
        .onlineNote()
        .generate(),
      fig
        .linePointRebar()
        .line(paths[2])
        .offset(2 * fig.h)
        .spec(bar)
        .count(paths[2].points.length)
        .space(bar.denseSpace)
        .onlineNote()
        .generate()
    );
  }
  protected drawShellCInnerSub(): void {
    const u = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const bar = rebars.shell.cInnerSub;
    const as = rebars.as;
    const r = fig.r;
    const count = rebars.end.cOuter.singleCount;
    const y = -u.shell.r - u.waterStop.h - as;
    const x0 = -u.len / 2 + as + r;
    if (u.cantLeft > 0) {
      fig.push(
        fig
          .sparsePointRebar(30)
          .points(vec(x0, y))
          .spec(bar)
          .parallelLeader(vec(-u.len / 2 - fig.h, y + 2 * fig.h), vec(1, 0))
          .generate()
      );
    } else {
      fig.push(
        fig
          .linePointRebar()
          .line(
            new Line(
              vec(x0, y),
              vec(x0 + u.endSect.b - 2 * as - 2 * r, y)
            ).divideByCount(count - 1)
          )
          .offset(2 * fig.h)
          .spec(bar)
          .count(count)
          .onlineNote()
          .generate()
      );
    }
    const x1 = u.len / 2 - as - r;
    if (u.cantRight > 0) {
      fig.push(
        fig
          .sparsePointRebar(30)
          .points(vec(x1, y))
          .spec(bar)
          .parallelLeader(vec(u.len / 2 + fig.h, y + 2 * fig.h), vec(1, 0))
          .generate()
      );
    } else {
      fig.push(
        fig
          .linePointRebar()
          .line(
            new Line(
              vec(x1 - u.endSect.b + 2 * as + 2 * r, y),
              vec(x1, y)
            ).divideByCount(count - 1)
          )
          .offset(2 * fig.h)
          .spec(bar)
          .count(count)
          .onlineNote()
          .generate()
      );
    }
  }
  protected drawShellCOuter(): void {
    const u = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const bar = rebars.shell.cOuter;
    const paths = bar.pos();
    let i = 0;
    const y = -u.shell.r - u.shell.tb - 1.5 * fig.h;
    if (u.cantLeft > 0) {
      const path = paths[i++];
      fig.push(
        fig
          .sparsePointRebar()
          .points(...path.points)
          .spec(bar)
          .count(path.points.length)
          .space(bar.denseSpace)
          .parallelLeader(vec(-u.len / 2 - fig.h, y), vec(1, 0))
          .generate()
      );
    }
    fig.push(
      fig
        .linePointRebar()
        .line(paths[i])
        .offset(2 * fig.h, Side.Right)
        .spec(bar)
        .count(paths[i++].points.length)
        .space(bar.denseSpace)
        .onlineNote()
        .generate(),
      fig
        .linePointRebar()
        .line(paths[i])
        .offset(2 * fig.h, Side.Right)
        .spec(bar)
        .count(paths[i++].points.length)
        .space(bar.space)
        .onlineNote()
        .generate(),
      fig
        .linePointRebar()
        .line(paths[i])
        .offset(2 * fig.h, Side.Right)
        .spec(bar)
        .count(paths[i++].points.length)
        .space(bar.denseSpace)
        .onlineNote()
        .generate()
    );
    if (u.cantRight > 0) {
      const path = paths[i++];
      fig.push(
        fig
          .sparsePointRebar()
          .points(...path.points)
          .spec(bar)
          .count(path.points.length)
          .space(bar.denseSpace)
          .parallelLeader(vec(u.len / 2 + fig.h, y), vec(1, 0))
          .generate()
      );
    }
  }
  protected drawShellLInner(): void {
    const u = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const bar = rebars.shell.lInner;
    const as = rebars.as;
    const y = -u.shell.r - as - fig.r;
    fig.push(
      fig
        .planeRebar()
        .rebar(
          new Line(
            vec(-u.len / 2 + u.waterStop.w + as, y),
            vec(u.len / 2 - u.waterStop.w - as, y)
          )
        )
        .spec(bar)
        .leaderNote(
          vec(-u.len / 2 + u.cantLeft + rebars.denseL + 75, y + 4 * fig.h),
          vec(0, -1),
          vec(1, 0)
        )
        .generate()
    );
  }
  protected drawShellMain(): void {
    const u = this.struct;
    const rebars = this.rebars;
    const fig = this.fig;
    const bar = rebars.shell.main;
    const as = rebars.as;
    const y = -u.shell.r - u.shell.t - u.shell.hb + as + fig.r;
    fig.push(
      fig
        .planeRebar()
        .rebar(new Line(vec(-u.len / 2 + as, y), vec(u.len / 2 - as, y)))
        .spec(bar)
        .leaderNote(
          vec(u.len / 2 - u.cantRight - rebars.denseL - 75, y - 4 * fig.h),
          vec(0, 1),
          vec(-1, 0)
        )
        .generate()
    );
  }
  protected drawTransArc(): void {
    const u = this.struct;
    const fig = this.fig;
    const rebars = this.rebars;
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
          -u.shell.r - u.shell.t - u.shell.hb - u.oBeam.w - 2 * fig.h
        ),
        vec(-1, 1),
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
}
