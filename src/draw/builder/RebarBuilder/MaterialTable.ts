import { CompositeItem } from "@/draw/drawItem";
import { Content } from "@/draw/drawItem/Content";
import { RebarDiameter, sum } from "@/draw/misc";
import { Builder } from "../Builder.interface";
import { TableBuilder } from "../TableBuilder";
import { RebarSpec } from "./RebarSpec";

export class MaterialTable implements Builder<CompositeItem> {
  protected rebarSpecs: RebarSpec[] = [];
  protected textHeight = 3.5;
  protected table = new TableBuilder(this.textHeight);
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
    const title = this._content ? this._content : "材 料 表";
    t.title(title);
    const h = (this.textHeight * 5) / 3.5;

    t.cell(0, 0).text("规格");
    t.setWidth(0, 6 * h);
    t.cell(0, 1).text("总长度(m)");
    t.setWidth(1, 6 * h);
    t.cell(0, 2).text("单位重(kg/m)");
    t.setWidth(2, 6 * h);
    t.cell(0, 3).text("总重(kg)");
    t.setWidth(3, 6 * h);
    t.cell(0, 4).text("合计(t)");
    t.setWidth(4, 6 * h);

    let totalWeight = 0;
    const specGroups = this.groupByDiameter();
    for (let i = 0; i < specGroups.length; i++) {
      const specGroup = specGroups[i];
      const spec = specGroup[0];
      const u = this.genUnitWeight(spec.diameter);
      const l = sum(...specGroup.map((s) => s.totalLength));
      const w = u * l;
      totalWeight += w;

      const row = i + 1;
      t.cell(row, 0).text(
        new Content().special(spec.grade).text(`${spec.diameter}`)
      );
      t.cell(row, 1).text(`${l.toFixed(2)}`);
      t.cell(row, 2).text(`${u.toFixed(3)}`);
      t.cell(row, 3).text(`${w.toFixed(2)}`);
    }
    t.cell(1, 4, specGroups.length).text(`${(totalWeight * 0.001).toFixed(3)}`);
    return t.generate();
  }

  protected genUnitWeight(dia: RebarDiameter): number {
    switch (dia) {
      case 6:
        return 0.222;
      case 6.5:
        return 0.26;
      case 8:
        return 0.395;
      case 10:
        return 0.617;
      case 12:
        return 0.888;
      case 14:
        return 1.21;
      case 16:
        return 1.58;
      case 18:
        return 2.0;
      case 20:
        return 2.47;
      case 22:
        return 2.98;
      case 25:
        return 3.85;
      case 28:
        return 4.83;
      case 32:
        return 6.31;
      default:
        return 0;
    }
  }

  protected groupByDiameter(): RebarSpec[][] {
    const map = new Map<string, RebarSpec[]>();
    const sorted = this.rebarSpecs.sort(
      (left, right) => left.diameter - right.diameter
    );
    for (const spec of sorted) {
      const id = `${spec.grade}-${spec.diameter}`;
      const item = map.get(id);
      if (item) {
        item.push(spec);
      } else {
        map.set(id, [spec]);
      }
    }
    return [...map.values()];
  }
}
