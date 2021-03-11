import { CompositeItem, divideByCount, Line, Polyline, sum, vec } from "@/draw";
import { ContextBuilder } from "@/draw/preset/Context";
import { CountRebar } from "@/struct/utils";
import { ColumnRebar } from "./ColumnRebar";
import { ColumnStruct } from "./ColumnStruct";

abstract class ColumnView {
  protected yLeader = 0;
  protected dot: number[] = [];
  constructor(
    protected fig: ContextBuilder,
    protected struct: ColumnStruct,
    protected rebars: ColumnRebar
  ) {}

  abstract w: number;
  abstract midBar: CountRebar;

  generate(): CompositeItem {
    const t = this.struct;
    const rebars = this.rebars;
    const as = rebars.as;
    this.yLeader = t.l - t.hTopBeam;
    this.dot = divideByCount(
      -this.w / 2 + as,
      this.w / 2 - as,
      rebars.along.singleCount + 1
    );

    const comp = new CompositeItem();
    this.corner(comp);
    this.along(comp);
    this.stir(comp);
    return comp;
  }
  protected corner(comp: CompositeItem): void {
    const fig = this.fig;
    const t = this.struct;
    const rebars = this.rebars;
    this.yLeader -= 3 * fig.h;
    const bar = rebars.corner;
    const as = rebars.as;
    const top = t.toTop ? t.l - as : t.l - t.hTopBeam + as;
    comp.push(
      fig
        .planeRebar()
        .rebar(
          new Polyline(-this.w / 2 + as, top)
            .lineTo(-this.w / 2 + as, -t.ld + as)
            .lineBy(-300, 0),
          new Polyline(this.w / 2 - as, top)
            .lineTo(this.w / 2 - as, -t.ld + as)
            .lineBy(300, 0)
        )
        .spec(bar)
        .count(2)
        .leaderNote(vec(-this.w / 2 - fig.h, this.yLeader), vec(1, 0))
        .generate()
    );
  }
  protected along(comp: CompositeItem): void {
    const fig = this.fig;
    const t = this.struct;
    const rebars = this.rebars;
    this.yLeader -= 3 * fig.h;
    const bar = this.midBar;
    const as = rebars.as;
    const xs = divideByCount(
      -this.w / 2 + as,
      this.w / 2 - as,
      bar.singleCount + 1
    ).slice(1, -1);
    const top = t.toTop ? t.l - as : t.l - t.hTopBeam + as;
    comp.push(
      fig
        .planeRebar()
        .rebar(...xs.map((x) => new Line(vec(x, top), vec(x, -t.ld + as))))
        .spec(bar)
        .count(bar.singleCount)
        .leaderNote(vec(-this.w / 2 - fig.h, this.yLeader), vec(1, 0))
        .generate()
    );
  }
  protected stir(comp: CompositeItem): void {
    const fig = this.fig;
    const t = this.struct;
    const rebars = this.rebars;
    const bar = rebars.stir;
    const as = rebars.as;
    const ys = bar.pos();

    const specs = [];
    if (rebars.stirCross.isExist()) specs.push(rebars.stirCross);
    if (rebars.tendonCross.isExist()) specs.push(rebars.tendonCross);
    if (rebars.stirAlong.isExist()) specs.push(rebars.stirAlong);
    if (rebars.tendonAlong.isExist()) specs.push(rebars.tendonAlong);

    const x0 = -this.w / 2 + as;
    const x1 = -x0;
    const lines = ys.map((y) => new Line(vec(x0, y), vec(x1, y)));
    const x = sum(...this.dot.slice(0, 2)) / 2;
    comp.push(
      fig
        .planeRebar()
        .rebar(...lines)
        .spec(bar)
        .count(ys.length)
        .mulSpec(...specs)
        .leaderNote(vec(x, t.l + 2 * fig.h), vec(0, -1), vec(-1, 0))
        .generate()
    );
  }
}

export class ColumnViewAlong extends ColumnView {
  get w(): number {
    return this.struct.h;
  }
  get midBar(): CountRebar {
    return this.rebars.along;
  }
}

export class ColumnViewCross extends ColumnView {
  get w(): number {
    return this.struct.w;
  }
  get midBar(): CountRebar {
    return this.rebars.cross;
  }
}
