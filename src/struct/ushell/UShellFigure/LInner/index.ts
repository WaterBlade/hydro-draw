import { Line, Polyline, vec } from "@/draw";
import { Figure, FigureContent } from "@/struct/utils";
import { SBar } from "../SBar";
import { SEndBeam } from "../SEndBeam";
import { UShellRebar } from "../../UShellRebar";
import { UShellStruct } from "../../UShellStruct";
import { RebarBar } from "./RebarBar";
import { RebarEnd } from "./RebarEnd";
import { RebarShell } from "./RebarShell";
import { RebarTrans } from "./RebarTrans";

export class LInner extends Figure {
  protected shell = new RebarShell();
  protected end = new RebarEnd();
  protected bar = new RebarBar();
  protected trans = new RebarTrans();

  initFigure(): void {
    this.fig = new FigureContent();
    this.fig
      .resetScale(1, 50)
      .setTitle("槽身纵剖钢筋图")
      .displayScale()
      .centerAligned()
      .keepTitlePos();
    this.container.record(this.fig);
  }
  build(u: UShellStruct, rebars: UShellRebar, sBeam: SEndBeam, sBar: SBar): void {
    this.buildOutline(u);
    this.buildRebar(u, rebars);
    this.buildNote(u, sBeam, sBar);
    this.buildDim(u);
  }
  protected buildOutline(u: UShellStruct): void {
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
  protected buildRebar(u: UShellStruct, rebars: UShellRebar): void {
    this.shell.build(u, rebars, this.fig);
    this.end.build(u, rebars, this.fig);
    this.bar.build(u, rebars, this.fig);
    this.trans.build(u, rebars, this.fig);
  }
  protected buildNote(u: UShellStruct, sBeam: SEndBeam, sBar: SBar): void {
    const fig = this.fig;
    const h = u.endHeight - u.shell.hd - u.shell.r - u.shell.tb;
    const bot = u.shell.hd - u.endHeight;
    const y = -u.shell.r - u.shell.tb - 0.25 * h;
    const r = 0.75 * h;
    // end beam
    if (u.isLeftFigureExist() || u.isEndCantFigureExist()) {
      const id = sBeam.leftFig.id;
      const x = -u.len / 2 + u.endSect.b / 2 + u.cantLeft;
      fig.leaderSpec(
        `大样${id}`,
        vec(x, y),
        r,
        vec(x - fig.h, bot - 2 * fig.h)
      );
    }
    if (u.isRightFigureExist() || u.isRightCantFigureExist()) {
      const id = sBeam.rightFig.id;
      const x = u.len / 2 - u.endSect.b / 2 - u.cantRight;
      fig.leaderSpec(
        `大样${id}`,
        vec(x, y),
        r,
        vec(x + fig.h, bot - 2 * fig.h)
      );
    }
    // bar
    const pts = u.genBarCenters();
    const pt = pts[Math.floor(pts.length / 2)];
    const id = sBar.fig.id;
    fig.leaderSpec(
      `大样${id}`,
      pt,
      1.5 * u.bar.w,
      pt.add(vec(3 * fig.h, -5 * fig.h))
    );
  }
  protected buildDim(u: UShellStruct): void {
    const fig = this.fig;
    const box = fig.getBoundingBox();
    const dim = fig.dimBuilder();
    dim.hBottom(-u.len / 2, box.bottom - 2 * fig.textHeight);
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
      .vRight(box.right + 2 * fig.textHeight, u.shell.hd)
      .dim(u.shell.hd + u.shell.r)
      .dim(u.shell.t + u.shell.hb)
      .dim(u.oBeam.w);

    const d = u.endHeight - u.shellHeight - u.oBeam.w;
    if (d > 0) dim.dim(d);
    dim.next().dim(u.endHeight);

    const pts = u.genBarCenters();
    const { w } = u.bar;

    dim.hTop(-u.len / 2, box.top + 2 * fig.textHeight).dim(u.waterStop.w);
    for (let i = 0; i < pts.length - 1; i++) {
      const l = pts[i + 1].x - pts[i].x;
      dim.dim(w).dim(l - w);
    }
    dim.dim(w).dim(u.waterStop.w);

    fig.push(dim.generate());
  }
}
