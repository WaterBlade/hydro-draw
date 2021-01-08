import { PlaneRebar, Circle, Line, LinePointRebar, Polyline, RebarPathForm, Side, SparsePointRebar, vec } from "@/draw";
import { RebarBase } from "../Base";

export class CInnerSubBar extends RebarBase {
  buildSpec(): this {
    const u = this.struct;
    const bar = this.specs.shell.cInnerSub;
    const parent = this.specs.shell.cInner;
    const id = parent.id;
    const lens = this.genShape().lengths;

    let count = 0;
    if(u.cantLeft > 0){
      count += 1;
    }else{
      count += this.specs.end.cOuter.singleCount;
    }
    if(u.cantRight > 0){
      count += 1;
    }else{
      count += this.specs.end.cOuter.singleCount;
    }
    bar
      .setGrade(parent.grade)
      .setDiameter(parent.diameter)
      .setForm(
        new RebarPathForm(bar.diameter)
          .lineBy(0, -1.6)
          .dimLength(lens[0])
          .arcBy(4, 0, 180)
          .dimArc(u.r + u.waterStop.h + u.as)
          .dimLength(lens[1])
          .lineBy(0, 1.6)
          .dimLength(lens[2])
      )
      .setCount(count)
      .setId(id + 'a')
      .setStructure(this.name);
    this.specs.record(bar);
    return this;
  }
  buildFigure(): this {
    this.drawCEnd();
    this.drawLInner();
    this.drawSEndBeam();
    this.drawSEndWall();
    return this;
  }
  protected genShape(offsetDist?: number): Polyline {
    const u = this.struct;
    const dist = offsetDist ? offsetDist : u.as;
    return new Polyline(-u.r - u.waterStop.h - 1, u.hd)
      .lineBy(1, 0)
      .lineBy(0, -u.hd)
      .arcBy(2 * u.r + 2 * u.waterStop.h, 0, 180)
      .lineBy(0, u.hd)
      .lineBy(1, 0)
      .offset(dist, Side.Right)
      .removeStart()
      .removeEnd();
  }
  protected drawCEnd(): void {
    const u = this.struct;
    const bar = this.specs.shell.cInnerSub;
    const fig = this.figures.cEnd;
    fig.push(
      new PlaneRebar(fig.textHeight)
        .rebar(this.genShape())
        .spec(bar)
        .leaderNote(vec(u.r - 2 * fig.textHeight, 0), vec(1, 0))
        .generate()
    );
  }
  protected drawLInner(): void{
    const u = this.struct;
    const bar = this.specs.shell.cInnerSub;
    const fig = this.figures.lInner;
    const r = fig.drawRadius;
    const count = this.specs.end.cOuter.singleCount;
    const y = -u.r - u.waterStop.h -u.as + r;
    const x0 = -u.len/2 + u.as + r;
    if(u.cantLeft > 0){
      fig.push(new Circle(vec(x0, y), r).thickLine());
    }else{
      fig.push(
        new LinePointRebar(fig.textHeight, fig.drawRadius)
          .line(new Line(vec(x0, y), vec(x0 + u.endSect.b -2*u.as-2*r, y)).divideByCount(count-1))
          .offset(2*fig.textHeight)
          .spec(bar, count)
          .onlineNote()
          .generate()
      )
    }
    const x1 = u.len/2 - u.as - r;
    if(u.cantRight > 0){
      fig.push(new Circle(vec(x1, y), r).thickLine());
    }else{
      fig.push(
        new LinePointRebar(fig.textHeight, fig.drawRadius)
          .line(new Line(vec(x1 - u.endSect.b +2*u.as + 2*r, y), vec(x1, y)).divideByCount(count-1))
          .offset(2*fig.textHeight)
          .spec(bar, count)
          .onlineNote()
          .generate()
      )
    }
    
  }
  protected drawSEndBeam(): void{
    const u = this.struct;
    const fig = this.figures.sEndBeam;
    const bar = this.specs.shell.cInnerSub;
    const r = fig.drawRadius;
    const y = -u.waterStop.h - u.as + r ;
    const count = this.specs.end.cOuter.singleCount;
    fig.push(
      new SparsePointRebar(fig.textHeight, r, 30)
        .points(...new Line(vec(u.as + r, y), vec(u.endSect.b - u.as - r, y)).divideByCount(count-1).points)
        .spec(bar, count)
        .parallelLeader(vec(-2*fig.textHeight, y+2*fig.textHeight + u.waterStop.h), vec(-1, 0))
        .generate()
    );
  }
  protected drawSEndWall(): void{
    const u = this.struct;
    const fig = this.figures.sEndWall;
    const bar = this.specs.shell.cInnerSub;
    const r = fig.drawRadius;
    const y = -u.waterStop.h - u.as - r ;
    const count = this.specs.end.cOuter.singleCount;
    fig.push(
      new SparsePointRebar(fig.textHeight, r, 30)
        .points(...new Line(vec(u.as + r, y), vec(u.endSect.b - u.as - r, y)).divideByCount(count-1).points)
        .spec(bar, count)
        .parallelLeader(vec(-2*fig.textHeight, y+2*fig.textHeight + u.waterStop.h), vec(-1, 0))
        .generate()
    );
  }
}
