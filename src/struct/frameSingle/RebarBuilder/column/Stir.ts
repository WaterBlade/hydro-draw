
import { last, Line, Polyline, RebarDraw, RebarFormPreset, UnitRebarSpec, vec } from "@/draw";
import { RebarBase } from "../../Base";

export class Stir extends RebarBase{
  hStirs: UnitRebarSpec[] = [];
  vStirs: UnitRebarSpec[] = [];
  buildSpec(): this{
    const t = this.struct;
    const bar = this.specs.column.stir;
    const as = this.specs.as;
    const form = RebarFormPreset.RectStir(
      bar.diameter, t.col.w - 2* as, t.col.h - 2*as 
    );
    const count = this.genMulColYPos().length * 2;
    bar.setCount(count).setForm(form).setId(this.specs.id.gen()).setStructure(this.name);
    this.specs.record(bar);
    this.buildHStir();
    this.buildVStir();
    return this;
  }
  protected buildHStir(): void{
    const t = this.struct;
    const as = this.specs.as;
    const colBar = this.specs.column
    const count = colBar.along.singleCount;
    const h = (t.col.h - 2*as-colBar.corner.diameter) / (count+1) + colBar.along.diameter;
    const w = t.col.w - 2*as;
    const preBar = colBar.stir;
    const bar = new UnitRebarSpec();
    bar
      .set(preBar.grade, preBar.diameter)
      .setCount(preBar.count * Math.floor(count / 2))
      .setForm(RebarFormPreset.RectStir(preBar.diameter, h, w))
      .setId(this.specs.id.gen())
      .setStructure(this.name);
    this.hStirs.push(bar);
    this.specs.record(bar);
    if(count % 2 === 1){
      const bar = new UnitRebarSpec();
      bar
        .set(preBar.grade, preBar.diameter)
        .setCount(preBar.count)
        .setForm(RebarFormPreset.HookLine(preBar.diameter, w, 4))
        .setId(this.specs.id.gen())
        .setStructure(this.name);
      this.hStirs.push(bar);
      this.specs.record(bar);
    }
  }
  protected buildVStir(): void{
    const t = this.struct;
    const as = this.specs.as;
    const colBar = this.specs.column
    const count = colBar.cross.singleCount;
    const h = (t.col.w - 2*as-colBar.corner.diameter) / (count+1) + colBar.cross.diameter;
    const w = t.col.h - 2*as;
    const preBar = colBar.stir;
    const bar = new UnitRebarSpec();
    bar
      .set(preBar.grade, preBar.diameter)
      .setCount(preBar.count * Math.floor(count / 2))
      .setForm(RebarFormPreset.RectStir(preBar.diameter, h, w))
      .setId(this.specs.id.gen())
      .setStructure(this.name);
    this.vStirs.push(bar);
    this.specs.record(bar);
    if(count % 2 === 1){
      const bar = new UnitRebarSpec();
      bar
        .set(preBar.grade, preBar.diameter)
        .setCount(preBar.count)
        .setForm(RebarFormPreset.HookLine(preBar.diameter, w, 4))
        .setId(this.specs.id.gen())
        .setStructure(this.name);
      this.vStirs.push(bar);
      this.specs.record(bar);
    }

  }
  buildPos(): this{
    const pos = this.genMulColYPos().reverse();
    const bar = this.specs.column.stir;
    bar.pos.dot(...pos);
    return this;
  }
  buildFigure(): this{
    this.drawCross();
    this.drawAlong();
    this.drawSCol();
    this.drawSColHStir();
    this.drawSColVStir();
    return this;
  }
  protected genMulColYPos(): number[]{
    const res: number[] = [];
    const t = this.struct;
    const bar = this.specs.column.stir;
    const as = this.specs.as;
    const spaces = t.calcColStirSpace();
    let h = t.h - as;
    const count = spaces.length;
    for(let i = 0; i < count; i++){
      const l = i === 0 ? spaces[i]-as : spaces[i];
      // bottom space;
      const d = i === count - 1 ? 50 : 0;
      const s = i % 2 === 0 ? bar.denseSpace : bar.space;
      const line = new Line(vec(0, h), vec(0, h-l+d)).divide(s);
      if(i % 2 === 1){
        line.removeBothPt();
      }
      h -= l;
      res.push(
        ...line.points.map(p => p.y)
      );
    }
    return res;
  }
  protected drawCross(): void{
    const t = this.struct;
    const bar = this.specs.column.stir;
    const as = this.specs.as;
    const fig = this.figures.cross;
    const ys = this.genMulColYPos();

    const x0 = -t.w/2+as;
    const x1 = -t.hsn/2-as;
    const left = ys.map(
      y => new Line(vec(x0, y), vec(x1, y))
    );
    const x = this.specs.column.cross.pos.cross.find(-t.hs/2);
    const leftRebar = fig.planeRebar()
      .rebar(...left)
      .spec(bar, ys.length)
      .mulSpec(...this.hStirs, ...this.vStirs)
      .leaderNote(vec(x, t.h+2*fig.h), vec(0, -1), vec(-1, 0))
      .generate();
    const rightRebar = leftRebar.mirrorByVAxis();
    fig.push(leftRebar, rightRebar);
  }
  protected drawAlong(): void{
    const t = this.struct;
    const bar = this.specs.column.stir;
    const as = this.specs.as;
    const fig = this.figures.along;
    const ys = this.genMulColYPos();

    const x0 = -t.col.h/2+as;
    const x1 = -x0;
    const lines = ys.map(
      y => new Line(vec(x0, y), vec(x1, y))
    );
    const x = this.specs.column.along.pos.along.find(0);
    fig.push(
      fig.planeRebar()
        .rebar(...lines)
        .spec(bar, ys.length)
        .mulSpec(...this.hStirs, ...this.vStirs)
        .leaderNote(vec(x, t.h + 2*fig.h), vec(0, -1), vec(-1, 0))
        .generate()
    );
  }
  protected drawSCol(): void{
    const t = this.struct;
    const bar = this.specs.column.stir;
    const as = this.specs.as;
    const fig = this.figures.sCol;
    const pos = this.specs.column.along.pos.sCol;
    fig.push(
      fig.planeRebar()
        .rebar(
          new Polyline(-t.col.w/2+as, t.col.h/2-as)
            .lineBy(t.col.w-2*as, 0)
            .lineBy(0, -t.col.h+2*as)
            .lineBy(-t.col.w+2*as, 0)
            .lineBy(0, t.col.h-2*as)
        )
        .spec(bar)
        .leaderNote(vec(-t.col.w/2-fig.h, pos.head), vec(1, 0))
        .generate()
      );
  }
  protected drawSColHStir(): void{
    const t = this.struct;
    const as = this.specs.as;
    const fig = this.figures.sCol;
    const pos = this.specs.column.cross.pos.sCol;
    const ys = new Line(vec(0, t.col.h/2-as-fig.r), vec(0, -t.col.h/2 + as + fig.r))
      .divideByCount(this.specs.column.along.singleCount+1)
      .removeBothPt()
      .points.map(p => p.y);
    const w = t.col.w-2*as;
    const x = pos.head;
    let iStir = 0;
    if (ys.length >= 2) {
      const rebar = fig.planeRebar().spec(this.hStirs[iStir++], Math.floor(ys.length / 2))
      const h = ys[0] - ys[1] + fig.r * 2
      let i = 0;
      while (i + 1 < ys.length) {
        const path = RebarDraw.stir(h, w, fig.r);
        path.move(vec(0, (ys[i] + ys[i + 1]) / 2));
        rebar.rebar(path);
        i += 2;
      }
      fig.push(
        rebar
          .leaderNote(vec(x, t.col.h / 2 + 4 * fig.h), vec(0, 1), vec(-1, 0))
          .generate()
      );
    }
    if (ys.length % 2 === 1) {
      const path = RebarDraw.hLineHook(w, fig.r);
      path.move(vec(0, last(ys)));
      fig.push(
        fig.planeRebar()
          .rebar(path)
          .spec(this.hStirs[iStir])
          .leaderNote(vec(x, -t.col.h / 2 - 4 * fig.h), vec(0, 1), vec(-1, 0))
          .generate()
      )
    }

  }
  protected drawSColVStir(): void{
    const t = this.struct;
    const as = this.specs.as;
    const fig = this.figures.sCol;
    const pos = this.specs.column.along.pos.sCol;
    const xs = new Line(vec(-t.col.w/2+as+fig.r, 0), vec(t.col.w/2 - as - fig.r, 0))
      .divideByCount(this.specs.column.cross.singleCount+1)
      .removeBothPt()
      .points.map(p => p.x);
    const h0 = t.col.h-2*as;
    let iStir = 0;
    if (xs.length >= 2) {
      const rebar = fig.planeRebar().spec(this.vStirs[iStir++], Math.floor(xs.length / 2))
      const w0 = xs[1] - xs[0] + fig.r * 2
      let i = 0;
      while (i + 1 < xs.length) {
        const path = RebarDraw.stir(h0, w0, fig.r);
        path.move(vec((xs[i] + xs[i + 1]) / 2, 0));
        rebar.rebar(path);
        i += 2;
      }
      const y = pos.head;
      fig.push(
        rebar
          .leaderNote(vec(t.col.w / 2 + fig.h, y), vec(1, 0))
          .generate()
      );
    }
    if (xs.length % 2 === 1) {
      const path = RebarDraw.vLineHook(h0, fig.r);
      path.move(vec(last(xs), 0));
      const y = pos.tail;
      fig.push(
        fig.planeRebar()
          .rebar(path)
          .spec(this.vStirs[iStir])
          .leaderNote(vec(t.col.w / 2 + fig.h, y), vec(1, 0))
          .generate()
      )
    }
  }
}