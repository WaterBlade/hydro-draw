import { CodeItem, GroupCode } from "../../GroupCode";
import { HandleGenerator } from "../../Handle";

export class ViewTable implements CodeItem {
  handle: string;
  constructor(protected handleGen: HandleGenerator) {
    this.handle = handleGen.handle;
  }
  toCode(root: GroupCode): void {
    root.push(
      0,
      "TABLE",
      2,
      "VIEW",
      5,
      this.handle,
      100,
      "AcDbSymbolTable",
      70,
      0,
      0,
      "ENDTAB"
    );
  }
}
