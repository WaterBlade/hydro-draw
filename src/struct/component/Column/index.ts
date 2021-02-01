import { Column, ColumnRebar, ColumnStruct } from "./Column";
import { ColumnRebarBuilder } from "./RebarBuilder";
import { ColumnSectBuilder } from "./SectBuilder";
import { ColumnViewAlongBuilder } from "./ViewAlongBuilder";
import { ColumnViewCrossBuilder } from "./ViewCrossBuilder";

export {ColumnStruct, ColumnRebar}

export class ColumnBuilder{
  protected context;
  rebarBuilder;
  sectBuilder;
  viewAlong;
  viewCross;
  constructor(protected struct: ColumnStruct, protected rebars: ColumnRebar){
    const context = new Column(struct, rebars);
    this.rebarBuilder = new ColumnRebarBuilder(context);
    this.sectBuilder = new ColumnSectBuilder(context);
    this.viewAlong = new ColumnViewAlongBuilder(context);
    this.viewCross = new ColumnViewCrossBuilder(context);
    this.context = context;
  }
  init(l: number, ld: number, n: number, lSpace: number, hTopBeam: number, hBeam: number, as: number): void{
    const t = this.struct;
    t.l = l;
    t.ld = ld;
    t.n = n;
    t.lSpace = lSpace;
    t.hTopBeam = hTopBeam;
    t.hBeam = hBeam;
    this.rebars.as = as;
  }
}