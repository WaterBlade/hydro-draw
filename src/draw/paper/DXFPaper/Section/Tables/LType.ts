import { CodeItem, GroupCode } from "../../GroupCode";
import { HandleGenerator } from "../../Handle";

export class LType implements CodeItem {
  constructor(
    public name: string,
    public handle: string,
    public desc?: string,
    public data?: number[]
  ) {}
  toCode(root: GroupCode): void {
    root.push(
      0,
      "LTYPE",
      5,
      this.handle,
      100,
      "AcDbSymbolTableRecord",
      100,
      "AcDbLinetypeTableRecord",
      2,
      this.name,
      70,
      0
    );
    if (this.desc === undefined || this.data === undefined) {
      root.push(3, "", 72, 65, 73, 0, 40, 0);
    } else {
      root.push(
        3,
        this.desc,
        72,
        5,
        73,
        this.data.length,
        40,
        this.data.reduce((pre, next) => pre + next)
      );
      for (const c in this.data) {
        root.push(49, c, 74, 0);
      }
    }
  }
}

export class LTypeTable implements CodeItem {
  handle: string;
  byBlock: LType;
  byLayer: LType;
  continuous: LType;
  dashed: LType;
  center: LType;
  constructor(protected handleGen: HandleGenerator) {
    this.handle = handleGen.handle;
    this.byBlock = new LType("BYBLOCK", handleGen.handle);
    this.byLayer = new LType("BYLAYER", handleGen.handle);
    this.continuous = new LType("CONTINUOUS", handleGen.handle);
    this.dashed = new LType(
      "DASHED",
      handleGen.handle,
      "Dashed __ __ __ __ __ __ __ __ __ __ __ __ __ _",
      [0.5, -0.25]
    );
    this.center = new LType(
      "CENTER",
      handleGen.handle,
      "Center ____ _ ____ _ ____ _ ____ _ ____ _ ____",
      [1.25, -0.25, 0.25, -0.25]
    );
  }
  toCode(root: GroupCode): void {
    root.push(
      0,
      "TABLE",
      2,
      "LTYPE",
      5,
      this.handle,
      100,
      "AcDbSymbolTable",
      70,
      0
    );
    this.byBlock.toCode(root);
    this.byLayer.toCode(root);
    this.continuous.toCode(root);
    this.dashed.toCode(root);
    this.center.toCode(root);
    root.push(0, "ENDTAB");
  }
}
