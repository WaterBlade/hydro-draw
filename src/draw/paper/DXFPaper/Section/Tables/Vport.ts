import { CodeItem, GroupCode } from "../../GroupCode";
import { HandleGenerator } from "../../Handle";

export class VPortTable implements CodeItem{
  handle: string;
  constructor(protected handleGen: HandleGenerator) {
    this.handle = handleGen.handle;
  }
  toCode(root: GroupCode): void{
    root.push(
      0, 'TABLE',
      2, 'VPORT',
      5, this.handle,
      100, 'AcDbSymbolTable',
      70, 0,
      0, 'ENDTAB'
    );
  }
}
