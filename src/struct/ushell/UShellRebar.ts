import { CountRebar, Polyline, RebarPathForm, Side, SpaceRebar } from "@/draw";
import { RebarInStruct } from "../RebarInStruct";
import { UShell } from "./UShell";

export class UShellRebar extends RebarInStruct {
  main = new CountRebar();
  innerL = new SpaceRebar();
  outerL = new SpaceRebar();
  innerC = new SpaceRebar();
  outerC = new SpaceRebar();
  beam = new SpaceRebar();

  protected shellName = "槽壳";
  constructor(protected struct: UShell) {
    super();
  }
  build(): void {
    this.addMainBar();
    this.addInnerLBar();
    this.addOuterLBar();
    this.addInnerCBar();
    this.addOuterCBar();
    this.addBeamBar();
  }
  protected addMainBar(): void {
    const u = this.struct;
    const bar = this.main;
    bar
      .setForm(RebarPathForm.Line(bar.diameter, u.len - 2 * u.as))
      .setStructure(this.shellName);
    this.add(bar);
  }
  protected addInnerLBar(): void {
    const u = this.struct;
    const bar = this.innerL;
    const path = this.genInnerLBarGuide()
      .offset(u.as + bar.diameter / 2, Side.Right)
      .removeStart()
      .removeEnd()
      .divide(bar.space);
    bar
      .setCount(path.points.length)
      .setForm(
        RebarPathForm.Line(bar.diameter, u.len - 2 * u.as - 2 * u.waterStop.w)
      )
      .setStructure(this.shellName);
    this.add(bar);
  }
  genInnerLBarGuide(): Polyline {
    const u = this.struct;
    const path = new Polyline(-u.r - u.t, u.hd).lineBy(u.t + u.iBeam.w, 0);
    if (u.iBeam.w !== 0) {
      path
        .lineBy(0, -u.iBeam.hd)
        .lineBy(-u.iBeam.w, -u.iBeam.hs)
        .lineBy(0, -u.hd + u.iBeam.hd + u.iBeam.hs);
    } else {
      path.lineBy(0, -u.hd);
    }
    path.arcBy(2 * u.r, 0, 180);
    if (u.iBeam.w !== 0) {
      path
        .lineBy(0, u.hd - u.iBeam.hd - u.iBeam.hs)
        .lineBy(-u.iBeam.w, u.iBeam.hs)
        .lineBy(0, u.iBeam.hd);
    } else {
      path.lineBy(0, -u.hd);
    }
    path.lineBy(u.iBeam.w + u.t, 0);
    return path;
  }
  protected addOuterLBar(): void {
    const u = this.struct;
    const bar = this.outerL;
    const path = this.genOuterLBarGuide()
      .offset(u.as + bar.diameter / 2)
      .removeStart()
      .removeStart()
      .divide(bar.space)
      .removeStartPt()
      .removeEndPt();
    bar
      .setCount(2 * path.points.length)
      .setForm(RebarPathForm.Line(bar.diameter, u.len - 2 * u.as))
      .setStructure(this.shellName);
    this.add(bar);
  }
  genOuterLBarGuide(): Polyline {
    const u = this.struct;
    const path = new Polyline(-u.r + u.iBeam.w, u.hd - 1)
      .lineBy(0, 1)
      .lineBy(-u.beamWidth, 0);
    if (u.oBeam.w > 0) {
      path
        .lineBy(0, -u.oBeam.hd)
        .lineBy(u.oBeam.w, -u.oBeam.hs)
        .lineBy(0, -u.hd + u.oBeam.hd + u.oBeam.hs);
    } else {
      path.lineBy(0, -u.hd);
    }
    const leftPt = u.transPt[0];
    const angle = u.transAngle;
    path
      .arcTo(leftPt.x, leftPt.y, angle)
      .lineTo(-u.butt.w / 2, u.bottom)
      .lineTo(1, 0);
    return path;
  }
  protected addInnerCBar(): void {
    const u = this.struct;
    const bar = this.innerC;
    const path = this.genInnerCBarGuide()
      .offset(u.as, Side.Right)
      .removeStart()
      .removeEnd();
    const lens = path.segments.map((s) => s.calcLength());
    const form = new RebarPathForm(bar.diameter)
      .lineBy(0, -1.6)
      .dimLength(lens[0])
      .arcBy(4, 0, 180)
      .dimArc(u.r + u.as)
      .dimLength(lens[1])
      .lineBy(0, 1.6)
      .dimLength(lens[2]);

    bar.setCount(100).setForm(form).setStructure(this.shellName);
    this.add(bar);
  }
  genInnerCBarGuide(): Polyline {
    const u = this.struct;
    const path = new Polyline(-u.r - 1, u.hd)
      .lineBy(1, 0)
      .lineBy(0, -u.hd)
      .arcBy(2 * u.r, 0, 180)
      .lineBy(0, u.hd)
      .lineBy(1, 0);
    return path;
  }
  protected addOuterCBar(): void {
    const u = this.struct;
    const angle = u.transAngle;
    const bar = this.outerC;
    const path = this.genOuterCBarGuide()
      .offset(u.as)
      .removeStart()
      .removeEnd();
    const lens = path.segments.map((s) => s.calcLength());
    if (lens.length < 7) throw Error("outer c bar length not init");
    const form = new RebarPathForm(bar.diameter)
      .lineBy(0, -1.5)
      .dimLength(lens[0], Side.Right)
      .arcBy(0.612, -1.44, 46)
      .dimArc(u.r + u.t - u.as, angle)
      .dimLength(lens[1])
      .lineBy(0.788, -0.756)
      .dimLength(lens[2], Side.Right)
      .lineBy(1.2, 0)
      .dimLength(lens[3], Side.Right)
      .lineBy(0.788, 0.756)
      .dimLength(lens[4], Side.Right)
      .arcBy(0.612, 1.44, 46)
      .dimLength(lens[5])
      .lineBy(0, 1.5)
      .dimLength(lens[6], Side.Right);
    bar.setCount(100).setForm(form).setStructure(this.shellName);
    this.add(bar);
  }
  genOuterCBarGuide(): Polyline {
    const u = this.struct;
    const angle = u.transAngle;
    const [left, right] = u.transPt;
    const path = new Polyline(-u.r - u.t + 1, u.hd)
      .lineBy(-1, 0)
      .lineBy(0, -u.hd)
      .arcTo(left.x, left.y, angle)
      .lineTo(-u.butt.w / 2, u.bottom)
      .lineBy(u.butt.w, 0)
      .lineTo(right.x, right.y)
      .arcTo(u.r + u.t, 0, angle)
      .lineBy(0, u.hd)
      .lineBy(-1, 0);
    return path;
  }
  protected addBeamBar(): void {
    const u = this.struct;
    if (u.oBeam.w + u.iBeam.w > 0) {
      const bar = this.beam;
      const form = new RebarPathForm(bar.diameter);
      const segs = this.genBeamBarGuide()
        .offset(u.as, Side.Right)
        .removeStart()
        .removeEnd().segments;
      let i = 0;
      if (u.oBeam.w > 0) {
        form
          .lineBy(-1.5, 1)
          .dimLength(segs[i++].calcLength())
          .lineBy(0, 1)
          .dimLength(segs[i++].calcLength())
          .lineBy(3.2, 0)
          .dimLength(segs[i++].calcLength());
      } else {
        form
          .lineBy(0, 1.5)
          .dimLength(segs[i++].calcLength())
          .lineBy(2.5, 0)
          .dimLength(segs[i++].calcLength());
      }
      if (u.iBeam.w > 0) {
        form
          .lineBy(0, -1)
          .dimLength(segs[i++].calcLength())
          .lineBy(-1.5, -1)
          .dimLength(segs[i++].calcLength());
      } else {
        form.lineBy(0, 1.5).dimLength(segs[i++].calcLength());
      }
      bar.setCount(100).setForm(form).setStructure(this.shellName);
      this.add(bar);
    }
  }
  genBeamBarGuide(): Polyline {
    const u = this.struct;
    const bar = this.beam;
    const path = new Polyline();
    if (u.oBeam.w > 0) {
      path
        .moveTo(
          -u.r,
          u.hd - u.oBeam.hd - u.oBeam.hs - u.t * (u.oBeam.hs / u.oBeam.w) + 1
        )
        .lineBy(0, -1)
        .lineTo(-u.r - u.t - u.oBeam.w, u.hd - u.oBeam.hd)
        .lineBy(0, u.oBeam.hd);
    } else {
      path
        .moveTo(-u.r - u.t, u.hd - 40 * bar.diameter - u.as)
        .lineTo(-u.r - u.t, u.hd);
    }
    path.lineBy(u.beamWidth, 0);
    if (u.iBeam.w > 0) {
      path
        .lineBy(0, -u.iBeam.hd)
        .lineTo(
          -u.r - u.t,
          u.hd - u.iBeam.hd - u.iBeam.hs - u.t * (u.iBeam.hs / u.iBeam.w)
        )
        .lineBy(0, 1);
    } else {
      path.lineBy(0, -40 * bar.diameter - u.as);
    }

    return path;
  }
}
