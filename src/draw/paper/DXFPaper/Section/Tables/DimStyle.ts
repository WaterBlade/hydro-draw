import { CodeItem, CompositeCodeItem, GroupCode } from "../../GroupCode";
import { HandleGenerator } from "../../Handle";
import { Style, StyleTable } from "./Style";
export class DimStyle implements CodeItem{
  constructor(
    public name: string,
    public handle: string,
    public style: Style,
    public dimScale = 1,
    public measureScale = 1,
    public textHeight = 2.5,
    public arrowSize = 2.0,
    public anglePrecision = 1,
    public decPrecision = 0) {
  }
  toCode(root: GroupCode): void {
    root.push(
      0, 'DIMSTYLE',
      105, this.handle,
      100, 'AcDbSymbolTableRecord',
      100, 'AcDbDimStyleTableRecord',
      2, this.name,
      70, 0,
      41, this.arrowSize,
      42, 0,
      44, 2,
      73, 0,
      77, 1,
      140, this.textHeight,
      147, 1,
      144, this.measureScale,
      40, this.dimScale,
      279, 1,
      280, 0,
      289, 3,
      179, this.anglePrecision,
      172, 1,
      174, 1,
      176, 256,
      177, 256,
      178, 256,
      271, this.decPrecision,
      340, this.style.handle);
  }
}

export class DimStyleTable extends CompositeCodeItem{
  handle: string
  standard: DimStyle;
  constructor(protected handleGen: HandleGenerator, style: StyleTable) {
    super();
    this.handle = handleGen.handle;
    this.standard = new DimStyle('STANDARD', handleGen.handle, style.standard);
  }
  toCode(root: GroupCode): void{
    root.push(
      0, 'TABLE',
      2, 'DIMSTYLE',
      5, this.handle,
      100, 'AcDbSymbolTable',
      70, 0,
      100, 'AcDbDimStyleTable',
      71, 1
    );
    this.standard.toCode(root);
    super.toCode(root);
    root.push( 0, 'ENDTAB');
  }
}