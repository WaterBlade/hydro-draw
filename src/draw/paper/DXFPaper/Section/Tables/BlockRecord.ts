import { CodeItem, GroupCode } from "../../GroupCode";
import { HandleGenerator } from "../../Handle";

export class BlockRecord implements CodeItem {
  constructor(public name: string, public handle: string) {}
  toCode(root: GroupCode): void {
    root.push(
      0,
      "BLOCK_RECORD",
      5,
      this.handle,
      100,
      "AcDbSymbolTableRecord",
      100,
      "AcDbBlockTableRecord",
      2,
      this.name,
      70,
      0,
      280,
      1,
      281,
      0
    );
  }
}

export class BlockRecordTable implements CodeItem {
  handle: string;
  modelSpace: BlockRecord;
  paperSpace: BlockRecord;
  constructor(protected handleGen: HandleGenerator) {
    this.handle = handleGen.handle;
    this.modelSpace = new BlockRecord("*MODEL_SPACE", handleGen.handle);
    this.paperSpace = new BlockRecord("*PAPER_SPACE", handleGen.handle);
  }
  toCode(root: GroupCode): void {
    root.push(
      0,
      "TABLE",
      2,
      "BLOCK_RECORD",
      5,
      this.handle,
      100,
      "AcDbSymbolTable",
      70,
      0
    );
    this.modelSpace.toCode(root);
    this.paperSpace.toCode(root);
    root.push(0, "ENDTAB");
  }
}
