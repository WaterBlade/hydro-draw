
import { Line, RebarFormPreset, Side, vec } from "@/draw";
import { RebarBase } from "../../Base";

export class Along extends RebarBase{
  buildSpec(): this{
    const t = this.struct;
    const bar = this.specs.column.along;
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
    const bar = this.specs.column.along;
    const as = this.specs.as;
    const pos = this.genPos();
    bar.pos.along.dot(...pos);
    const fig = this.figures.sCol;
    bar.pos.sCol.dot(-t.col.h/2+as+fig.r, ...this.genDividedLine(0, fig.r).points.map(p=>p.y), t.col.h/2-as-fig.r);
    return this;
  }
  buildFigure(): this{
    this.drawAlong();
    this.drawSCol();
    return this;
  }
  protected genPos(): number[]{
    return this.genDividedLine().points.map(p => p.y);
  }
  protected genDividedLine(x = 0, r=0): Line{
    const t = this.struct;
    const as = this.specs.as;
    const bar = this.specs.column.along;
    return new Line(vec(x, -t.col.h/2+as+r), vec(x, t.col.h/2-as-r)).divideByCount(bar.singleCount+1).removeBothPt();
  }
  protected drawAlong(): void{
    const fig = this.figures.along;
    const space = fig.pos.v.findR(3*fig.h);
    if(space){
      const y = this.specs.column.stir.pos.find(space.mid);
      const t = this.struct;
      const bar = this.specs.column.along;
      const as = this.specs.as;
      const xs = this.genPos();
      fig.push(
        fig.planeRebar()
          .rebar(...xs.map(x => new Line(vec(x, t.h - as), vec(x, -t.found.hn + as)))
          ).spec(bar, bar.singleCount).leaderNote(vec(-t.col.h / 2 - fig.h, y), vec(1, 0)).generate()
      );
    }
  }
  protected drawSCol(): void{
    const t = this.struct;
    const bar = this.specs.column.along;
    const as = this.specs.as;
    const fig = this.figures.sCol;
    const left = fig.linePointRebar()
      .line(this.genDividedLine(-t.col.w/2+as+fig.r, fig.r))
      .spec(bar, bar.singleCount)
      .offset(2*Math.max(as,fig.h))
      .onlineNote().generate();
    const right = left.mirrorByVAxis();
    fig.push(left, right);
  }
}