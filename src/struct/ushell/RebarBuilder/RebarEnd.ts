import { RebarFormPreset, RebarPathForm, Side, toDegree } from "@/draw";
import { UShellContext } from "../UShell";

export class RebarEnd extends UShellContext {
  protected name = "端肋";
  build(): void {
    this.bBot();
    this.bMid();
    this.bStir();
    this.bStirCant();
    this.bTop();
    this.cOuter();
    this.wStir();
    this.wStirCant();
    this.topBeam();
    this.topBeamCant();
  }
  protected bBot(): void {
    const bar = this.rebars.end.bBot;
    const line = this.shape.end.bBot();
    bar
      .setForm(RebarFormPreset.Line(bar.diameter, line.calcLength()))
      .setId(this.rebars.id.gen())
      .setName(this.name);
    this.rebars.record(bar);
  }
  protected bMid(): void {
    const bar = this.rebars.end.bMid;
    bar
      .setForm(
        RebarFormPreset.Line(
          bar.diameter,
          this.shape.end.bMid().map((p) => p.calcLength())
        )
      )
      .setId(this.rebars.id.gen())
      .setName(this.name);
    this.rebars.record(bar);
  }
  protected bStir(): void {
    const u = this.struct;
    if (u.cantCount < 2) {
      const bar = this.rebars.end.bStir;
      const as = this.rebars.as;
      const lens = this.shape.end.bStir().map((l) => l.calcLength());
      bar
        .setForm(
          RebarFormPreset.RectStir(bar.diameter, u.endSect.b - 2 * as, lens)
        )
        .setCount((2 - u.cantCount) * lens.length)
        .setId(this.rebars.id.gen())
        .setName(this.name);
      this.rebars.record(bar);
    }
  }
  protected bStirCant(): void {
    const u = this.struct;
    if (u.cantCount > 0) {
      const parent = this.rebars.end.bStir;
      const bar = this.rebars.end.bStirCant;
      bar.set(parent.grade, parent.diameter, parent.space);
      const as = this.rebars.as;
      const lens = this.shape.end.bStirCant().map((l) => l.calcLength());
      bar
        .setForm(
          RebarFormPreset.RectStir(bar.diameter, u.endSect.b - 2 * as, lens)
        )
        .setCount(u.cantCount * lens.length)
        .setId(this.rebars.id.gen())
        .setName(this.name);
      this.rebars.record(bar);
    }
  }
  protected bTop(): this {
    const bar = this.rebars.end.bTop;
    bar
      .setForm(
        RebarFormPreset.Line(bar.diameter, this.shape.end.bTop().calcLength())
      )
      .setId(this.rebars.id.gen())
      .setName(this.name);
    this.rebars.record(bar);
    return this;
  }
  protected cOuter(): void {
    const u = this.struct;
    const bar = this.rebars.end.cOuter;
    const path = this.shape.end.cOuter();
    const lens = path.segments.map((s) => s.calcLength());
    let i = 0;
    const angle = 180 - toDegree(Math.atan(u.endSect.w / u.endSect.hs));
    bar
      .setForm(
        new RebarPathForm(bar.diameter)
          .lineBy(0, -1.5)
          .dimLength(lens[i++], Side.Right)
          .lineBy(0.75, -1.5)
          .dimLength(lens[i++], Side.Right)
          .dimAngle(angle)
          .lineBy(1, 0)
          .dimLength(lens[i++])
          .lineBy(0.5, 0.5)
          .dimLength(500, Side.Right)
      )
      .setId(this.rebars.id.gen())
      .setName(this.name);
    this.rebars.record(bar);
  }
  protected topBeam(): void {
    const u = this.struct;
    if (u.cantCount < 2) {
      const bar = this.rebars.end.topBeam;
      const dia = this.rebars.shell.topBeam.diameter;
      const grade = this.rebars.shell.topBeam.grade;
      const count = this.rebars.end.cOuter.singleCount;
      const segs = this.shape.end.topBeam().segments;
      const angle = 90 + toDegree(Math.asin(u.iBeam.hs / u.iBeam.w));
      let i = 0;
      bar
        .setGrade(grade)
        .setDiameter(dia)
        .setCount((2 - u.cantCount) * count)
        .setId(this.rebars.id.gen())
        .setName(this.name)
        .setForm(
          new RebarPathForm(dia)
            .lineBy(0, 1.6)
            .dimLength(40 * dia)
            .lineBy(2.5, 0)
            .dimLength(segs[i++].calcLength())
            .lineBy(0, -1.2)
            .dimLength(segs[i++].calcLength())
            .lineBy(-1.2, -0.8)
            .dimLength(segs[i++].calcLength())
            .dimAngle(angle)
        );

      this.rebars.record(bar);
    }
  }
  protected topBeamCant(): void {
    const u = this.struct;
    if (u.cantCount > 0) {
      const bar = this.rebars.end.topBeamCant;
      const dia = this.rebars.shell.topBeam.diameter;
      const grade = this.rebars.shell.topBeam.grade;
      const count = this.rebars.end.cOuter.singleCount;
      const segs = this.shape.end.topBeamCant().segments;
      const angle = 90 + toDegree(Math.asin(u.iBeam.hs / u.iBeam.w));
      let i = 0;
      bar
        .setGrade(grade)
        .setDiameter(dia)
        .setCount((2 - u.cantCount) * count)
        .setId(this.rebars.id.gen())
        .setName(this.name)
        .setForm(
          new RebarPathForm(dia)
            .lineBy(0, 1.6)
            .dimLength(40 * dia)
            .lineBy(2.5, 0)
            .dimLength(segs[i++].calcLength())
            .lineBy(0, -1.2)
            .dimLength(segs[i++].calcLength())
            .lineBy(-1.2, -0.8)
            .dimLength(segs[i++].calcLength())
            .dimAngle(angle)
        );

      this.rebars.record(bar);
    }
  }
  protected wStir(): void {
    const u = this.struct;
    if (u.cantCount < 2) {
      const bar = this.rebars.end.wStir;
      const as = this.rebars.as;
      const lens = this.shape.end.wStir().map((l) => l.calcLength());
      bar
        .setForm(
          RebarFormPreset.RectStir(bar.diameter, u.endSect.b - 2 * as, lens)
        )
        .setCount(lens.length * (2 - u.cantCount))
        .setId(this.rebars.id.gen())
        .setName(this.name);
      this.rebars.record(bar);
    }
  }
  protected wStirCant(): void {
    const u = this.struct;
    if (u.cantCount > 0) {
      const bar = this.rebars.end.wStirCant;
      const parent = this.rebars.end.wStir;
      const as = this.rebars.as;
      const lens = this.shape.end.wStirCant().map((l) => l.calcLength());
      bar
        .set(parent.grade, parent.diameter, parent.space)
        .setForm(
          RebarFormPreset.RectStir(bar.diameter, u.endSect.b - 2 * as, lens)
        )
        .setCount(lens.length * (2 - u.cantCount))
        .setId(this.rebars.id.gen())
        .setName(this.name);
      this.rebars.record(bar);
    }
  }
}
