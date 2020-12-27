import {
  ArrowNote,
  CompositeItem,
  DimensionBuilder,
  LayerPointNote,
  Line,
  PathPointNote,
  Polyline,
  RotateDirection,
  Side,
  SparsePointNote,
  vec,
} from "@/draw";
import { RebarFigure } from "@/struct/Figure";
import { UShell } from "./UShell";
import { UShellRebar } from "./UShellRebar";

export class MidSectFigure extends RebarFigure<UShell, UShellRebar> {
  generate(): CompositeItem {
    this.drawScale = 50;

    this.drawOutline();
    this.drawMainBar();
    this.drawInnerLBar();
    this.drawOuterLBar();
    this.drawInnerCBar();
    this.drawOuterCBar();
    this.drawBeamBar();
    this.drawDim();
    this.setTitle("槽身跨中断面钢筋图", true);

    return this.composite;
  }
  protected drawOutline(): void {
    const u = this.struct;
    const [transPt0, transPt1] = u.transPt;
    const angle = u.transAngle;

    // 跨中断面轮廓
    this.composite.push(
      new Polyline(-u.r + u.iBeam.w, u.hd)
        .lineBy(-u.beamWidth, 0)
        .lineBy(0, -u.oBeam.hd)
        .lineBy(u.oBeam.w, -u.oBeam.hs)
        .lineBy(0, -u.oWallH)
        .arcTo(transPt0.x, transPt0.y, angle)
        .lineTo(-u.butt.w / 2, -u.bottomRadius)
        .lineBy(u.butt.w, 0)
        .lineTo(transPt1.x, transPt1.y)
        .arcTo(u.r + u.t, 0, angle)
        .lineBy(0, u.oWallH)
        .lineBy(u.oBeam.w, u.oBeam.hs)
        .lineBy(0, u.oBeam.hd)
        .lineBy(-u.beamWidth, 0)
        .lineBy(0, -u.iBeam.hd)
        .lineBy(u.iBeam.w, -u.iBeam.hs)
        .lineBy(0, -u.iWallH)
        .arcBy(-2 * u.r, 0, 180, RotateDirection.clockwise)
        .lineBy(0, u.iWallH)
        .lineBy(u.iBeam.w, u.iBeam.hs)
        .lineBy(0, u.iBeam.hd)
        .close()
        .greyLine()
    );
  }
  protected drawMainBar(): void {
    const u = this.struct;
    const bar = this.rebar.main;
    const y = u.bottom + u.as + this.drawRadius;
    const left = vec(-u.butt.w / 2, y);
    const right = vec(u.butt.w / 2, y);
    const pt = vec(0, y - 2 * this.textHeight);
    if (bar.layerCount > 1) {
      this.composite.push(
        new LayerPointNote(this.textHeight, this.drawRadius)
          .spec(bar, bar.count)
          .layers(left, right, bar.singleCount, bar.layerSpace, bar.layerCount)
          .onlineNote(pt, vec(1, 0))
          .generate()
      );
    } else {
      this.composite.push(
        new SparsePointNote(this.textHeight, this.drawRadius, 0)
          .spec(bar, bar.count)
          .points(...new Line(left, right).divideByCount(bar.count - 1).points)
          .parrallelOnline(pt, vec(1, 0), Side.Right)
          .generate()
      );
    }
  }
  protected drawInnerLBar(): void {
    const u = this.struct;
    const bar = this.rebar.innerL;
    const p = this.rebar
      .genInnerLBarGuide()
      .offset(u.as + this.drawRadius, Side.Right)
      .removeStart()
      .removeEnd()
      .divide(bar.space);
    this.composite.push(
      new PathPointNote(this.textHeight, this.drawRadius)
        .spec(bar, bar.count, bar.space)
        .path(p)
        .offset(2 * this.textHeight)
        .onlineNote(vec(0, -u.r / 2))
        .generate()
    );
  }
  protected drawOuterLBar(): void {
    const u = this.struct;
    const bar = this.rebar.outerL;
    const pLeft = this.rebar
      .genOuterLBarGuide()
      .offset(u.as + this.drawRadius)
      .removeStart()
      .removeEnd()
      .divide(bar.space)
      .removeStartPt()
      .removeEndPt();
    const pRight = pLeft.mirrorByYAxis();
    this.composite.push(
      new PathPointNote(this.textHeight, this.drawRadius)
        .spec(bar, bar.count / 2, bar.space)
        .path(pLeft)
        .offset(2 * this.textHeight, Side.Right)
        .onlineNote(vec(-u.r, -u.r / 4))
        .generate(),
      new PathPointNote(this.textHeight, this.drawRadius)
        .spec(bar, bar.count / 2, bar.space)
        .path(pRight)
        .offset(2 * this.textHeight)
        .onlineNote(vec(u.r, -u.r / 4), true)
        .generate()
    );
  }
  protected drawInnerCBar(): void {
    const u = this.struct;
    const bar = this.rebar.innerC;
    const path = this.rebar
      .genInnerCBarGuide()
      .offset(u.as, Side.Right)
      .removeStart()
      .removeEnd();
    const pt = vec(-u.r + 3 * this.textHeight, u.hd / 5);
    this.composite.push(
      new ArrowNote(this.textHeight)
        .spec(bar, 0, bar.space)
        .rebar(path)
        .leaderNote(pt, vec(1, 0))
        .generate()
    );
  }
  protected drawOuterCBar(): void {
    const u = this.struct;
    const bar = this.rebar.outerC;
    const path = this.rebar
      .genOuterCBarGuide()
      .offset(u.as)
      .removeStart()
      .removeEnd();
    const pt = vec(-u.r - u.t - 3 * this.textHeight, u.hd / 5);
    this.composite.push(
      new ArrowNote(this.textHeight)
        .spec(bar, 0, bar.space)
        .rebar(path)
        .leaderNote(pt, vec(1, 0))
        .generate()
    );
  }
  protected drawBeamBar(): void {
    const u = this.struct;
    const bar = this.rebar.beam;
    const pLeft = this.rebar
      .genBeamBarGuide()
      .offset(u.as, Side.Right)
      .removeStart()
      .removeEnd();
    const pRight = pLeft.mirrorByYAxis();
    const ptLeft = vec(
      -u.r + u.iBeam.w + 1.5 * this.textHeight,
      u.hd + 2 * this.textHeight
    );
    const ptRight = ptLeft.mirrorByYAxis();
    this.composite.push(
      new ArrowNote(this.textHeight)
        .spec(bar, 0, bar.space)
        .rebar(pLeft)
        .leaderNote(ptLeft, vec(1, 1), vec(1, 0))
        .generate(),
      new ArrowNote(this.textHeight)
        .spec(bar, 0, bar.space)
        .rebar(pRight)
        .leaderNote(ptRight, vec(1, -1), vec(-1, 0))
        .generate()
    );
  }
  protected drawDim(): void {
    const u = this.struct;
    const dim = new DimensionBuilder(this.unitScale, this.drawScale);
    const box = this.composite.getBoundingBox();
    const transPt = u.transPt[0];
    // Top dim
    dim.hTop(-u.r - u.t - u.oBeam.w, box.top + 2 * this.textHeight);
    if (u.oBeam.w > 0) dim.dim(u.oBeam.w);
    dim.dim(u.t);
    if (u.iBeam.w > 0) dim.dim(u.iBeam.w);
    dim.dim(2 * u.r - 2 * u.iBeam.w);
    if (u.iBeam.w > 0) dim.dim(u.iBeam.w);
    dim.dim(u.t);
    if (u.oBeam.w > 0) dim.dim(u.oBeam.w);
    dim.next().dim(2 * u.r + 2 * u.t + 2 * u.oBeam.w);
    // right dim
    dim.vRight(box.right + 2 * this.textHeight, u.hd);
    if (u.iBeam.hd > 0) dim.dim(u.iBeam.hd);
    if (u.iBeam.hs > 0) dim.dim(u.iBeam.hs);
    dim
      .dim(u.hd - u.iBeam.hd - u.iBeam.hs)
      .dim(u.r)
      .dim(u.t + u.butt.h)
      .next();
    if (u.oBeam.hd > 0) dim.dim(u.oBeam.hd);
    if (u.oBeam.hs > 0) dim.dim(u.oBeam.hs);
    dim
      .dim(u.hd - u.oBeam.hd - u.oBeam.hs)
      .dim(Math.abs(transPt.y))
      .dim(u.r + u.t + u.butt.h - Math.abs(transPt.y))
      .next()
      .dim(u.hd + u.r + u.t + u.butt.h);

    this.composite.push(dim.generate());
  }
}
