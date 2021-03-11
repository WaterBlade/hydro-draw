import {
  Builder,
  DrawItem,
  RebarSpec,
  TableBuilder,
} from "@/draw";
import { PileStruct } from "./PileStruct";

export class PileRebarTable implements Builder<DrawItem> {
  protected table = new TableBuilder();

  protected rowId = 0;

  protected headExist = false;
  push(p: PileStruct, specs: RebarSpec[]): void{
    if(!this.headExist){
      this.buildHead(specs);
      this.headExist = true;
    }
    this.buildRow(p, specs);
  }

  protected buildHead(specs: RebarSpec[]): void{
    const t = this.table;
    t.title('桩基础特性表')
    const h = t.unitSize;
    let colId = 0;
    t.setWidth(colId, 4*h).cell(0, colId++, 3).text('桩编号');
    t.setWidth(colId, 3*h).cell(0, colId++, 3).text('数量');
    t.setWidth(colId, 4*h).cell(0, colId++, 3).text('单桩竖向').text('承载力').text('特征值(kN)');
    t.setWidth(colId, 4*h).cell(0, colId++, 3).text('设计').text('桩顶').text('高程(m)');
    t.setWidth(colId, 4*h).cell(0, colId++, 3).text('设计').text('桩底').text('高程(m)');
    t.setWidth(colId, 4*h).cell(0, colId++, 3).text('桩长').text('H(m)');

    
    for(let rebarId = 0; rebarId < specs.length; rebarId ++){
      t.cell(0, colId, 1, 3).push(...specs[rebarId].genIdSpec(t.textHeight));
      t.cell(1, colId, 1, 3).push(specs[rebarId].form.generate());
      t.setWidth(colId, 4 * h).cell(2, colId++).text('单根长(mm)');
      t.setWidth(colId, 3 * h).cell(2, colId++).text('根数');
      t.setWidth(colId, 4 * h).cell(2, colId++).text('总长(m)');
    }
    this.rowId = 3;
  }

  protected buildRow(p: PileStruct, specs: RebarSpec[]): void{
    let colId = 0;
    const t = this.table;
    const r = this.rowId;
    t.cell(r, colId++).text(p.id);
    t.cell(r, colId++).text(`${p.count}`);
    t.cell(r, colId++).text(`${p.load ? p.load.toFixed(0) : '-'}`);
    t.cell(r, colId++).text(`${p.top}`);
    t.cell(r, colId++).text(`${p.bottom}`);
    t.cell(r, colId++).text(`${(p.top - p.bottom).toFixed(2)}`);
    for(const spec of specs){
      t.cell(r, colId++).text(`${spec.length.toFixed(0)}`);
      t.cell(r, colId++).text(`${spec.count}`);
      t.cell(r, colId++).text(`${spec.totalLength.toFixed(2)}`);
    }
    this.rowId++;
  }


  generate(): DrawItem {
    return this.table.generate();
  }
}
