import { CompositeItem, divideByCount, Line, Polyline, sum, vec } from "@/draw";
import { FigureContent } from "@/struct/utils";
import { ColumnRebar } from "./ColumnRebar";
import { ColumnStruct } from "./ColumnStruct";

export class ColumnViewCross {
  protected yLeader = 0;
  protected dot: number[] = [];
  generate(
    fig: FigureContent,
    t: ColumnStruct,
    rebars: ColumnRebar
  ): CompositeItem {
    const as = rebars.info.as;
    this.yLeader = t.l - t.hTopBeam;
    this.dot = divideByCount(
      -t.w / 2 + as,
      t.w / 2 - as,
      rebars.along.singleCount + 1
    );

    const comp = new CompositeItem();
    this.corner(fig, comp, t, rebars);
    this.cross(fig, comp, t, rebars);
    this.stir(fig, comp, t, rebars);
    return comp;
  }
  protected corner(
    fig: FigureContent,
    comp: CompositeItem,
    t: ColumnStruct,
    rebars: ColumnRebar
  ): void {
    this.yLeader -= 3 * fig.h;
    const bar = rebars.corner;
    const as = rebars.info.as;
    comp.push(
      fig
        .planeRebar()
        .rebar(
          new Polyline(-t.w / 2 + as, t.l - as)
            .lineBy(0, -t.l + as - t.ld + as)
            .lineBy(-300, 0),
          new Polyline(t.w / 2 - as, t.l - as)
            .lineBy(0, -t.l + as - t.ld + as)
            .lineBy(300, 0)
        )
        .spec(bar.spec, 2)
        .leaderNote(vec(-t.w / 2 - fig.h, this.yLeader), vec(1, 0))
        .generate()
    );
  }
  protected cross(
    fig: FigureContent,
    comp: CompositeItem,
    t: ColumnStruct,
    rebars: ColumnRebar
  ): void {
    this.yLeader -= 3 * fig.h;
    const bar = rebars.along;
    const as = rebars.info.as;
    const xs = divideByCount(
      -t.w / 2 + as,
      t.w / 2 - as,
      bar.singleCount + 1
    ).slice(1, -1);
    comp.push(
      fig
        .planeRebar()
        .rebar(...xs.map((x) => new Line(vec(x, t.l - as), vec(x, -t.ld + as))))
        .spec(bar.spec, bar.singleCount)
        .leaderNote(vec(-t.w / 2 - fig.h, this.yLeader), vec(1, 0))
        .generate()
    );
  }
  protected stir(
    fig: FigureContent,
    comp: CompositeItem,
    t: ColumnStruct,
    rebars: ColumnRebar
  ): void {
    const bar = rebars.stir;
    const as = rebars.info.as;
    const ys = bar.pos(t);

    const x0 = -t.w / 2 + as;
    const x1 = -x0;
    const lines = ys.map((y) => new Line(vec(x0, y), vec(x1, y)));
    const x = sum(...this.dot.slice(0, 2)) / 2;
    comp.push(
      fig
        .planeRebar()
        .rebar(...lines)
        .spec(bar.spec, ys.length)
        .mulSpec(...rebars.stir.specCross, ...rebars.stir.specAlong)
        .leaderNote(vec(x, t.l + 2 * fig.h), vec(0, -1), vec(-1, 0))
        .generate()
    );
  }
}
