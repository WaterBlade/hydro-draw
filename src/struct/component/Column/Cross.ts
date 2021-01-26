
import { Line, RebarFormPreset, Side, vec } from "@/draw";
import { Figure, SpaceGen } from "@/struct/utils";
import { Component } from "../Component";
import { Column, ColumnRebar } from "./Column";

export class Cross extends Component<Column, ColumnRebar>{
  buildSpec(colCount: number): this{
    const t = this.struct;
    const bar = this.specs.cross;
    const form = RebarFormPreset
      .SShape(bar.diameter, 500, t.l + t.ld - this.specs.as * 2, 300, 7)
      .text('柱顶', Side.Left, true)
      .text('柱底', Side.Right, true);
    bar.setCount(bar.singleCount * colCount).setForm(form).setId(this.specs.id.gen()).setStructure(this.name);
    this.specs.record(bar);
    return this;
  }
  buildPos(sectFig: Figure): this{
    const t = this.struct;
    const as = this.specs.as;
    const bar = this.specs.cross;
    const pos = this.genPos();
    bar.pos.cross.dot(...pos);
    const r = sectFig.r;
    bar.pos.sCol.dot(-t.w/2+as+r, ...this.genDividedLine(0, r).points.map(p=>p.x), t.w/2-as-r);
    return this;
  }
  protected genPos(): number[]{
    return this.genDividedLine().points.map(p => p.x);
  }
  protected genDividedLine(y = 0, r=0): Line{
    const t = this.struct;
    const as = this.specs.as;
    const bar = this.specs.cross;
    return new Line(
      vec(-t.w / 2 + as + r, y),
      vec(t.w / 2 - as - r, y)
    ).divideByCount(bar.singleCount + 1).removeBothPt()
  }
  drawCrossView(fig: Figure, pos: SpaceGen, x0: number, isMirror = false): void{
    const space = pos.findR(3*fig.h);
    if(space){
      const t = this.struct;
      const bar = this.specs.cross;
      const as = this.specs.as;
      const y = this.specs.stir.pos.find(space.mid);
      const xs = this.genPos();
      const rebar = fig.planeRebar()
        .rebar(...xs.map(x => new Line(vec(x, t.l - as), vec(x, -t.ld + as)))
        ).spec(bar, bar.singleCount).leaderNote(vec(-t.w / 2 - fig.h, y), vec(1, 0)).generate();
      if(isMirror){
        fig.push(rebar.mirrorByVAxis());
      }else{
        fig.push(rebar);
      }
    }
  }
  drawSect(fig: Figure): void{
    const t = this.struct;
    const bar = this.specs.cross;
    const as = this.specs.as;
    fig.push(
      fig.linePointRebar()
        .line(
          this.genDividedLine(t.h/2-as-fig.r, fig.r)
        )
        .spec(bar, bar.singleCount)
        .offset(2 * Math.max(as, fig.h))
        .onlineNote().generate(),
      fig.linePointRebar()
        .line(
          this.genDividedLine(-t.h/2+as+fig.r, fig.r)
        )
        .spec(bar, bar.singleCount)
        .offset(2 * Math.max(as, fig.h), Side.Right)
        .onlineNote().generate(),
      );
  }
}