
import { Line, RebarFormPreset, Side, vec } from "@/draw";
import { Figure, SpaceGen } from "@/struct/utils";
import { Component } from "../Component";
import { Column, ColumnRebar } from "./Column";

export class Along extends Component<Column, ColumnRebar>{
  buildSpec(colCount: number): this{
    const t = this.struct;
    const bar = this.specs.along;
    const form = RebarFormPreset
      .SShape(bar.diameter, 500, t.l + t.ld - this.specs.as * 2, 300, 7)
      .text('柱顶', Side.Left, true)
      .text('柱底', Side.Right, true);
    bar.setCount(bar.singleCount * colCount).setForm(form).setId(this.specs.id.gen()).setStructure(this.name);
    this.specs.record(bar);
    return this;
  }
  buildPos(sectFigure: Figure): void{
    const t = this.struct;
    const bar = this.specs.along;
    const as = this.specs.as;
    const pos = this.genPos();
    bar.pos.along.dot(...pos);
    bar.pos.sCol.dot(-t.h/2+as+sectFigure.r, ...this.genDividedLine(0, sectFigure.r).points.map(p=>p.y), t.h/2-as-sectFigure.r);
  }
  protected genPos(): number[]{
    return this.genDividedLine().points.map(p => p.y);
  }
  protected genDividedLine(x = 0, r=0): Line{
    const t = this.struct;
    const as = this.specs.as;
    const bar = this.specs.along;
    return new Line(vec(x, -t.h/2+as+r), vec(x, t.h/2-as-r)).divideByCount(bar.singleCount+1).removeBothPt();
  }
  drawAlongView(fig: Figure, pos: SpaceGen, x0: number, isMirror = false): void{
    const space = pos.findR(3*fig.h);
    if(space){
      const y = this.specs.stir.pos.find(space.mid);
      const t = this.struct;
      const bar = this.specs.along;
      const as = this.specs.as;
      const xs = this.genPos();
      const rebar = fig.planeRebar()
          .rebar(...xs.map(x => new Line(vec(x0+x, t.l - as), vec(x0+x, -t.ld + as)))
          ).spec(bar, bar.singleCount).leaderNote(vec(-t.h / 2 - fig.h, y), vec(1, 0)).generate();
      if(isMirror){
        fig.push(rebar.mirrorByVAxis());
      }else{
        fig.push(rebar);
      }
    }
  }
  drawSect(fig: Figure): void{
    const t = this.struct;
    const bar = this.specs.along;
    const as = this.specs.as;
    const left = fig.linePointRebar()
      .line(this.genDividedLine(-t.w/2+as+fig.r, fig.r))
      .spec(bar, bar.singleCount)
      .offset(2*Math.max(as,fig.h))
      .onlineNote().generate();
    const right = left.mirrorByVAxis();
    fig.push(left, right);
  }
}