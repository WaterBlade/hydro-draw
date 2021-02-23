import { CodeItem, GroupCode } from "../../GroupCode";
import { HandleGenerator } from "../../Handle";

export class AppID implements CodeItem{
  constructor(
    public name: string,
    public handle: string
  ){}
  toCode(root: GroupCode): void{
    root.push(
      0, 'APPID',
      5, this.handle,
      100, 'AcDbSymbolTableRecord',
      100, 'AcDbRegAppTableRecord',
      2, this.name,
      70, 0
    );
  }
}

export class AppIDTable implements CodeItem{
  handle: string;
  acad: AppID;
  constructor(protected handleGen: HandleGenerator) {
    this.handle = handleGen.handle;
    this.acad = new AppID('ACAD', handleGen.handle);
  }
  toCode(root: GroupCode): void{
    root.push(
      0, 'TABLE',
      2, 'APPID',
      5, this.handle,
      100, 'AcDbSymbolTable',
      70, 0
    );
    this.acad.toCode(root);
    root.push( 0, 'ENDTAB');
  }
}