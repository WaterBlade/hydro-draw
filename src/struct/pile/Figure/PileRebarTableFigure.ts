import { BorderBuilder, Circle, Content, RebarSpec, TableBuilder, Text, TextAlign, vec } from "@/draw";
import { FigureInBorder } from "@/struct/utils";
import { Pile } from "../Basic/PileStruct";

export class PileRebarTableFigure implements FigureInBorder{
  protected table = new TableBuilder();

  constructor(pile: Pile, rebarSpecs: RebarSpec[]){
    const t = this.table;
    const h = (this.table.textHeight / 3.5) * 5;
    t.setWidth(0, 6*h);
    t.cell(0, 0).text('桩特性');
    const cell = t.cell(1, 0, 5)
      .text(`编号：${pile.id}`)
      .text(`数量：${pile.count}`)
      .text(`桩顶：${pile.top.toFixed(3)}m`)
      .text(`桩底：${pile.bottom.toFixed(3)}m`)
      .text(`桩长：${(pile.top - pile.bottom).toFixed(3)}m`)
    
    if(pile.load !== 0){
      cell
        .text('设计桩顶荷载：')
        .text(`${pile.load.toFixed(0)}kN`)
    }

    let k = 1;
    t.cell(0, k).text("钢筋编号");
    t.setWidth(k++, 4 * h);
    t.cell(0, k).text("直径(mm)");
    t.setWidth(k++, 4 * h);
    t.cell(0, k).text("型式");
    t.setWidth(k++, 10 * h);
    t.cell(0, k).text("单根长(mm)");
    t.setWidth(k++, 4 * h);
    t.cell(0, k).text("根数");
    t.setWidth(k++, 4 * h);
    t.cell(0, k).text("总长(m)");
    t.setWidth(k, 4 * h);

    for (let i = 0; i < rebarSpecs.length; i++) {
      const spec = rebarSpecs[i];
      const row = i + 1;
      let k = 1
      t.cell(row, k++).push(...this.genId(spec.id));
      t.cell(row, k++).text(
        new Content().special(spec.grade).text(`${spec.diameter}`)
      );
      t.cell(row, k++).push(spec.form.generate());
      t.cell(row, k++).text(`${spec.length.toFixed(0)}`);
      t.cell(row, k++).text(`${spec.count}`);
      t.cell(row, k++).text(`${spec.totalLength.toFixed(2)}`);
    }

  }

  protected genId(id: string): [Circle, Text] {
    return [
      new Circle(vec(0, 0), this.table.textHeight),
      new Text(id, vec(0, 0), this.table.textHeight, TextAlign.MiddleCenter),
    ];
  }

  pushTo(border: BorderBuilder): this {
    border.addItem(this.table.generate(), 1, 1);
    return this;
  }
}