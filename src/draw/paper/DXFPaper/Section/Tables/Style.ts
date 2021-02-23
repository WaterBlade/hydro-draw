import { CodeItem, GroupCode } from "../../GroupCode";
import { HandleGenerator } from "../../Handle";

export class Style implements CodeItem {
  constructor(
    public name: string,
    public handle: string,
    public fontName: string = 'simp1.shx',
    public bigFontName: string = 'hz.shx',
    public widthFactor = 0.7,
    public obliqueDegree = 0,
    public systemFontName: string | null = null,
    public extData: string | null = null
  ) { }
  toCode(root: GroupCode): void {
    root.push(
      0, 'STYLE',
      5, this.handle,
      100, 'AcDbSymbolTableRecord',
      100, 'AcDbTextStyleTableRecord',
      2, this.name,
      70, 0,
      40, 0,
      41, this.widthFactor,
      50, this.obliqueDegree,
      71, 0,
      3, this.fontName,
      4, this.bigFontName
    );
    if (this.systemFontName && this.extData) {
      root.push(
        1001, 'ACAD',
        1000, this.systemFontName,
        1071, this.extData);
    }
  }
}

export class StyleTable implements CodeItem{
  handle: string
  standard: Style;
  hz: Style;
  constructor(protected handleGen: HandleGenerator) {
    this.handle = handleGen.handle;
    this.standard = new Style('STANDARD', handleGen.handle);
    this.hz = new Style('HZ', handleGen.handle);
  }
  toCode(root: GroupCode): void{
    root.push(
      0, 'TABLE',
      2, 'STYLE',
      5, this.handle,
      100, 'AcDbSymbolTable',
      70, 0
    );
    this.standard.toCode(root);
    this.hz.toCode(root);
    root.push( 0, 'ENDTAB');
  }
}
