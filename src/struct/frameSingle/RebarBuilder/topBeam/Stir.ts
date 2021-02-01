import {
  Line,
  Polyline,
  RebarDraw,
  RebarFormPreset,
  UnitRebarSpec,
  vec,
} from "@/draw";
import { RebarBase } from "../../Base";

export class Stir extends RebarBase {
  tendon = new UnitRebarSpec();
  buildSpec(): this {
    const t = this.struct;
    const bar = this.rebars.topBeam.stir;
    const as = this.rebars.as;
    const form = RebarFormPreset.RectStir(
      bar.diameter,
      t.topBeam.w - 2 * as,
      t.topBeam.h - 2 * as
    );
    bar
      .setCount(this.genMulPos().length)
      .setForm(form)
      .setId(this.rebars.id.gen())
      .setName(this.name);
    this.rebars.record(bar);
    this.buildTendonSpec();
    return this;
  }
  protected buildTendonSpec(): void {
    const t = this.struct;
    const bar = this.tendon;
    const preBar = this.rebars.topBeam.stir;
    const as = this.rebars.as;
    bar.set(preBar.grade, 8);
    bar.setForm(
      RebarFormPreset.HookLine(bar.diameter, t.topBeam.w - 2 * as, 4)
    );
    bar
      .setCount(Math.floor(t.hsn / 200) * t.n)
      .setId(this.rebars.id.gen())
      .setName(this.name);
    this.rebars.record(bar);
  }
  buildPos(): this {
    this.rebars.topBeam.stir.pos.dot(...this.genMulPos());
    return this;
  }
  protected genMulPos(): number[] {
    const t = this.struct;
    const d = 50;
    return new Line(vec(-t.hsn / 2 + d, 0), vec(t.hsn / 2 - d, 0))
      .divide(this.rebars.topBeam.stir.space)
      .points.map((p) => p.x);
  }
  buildFigure(): this {
    this.drawCross();
    this.drawSTop();
    return this;
  }
  protected drawCross(): void {
    const t = this.struct;
    const fig = this.figures.cross;
    const bar = this.rebars.topBeam.stir;
    const midBar = this.rebars.topBeam.mid;
    const as = this.rebars.as;
    const xs = this.genMulPos();
    const y = t.h - as;
    const d = t.topBeam.h - 2 * as;
    const y1 = as - t.topBeam.h / 2 + midBar.pos.cross.tail + y;
    const x1 = bar.pos.find(-t.hsn / 2 + t.topBeam.ha + 2 * fig.h);

    fig.push(
      fig
        .planeRebar()
        .rebar(...xs.map((x) => new Line(vec(x, y), vec(x, y - d))))
        .spec(bar, xs.length, bar.space)
        .cross(new Polyline(-t.w / 2, y1).lineTo(t.w / 2, y1))
        .leaderNote(vec(x1, y + 2 * fig.h), vec(0, 1), vec(1, 0))
        .generate()
    );
  }
  protected drawSTop(): void {
    const t = this.struct;
    const fig = this.figures.sTop;
    const bar = this.rebars.topBeam.stir;
    const as = this.rebars.as;
    const y = this.rebars.topBeam.mid.pos.sBeam.tail;
    fig.push(
      fig
        .planeRebar()
        .rebar(
          RebarDraw.stir(t.topBeam.h - 2 * as, t.topBeam.w - 2 * as, fig.r)
        )
        .spec(bar)
        .leaderNote(vec(-t.topBeam.w / 2 - 2 * fig.h, y), vec(1, 0))
        .generate()
    );
    const ys = this.rebars.topBeam.mid.pos.sBeam.dots.slice(1, -1);
    const rebar = fig.planeRebar().spec(this.tendon, 0, 200);

    for (const y of ys) {
      const l = RebarDraw.hLineHook(t.topBeam.w - 2 * as, fig.r);
      l.move(vec(0, y));
      rebar.rebar(l);
    }
    fig.push(
      rebar
        .cross(
          new Polyline(0, -t.topBeam.h / 2)
            .lineTo(0, y)
            .lineBy(t.topBeam.w / 2 + fig.h, 0)
        )
        .note()
        .generate()
    );
  }
}
