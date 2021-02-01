import { CompositeItem, divideByCount, Line, Polyline, sum, vec } from "@/draw";
import { Figure } from "@/struct/utils";
import { ColumnContext } from "./Column";

export class ColumnViewCrossBuilder extends ColumnContext{
  protected yLeader = 0;
  protected dot: number[] = [];
  generate(fig: Figure): CompositeItem{
    const t = this.struct;
    const as = this.rebars.as;
    this.yLeader = t.l - t.hTopBeam;
    this.dot = divideByCount(-t.w/2+as, t.w/2-as, this.rebars.along.singleCount + 1);

    const comp = new CompositeItem();
    this.corner(fig, comp);
    this.cross(fig, comp);
    this.stir(fig, comp);
    return comp;
  }
  protected corner(fig: Figure, comp: CompositeItem): void{
    const t = this.struct;
    this.yLeader -= 3*fig.h;
    const bar = this.rebars.corner;
    const as = this.rebars.as;
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
        .spec(bar, 2)
        .leaderNote(vec(-t.w / 2 - fig.h, this.yLeader), vec(1, 0))
        .generate()
    );
  }
  protected cross(fig: Figure, comp: CompositeItem): void{
    this.yLeader -= 3*fig.h;
    const t = this.struct;
    const bar = this.rebars.along;
    const as = this.rebars.as;
    const xs = divideByCount(-t.w/2+as, t.w/2-as, bar.singleCount + 1).slice(1, -1);
    comp.push(
      fig
        .planeRebar()
        .rebar(
          ...xs.map(
            (x) => new Line(vec(x, t.l - as), vec(x, -t.ld + as))
          )
        )
        .spec(bar, bar.singleCount)
        .leaderNote(vec(-t.w / 2 - fig.h, this.yLeader), vec(1, 0))
        .generate()
    );
  }
  protected stir(fig: Figure, comp: CompositeItem): void{
    const t = this.struct;
    const bar = this.rebars.stir;
    const as = this.rebars.as;
    const ys = this.pos.stir();

    const x0 = -t.w / 2 + as;
    const x1 = -x0;
    const lines = ys.map((y) => new Line(vec(x0, y), vec(x1, y)));
    const x = sum(...this.dot.slice(0, 2)) / 2;
    comp.push(
      fig
        .planeRebar()
        .rebar(...lines)
        .spec(bar, ys.length)
        .mulSpec(...this.rebars.stirCross, ...this.rebars.stirAlong)
        .leaderNote(vec(x, t.l + 2 * fig.h), vec(0, -1), vec(-1, 0))
        .generate()
    );
  }
}