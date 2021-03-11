import { CompositeCodeItem, GroupCode } from "../GroupCode";
import { HandleGenerator } from "../Handle";
import { Layer, LayerTable } from "./Tables/Layer";

export class Block extends CompositeCodeItem {
  constructor(
    public name: string,
    public layer: Layer,
    public beginHandle: string,
    public endHandle: string,
    public xBase: number = 0,
    public yBase: number = 0
  ) {
    super();
  }
  toCode(root: GroupCode): void {
    root.push(
      0,
      "BLOCK",
      5,
      this.beginHandle,
      100,
      "AcDbEntity",
      8,
      this.layer.name,
      100,
      "AcDbBlockBegin",
      2,
      this.name,
      70,
      0,
      10,
      this.xBase,
      20,
      this.yBase,
      30,
      0,
      3,
      this.name
    );
    super.toCode(root);
    root.push(
      0,
      "ENDBLK",
      5,
      this.endHandle,
      100,
      "AcDbEntity",
      8,
      this.layer.name,
      100,
      "AcDbBlockEnd"
    );
  }
}
export class Blocks extends CompositeCodeItem {
  modelSpace: Block;
  paperSpace: Block;
  constructor(protected handleGen: HandleGenerator, layer: LayerTable) {
    super();
    this.modelSpace = new Block(
      "*MODEL_SPACE",
      layer.default,
      handleGen.handle,
      handleGen.handle
    );
    this.paperSpace = new Block(
      "*PAPER_SPACE",
      layer.default,
      handleGen.handle,
      handleGen.handle
    );
  }
  toCode(root: GroupCode): void {
    root.push(0, "SECTION", 2, "BLOCKS");
    this.modelSpace.toCode(root);
    this.paperSpace.toCode(root);
    super.toCode(root);
    root.push(0, "ENDSEC");
  }
}
