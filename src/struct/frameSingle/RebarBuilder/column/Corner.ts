
import { Polyline, RebarFormPreset, Side, vec } from "@/draw";
import { RebarBase } from "../../Base";

export class Corner extends RebarBase{
  buildSpec(): this{
    const t = this.struct;
    const bar = this.specs.column.corner;
    const form = RebarFormPreset
      .SShape(bar.diameter, 500, t.h + t.found.hn - this.specs.as * 2, 300, 7)
      .text('柱顶', Side.Left, true)
      .text('柱底', Side.Right, true);
    bar.setCount(8).setForm(form).setId(this.specs.id.gen()).setStructure(this.name);
    this.specs.record(bar);
    return this;
  }
  buildFigure(): this{
    this.drawCross();
    this.drawAlong();
    this.drawSCol();
    return this;
  }
  protected drawCross(): void{
    const fig = this.figures.cross;
    const space = fig.pos.v.findR(3*fig.h);
    const pos = this.specs.column.stir.pos;
    if(space){
      const y = pos.find(space.mid);
      const t = this.struct;
      const bar = this.specs.column.corner;
      const as = this.specs.as;
      const left = fig.planeRebar()
        .rebar(
          new Polyline(-t.w / 2 + as, t.h - as).lineBy(0, -t.h + as - t.found.hn + as).lineBy(-500, 0),
          new Polyline(-t.hsn / 2 - as, t.h - as).lineBy(0, -t.h + as - t.found.hn + as).lineBy(500, 0),
        ).spec(bar, 2).leaderNote(vec(-t.w / 2 - fig.h, y), vec(1, 0)).generate();
      const right = left.mirrorByVAxis();
      fig.push(left, right);
    }
  }
  protected drawAlong(): void{
    const fig = this.figures.along;
    const pos = this.specs.column.stir.pos;
    const space = fig.pos.v.findR(3*fig.h);
    if(space){
      const y = pos.find(space.mid);
      const t = this.struct;
      const bar = this.specs.column.corner;
      const as = this.specs.as;
      fig.push(
        fig.planeRebar()
          .rebar(
            new Polyline(-t.col.h / 2 + as, t.h - as).lineBy(0, -t.h + as - t.found.hn + as).lineBy(-300, 0),
            new Polyline(t.col.h / 2 - as, t.h - as).lineBy(0, -t.h + as - t.found.hn + as).lineBy(300, 0),
          ).spec(bar, 2).leaderNote(vec(-t.col.h / 2 - fig.h, y), vec(1, 0)).generate()
      );
    }
  }
  protected drawSCol(): void{
    const t = this.struct;
    const bar = this.specs.column.corner;
    const as = this.specs.as;
    const fig = this.figures.sCol;
    const left = [
      fig.sparsePointRebar()
        .points(vec(-t.col.w/2+as+fig.r, t.col.h/2-as-fig.r))
        .spec(bar)
        .parallelLeader(vec(-t.col.w/2-fig.h, t.col.h/2 + fig.h), vec(1, 0))
        .generate(),
      fig.sparsePointRebar()
        .points(vec(-t.col.w/2+as+fig.r, -t.col.h/2+as+fig.r))
        .spec(bar)
        .parallelLeader(vec(-t.col.w/2-fig.h, -t.col.h/2 - fig.h), vec(1, 0))
        .generate(),
    ];
    const right = left.map(p => p.mirrorByVAxis());
    fig.push(...left, ...right);
  }
}