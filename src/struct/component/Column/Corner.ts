import { Polyline, RebarFormPreset, Side, vec } from "@/draw";
import { Figure, SpaceGen } from "@/struct/utils";
import { Component } from "../Component";
import { Column, ColumnRebar } from "./Column";

export class Corner extends Component<Column, ColumnRebar>{
  buildSpec(colCount: number): this{
    const t = this.struct;
    const bar = this.specs.corner;
    const form = RebarFormPreset
      .SShape(bar.diameter, 500, t.l + t.ld - this.specs.as * 2, 300, 7)
      .text('柱顶', Side.Left, true)
      .text('柱底', Side.Right, true);
    bar.setCount(4*colCount).setForm(form).setId(this.specs.id.gen()).setStructure(this.name);
    this.specs.record(bar);
    return this;
  }
  drawCrossView(fig: Figure, spaceGen: SpaceGen, x0: number, isMirror = false): void{
    const space = spaceGen.findR(3*fig.h);
    const pos = this.specs.stir.pos;
    if(space){
      const y = pos.find(space.mid);
      const t = this.struct;
      const bar = this.specs.corner;
      const as = this.specs.as;
      const rebar = fig.planeRebar()
        .rebar(
          new Polyline(x0-t.w / 2 + as, t.l - as).lineBy(0, -t.l + as - t.ld + as).lineBy(-500, 0),
          new Polyline(x0+t.w/2 - as, t.l - as).lineBy(0, -t.l + as - t.ld + as).lineBy(500, 0),
        ).spec(bar, 2).leaderNote(vec(-t.w / 2 - fig.h, y), vec(1, 0)).generate();
      if(isMirror){
        fig.push(rebar.mirrorByVAxis());
      }else{
        fig.push(rebar);
      }
    }
  }
  drawAlongView(fig: Figure, spaceGen: SpaceGen, x0: number, isMirror = false): void{
    const pos = this.specs.stir.pos;
    const space = spaceGen.findR(3*fig.h);
    if(space){
      const y = pos.find(space.mid);
      const t = this.struct;
      const bar = this.specs.corner;
      const as = this.specs.as;
      const rebar = 
        fig.planeRebar()
          .rebar(
            new Polyline(-t.h / 2 + as, t.h - as).lineBy(0, -t.l + as - t.ld + as).lineBy(-300, 0),
            new Polyline(t.h / 2 - as, t.h - as).lineBy(0, -t.l + as - t.ld + as).lineBy(300, 0),
          ).spec(bar, 2).leaderNote(vec(-t.h / 2 - fig.h, y), vec(1, 0)).generate()
      if(isMirror){
        fig.push(rebar.mirrorByVAxis());
      }else{
        fig.push(rebar);
      }
    }
  }
  drawSect(fig: Figure): void{
    const t = this.struct;
    const bar = this.specs.corner;
    const as = this.specs.as;
    const left = [
      fig.sparsePointRebar()
        .points(vec(-t.w/2+as+fig.r, t.h/2-as-fig.r))
        .spec(bar)
        .parallelLeader(vec(-t.w/2-fig.h, t.h/2 + fig.h), vec(1, 0))
        .generate(),
      fig.sparsePointRebar()
        .points(vec(-t.w/2+as+fig.r, -t.h/2+as+fig.r))
        .spec(bar)
        .parallelLeader(vec(-t.w/2-fig.h, -t.h/2 - fig.h), vec(1, 0))
        .generate(),
    ];
    const right = left.map(p => p.mirrorByVAxis());
    fig.push(...left, ...right);
  }
}