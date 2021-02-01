import { RebarFormPreset, RebarPathForm, Side, toDegree } from "@/draw";
import { UShellContext } from "../UShell";

export class RebarShell extends UShellContext {
  protected name = "槽壳";
  build(): void {
    this.cInner();
    this.cInnerSub();
    this.cOuter();
    this.lInner();
    this.lOuter();
    this.main();
    this.topBeam();
  }
  protected cInner(): void {
    const u = this.struct;
    const bar = this.rebars.shell.cInner;
    const as = this.rebars.as;
    const path = this.shape.shell
      .cInner()
      .offset(as, Side.Right)
      .removeStart()
      .removeEnd();
    const lens = path.segments.map((s) => s.calcLength());
    const form = new RebarPathForm(bar.diameter)
      .lineBy(0, -1.6)
      .dimLength(lens[0])
      .arcBy(4, 0, 180)
      .dimArc(u.shell.r + as)
      .dimLength(lens[1])
      .lineBy(0, 1.6)
      .dimLength(lens[2]);

    bar.setForm(form);
    bar.setCount(
      this.pos.shell
        .cInner()
        .reduce((pre: number, cur) => pre + cur.points.length, 0)
    );
    bar.setId(this.rebars.id.gen()).setName(this.name);
    this.rebars.record(bar);
  }
  protected cInnerSub(): void {
    const u = this.struct;
    const bar = this.rebars.shell.cInnerSub;
    const parent = this.rebars.shell.cInner;
    const as = this.rebars.as;
    const id = parent.id;
    const lens = this.shape.shell
      .cInner()
      .offset(u.waterStop.h + as, Side.Right)
      .removeStart()
      .removeEnd().lengths;

    let count = 0;
    if (u.cantLeft > 0) {
      count += 1;
    } else {
      count += this.rebars.end.cOuter.singleCount;
    }
    if (u.cantRight > 0) {
      count += 1;
    } else {
      count += this.rebars.end.cOuter.singleCount;
    }
    bar
      .setGrade(parent.grade)
      .setDiameter(parent.diameter)
      .setForm(
        new RebarPathForm(bar.diameter)
          .lineBy(0, -1.6)
          .dimLength(lens[0])
          .arcBy(4, 0, 180)
          .dimArc(u.shell.r + u.waterStop.h + as)
          .dimLength(lens[1])
          .lineBy(0, 1.6)
          .dimLength(lens[2])
      )
      .setCount(count)
      .setId(id + "a")
      .setName(this.name);
    this.rebars.record(bar);
  }
  protected cOuter(): void {
    const u = this.struct;
    const bar = this.rebars.shell.cOuter;
    const angle = u.transAngle;
    const as = this.rebars.as;
    const path = this.shape.shell.cOuter().offset(as).removeStart().removeEnd();
    const lens = path.segments.map((s) => s.calcLength());
    if (lens.length < 7) throw Error("outer c bar length not init");
    const form = new RebarPathForm(bar.diameter)
      .lineBy(0, -1.5)
      .dimLength(lens[0], Side.Right)
      .arcBy(0.612, -1.44, 46)
      .dimArc(u.shell.r + u.shell.t - as, angle)
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
    bar.setForm(form);
    bar.setCount(
      this.pos.shell
        .cOuter()
        .reduce((pre: number, cur) => pre + cur.points.length, 0)
    );
    bar.setId(this.rebars.id.gen()).setName(this.name);
    this.rebars.record(bar);
  }
  protected lInner(): void {
    const u = this.struct;
    const bar = this.rebars.shell.lInner;
    const as = this.rebars.as;
    const path = this.pos.shell
      .lInner()
      .offset(as + bar.diameter / 2, Side.Right)
      .removeStart()
      .removeEnd()
      .divide(bar.space);
    bar
      .setCount(path.points.length)
      .setForm(
        RebarFormPreset.Line(bar.diameter, u.len - 2 * as - 2 * u.waterStop.w)
      )
      .setId(this.rebars.id.gen())
      .setName(this.name);
    this.rebars.record(bar);
  }
  protected lOuter(): void {
    const u = this.struct;
    const bar = this.rebars.shell.lOuter;
    const as = this.rebars.as;
    const path = this.pos.shell
      .lOuter(as + bar.diameter / 2)
      .offset(as + bar.diameter / 2)
      .removeStart()
      .removeStart()
      .divide(bar.space)
      .removeStartPt()
      .removeEndPt();
    bar
      .setCount(2 * path.points.length)
      .setForm(RebarFormPreset.Line(bar.diameter, u.len - 2 * as));
    bar.setId(this.rebars.id.gen()).setName(this.name);
    this.rebars.record(bar);
  }
  protected main(): void {
    const u = this.struct;
    const bar = this.rebars.shell.main;
    const as = this.rebars.as;
    bar.setForm(RebarFormPreset.Line(bar.diameter, u.len - 2 * as));
    bar.setId(this.rebars.id.gen()).setName(this.name);
    this.rebars.record(bar);
  }
  protected topBeam(): void {
    const u = this.struct;
    const bar = this.rebars.shell.topBeam;
    const as = this.rebars.as;
    if (u.oBeam.w + u.iBeam.w > 0) {
      const form = new RebarPathForm(bar.diameter);
      const segs = this.shape.shell
        .topBeam()
        .offset(as, Side.Right)
        .removeStart()
        .removeEnd().segments;
      let i = 0;
      if (u.oBeam.w > 0) {
        const angle = 90 + toDegree(Math.asin(u.oBeam.hs / u.oBeam.w));
        form
          .lineBy(-1.5, 1)
          .dimLength(segs[i++].calcLength())
          .lineBy(0, 1.2)
          .dimAngle(angle)
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
        const angle = 90 + toDegree(Math.asin(u.iBeam.hs / u.iBeam.w));
        form
          .lineBy(0, -1.2)
          .dimLength(segs[i++].calcLength())
          .lineBy(-1.5, -1)
          .dimAngle(angle)
          .dimLength(segs[i++].calcLength());
      } else {
        form.lineBy(0, 1.5).dimLength(segs[i++].calcLength());
      }
      bar
        .setCount(100)
        .setForm(form)
        .setId(this.rebars.id.gen())
        .setName(this.name);
      this.rebars.record(bar);
    }
  }
}
