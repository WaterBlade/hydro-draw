
import { Line, RebarFormPreset, Side, vec } from "@/draw";
import { RebarBase } from "../../Base";

export class Cross extends RebarBase{
  buildSpec(): this{
    const t = this.struct;
    const bar = this.specs.column.cross;
    const form = RebarFormPreset
      .SShape(bar.diameter, 500, t.h + t.found.hn - this.specs.as * 2, 300, 7)
      .text('柱顶', Side.Left, true)
      .text('柱底', Side.Right, true);
    bar.setCount(bar.singleCount * 4).setForm(form).setId(this.specs.id.gen()).setStructure(this.name);
    this.specs.record(bar);
    return this;
  }
  buildPos(): this{
    const t = this.struct;
    const as = this.specs.as;
    const bar = this.specs.column.cross;
    const pos = this.genPos();
    bar.pos.cross.dot(...pos);
    const r = this.figures.sCol.r;
    bar.pos.sCol.dot(-t.col.w/2+as+r, ...this.genDividedLine(0, r).points.map(p=>p.x), t.col.w/2-as-r);
    return this;
  }
  buildFigure(): this{
    this.drawCross();
    this.drawSCol();
    return this;
  }
  protected genPos(): number[]{
    const xc = -this.struct.hs/2
    return this.genDividedLine().points.map(p => p.x+xc);
  }
  protected genDividedLine(y = 0, r=0): Line{
    const t = this.struct;
    const as = this.specs.as;
    const bar = this.specs.column.along;
    return new Line(
      vec(-t.col.w / 2 + as + r, y),
      vec(t.col.w / 2 - as - r, y)
    ).divideByCount(bar.singleCount + 1).removeBothPt()
  }
  protected drawCross(): void{
    const fig = this.figures.cross;
    const space = fig.pos.v.findR(3*fig.h);
    if(space){
      const t = this.struct;
      const bar = this.specs.column.cross;
      const as = this.specs.as;
      const y = this.specs.column.stir.pos.find(space.mid);
      const xs = this.genPos();
      const left = fig.planeRebar()
        .rebar(...xs.map(x => new Line(vec(x, t.h - as), vec(x, -t.found.hn + as)))
        ).spec(bar, bar.singleCount).leaderNote(vec(-t.w / 2 - fig.h, y), vec(1, 0)).generate();
      const right = left.mirrorByVAxis();
      fig.push(left, right);
    }
  }
  protected drawSCol(): void{
    const t = this.struct;
    const bar = this.specs.column.cross;
    const as = this.specs.as;
    const fig = this.figures.sCol;
    fig.push(
      fig.linePointRebar()
        .line(
          this.genDividedLine(t.col.h/2-as-fig.r, fig.r)
        )
        .spec(bar, bar.singleCount)
        .offset(2 * Math.max(as, fig.h))
        .onlineNote().generate(),
      fig.linePointRebar()
        .line(
          this.genDividedLine(-t.col.h/2+as+fig.r, fig.r)
        )
        .spec(bar, bar.singleCount)
        .offset(2 * Math.max(as, fig.h), Side.Right)
        .onlineNote().generate(),
      );
  }
}