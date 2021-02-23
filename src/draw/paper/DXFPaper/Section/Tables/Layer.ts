import { CodeItem, GroupCode } from "../../GroupCode";
import { HandleGenerator } from "../../Handle";
import { LType, LTypeTable } from "./LType";

export class Layer implements CodeItem {
  constructor(
    public name: string,
    public handle: string,
    public ltype: LType,
    public color: number = 7,
  ) { }
  toCode(root: GroupCode): void {
    root.push(
      0, 'LAYER',
      5, this.handle,
      100, 'AcDbSymbolTableRecord',
      100, 'AcDbLayerTableRecord',
      2, this.name,
      70, 0,
      62, this.color,
      6, this.ltype.name,
      370, -3,
      390, this.handle + '0',
      347, this.handle + '1'
    );
  }
}

export class LayerTable implements CodeItem{
  handle: string;
  default: Layer;
  thin: Layer;
  middle: Layer;
  thick: Layer;
  thicker: Layer;
  dashed: Layer;
  center: Layer;
  grey: Layer;
  constructor(protected handleGen: HandleGenerator, ltype: LTypeTable) {
    this.handle = handleGen.handle;
    this.default = new Layer('0', handleGen.handle, ltype.continuous);
    this.thin = new Layer('细线', handleGen.handle, ltype.continuous, 3);
    this.middle = new Layer('中粗线', handleGen.handle, ltype.continuous, 2);
    this.thick = new Layer('粗线', handleGen.handle, ltype.continuous, 1);
    this.thicker = new Layer('加粗线', handleGen.handle, ltype.continuous, 6);
    this.dashed = new Layer('虚线', handleGen.handle, ltype.dashed, 5);
    this.center = new Layer('中心线', handleGen.handle, ltype.center, 4);
    this.grey = new Layer('淡显线', handleGen.handle, ltype.continuous, 9);

  }
  toCode(root: GroupCode): void{
    root.push(
      0, 'TABLE',
      2, 'LAYER',
      5, this.handle,
      100, 'AcDbSymbolTable',
      70, 0
    );
    this.default.toCode(root);
    this.thin.toCode(root);
    this.middle.toCode(root);
    this.thick.toCode(root);
    this.thicker.toCode(root);
    this.dashed.toCode(root);
    this.center.toCode(root);
    this.grey.toCode(root);
    root.push( 0, 'ENDTAB');
  }
}