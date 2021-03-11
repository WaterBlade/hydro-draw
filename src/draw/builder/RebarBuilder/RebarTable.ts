import { Circle, CompositeItem, TextDraw } from "@/draw/drawItem";
import { Content } from "@/draw/drawItem/Content";
import { groupBy, TextAlign, vec } from "@/draw/misc";
import { Builder } from "../Builder.interface";
import { TableBuilder } from "../TableBuilder";
import { RebarSpec } from "./RebarSpec";

export class RebarTable implements Builder<CompositeItem> {
  protected rebarSpecs: RebarSpec[] = [];
  protected textHeight = 3.5;
  constructor(...specs: RebarSpec[]) {
    this.push(...specs);
  }
  push(...specs: RebarSpec[]): this {
    this.rebarSpecs.push(...specs);
    return this;
  }
  protected _content?: string | Content;
  title(content: string | Content): this {
    this._content = content;
    return this;
  }
  generate(): CompositeItem {
    const t = new TableBuilder(this.textHeight);
    const title = this._content ? this._content : "钢 筋 表";
    t.title(title);
    const withName = this.rebarSpecs[0]
      ? this.rebarSpecs[0].name !== ""
      : false;
    const withDesp = this.rebarSpecs.some((r) => r.desp !== "");
    const start = withName ? 1 : 0;

    const h = (this.textHeight / 3.5) * 5;

    if (withName) {
      t.cell(0, 0).text("部位");
      t.setWidth(0, 2 * h);

      const labelInGroup = groupBy(this.rebarSpecs.map((r) => r.name));
      let row = 1;
      for (const group of labelInGroup) {
        const len = group.length;
        t.cell(row, 0, len).text(group[0]);
        row += len;
      }
    }
    t.cell(0, start + 0).text("编号");
    t.setWidth(start + 0, 4 * h);
    t.cell(0, start + 1).text("直径(mm)");
    t.setWidth(start + 1, 4 * h);
    t.cell(0, start + 2).text("型式");
    t.setWidth(start + 2, 10 * h);
    t.cell(0, start + 3).text("单根长(mm)");
    t.setWidth(start + 3, 4 * h);
    t.cell(0, start + 4).text("根数");
    t.setWidth(start + 4, 4 * h);
    t.cell(0, start + 5).text("总长(m)");
    t.setWidth(start + 5, 4 * h);

    if (withDesp) {
      t.cell(0, start + 6).text("备注");
      t.setWidth(start + 6, 6 * h);
    }

    for (let i = 0; i < this.rebarSpecs.length; i++) {
      const spec = this.rebarSpecs[i];
      const row = i + 1;
      t.cell(row, start + 0).push(...this.genId(spec.id));
      t.cell(row, start + 1).text(
        new Content().special(spec.grade).text(`${spec.diameter}`)
      );
      t.cell(row, start + 2).push(spec.form.generate());
      t.cell(row, start + 3).text(`${spec.length.toFixed(0)}`);
      t.cell(row, start + 4).text(`${spec.count}`);
      t.cell(row, start + 5).text(`${spec.totalLength.toFixed(2)}`);
      if (spec.desp !== "") {
        t.cell(row, start + 6).text(spec.desp);
      }
    }

    return t.generate();
  }
  protected genId(id: string): [Circle, TextDraw] {
    return [
      new Circle(vec(0, 0), this.textHeight),
      new TextDraw(id, vec(0, 0), this.textHeight, TextAlign.MiddleCenter),
    ];
  }
}
