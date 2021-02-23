import { Paper, PaperArc, PaperArrow, PaperCircle, PaperContent, PaperContentSpecial, PaperContentString, PaperDimAligned, PaperDrawItem, PaperLine, PaperMText, PaperPolyline, PaperText } from "@/draw/drawItem";
import { LineType, TextAlign } from "@/draw/misc";
import { GroupCode } from "./GroupCode";
import { HandleGenerator } from "./Handle";
import { Blocks, Classes, DimStyle, DXFArc, DXFArrow, DXFCircle, DXFDimAligned, DXFLine, DXFMText, DXFText, Entities, Header, Layer, Objects, Tables } from "./Section";

export class DXFPaper implements Paper{
  protected handleGen = new HandleGenerator();
  header = new Header(this.handleGen);
  classes = new Classes();
  tables = new Tables(this.handleGen);
  blocks = new Blocks(this.handleGen, this.tables.layer);
  entities = new Entities();
  objects = new Objects(this.handleGen);
  generate(): string{
    const root = new GroupCode();

    this.header.toCode(root);
    this.classes.toCode(root);
    this.tables.toCode(root);
    this.blocks.toCode(root);
    this.entities.toCode(root);
    this.objects.toCode(root);

    root.push(0, 'EOF');

    return root.toString();
  }

  protected getLayer(lineType: LineType): Layer{
    const layer = this.tables.layer;
    switch(lineType){
      case LineType.Thin: return layer.thin;
      case LineType.Middle: return layer.middle;
      case LineType.Thick: return layer.thick;
      case LineType.Thicker: return layer.thicker;
      case LineType.Dashed: return layer.dashed;
      case LineType.Centered: return layer.center;
      case LineType.Grey: return layer.grey;
    }
  }
  protected getTextAlignCode(textAlign: TextAlign): {code72: number, code73: number}{
    let code72 = 0;
    let code73 = 0;
    switch(textAlign){
      case TextAlign.BottomLeft: 
        code72 = 0; code73 = 1; break;
      case TextAlign.BottomCenter: 
        code72 = 1; code73 = 1; break;
      case TextAlign.BottomRight: 
        code72 = 2; code73 = 1; break;
      case TextAlign.MiddleLeft: 
        code72 = 0; code73 = 2; break;
      case TextAlign.MiddleCenter: 
        code72 = 1; code73 = 2; break;
      case TextAlign.MiddleRight: 
        code72 = 2; code73 = 2; break;
      case TextAlign.TopLeft: 
        code72 = 0; code73 = 3; break;
      case TextAlign.TopCenter: 
        code72 = 1; code73 = 3; break;
      case TextAlign.TopRight: 
        code72 = 2; code73 = 3; break;
    }
    return {code72, code73};
  }
  protected dimStyleMap = new Map<string, DimStyle>();
  protected getDimStyle(unitScale: number, borderScale: number, drawScale: number): DimStyle{
    const name = this.getDimStyleName(unitScale, borderScale, drawScale);
    const style = this.dimStyleMap.get(name);
    if(style){
      return style;
    }else{
      const dimScale = borderScale / unitScale;
      const measureScale = drawScale / borderScale;
      const newStyle = new DimStyle(
        name,
        this.handleGen.handle,
        this.tables.style.hz,
        dimScale,
        measureScale
      );
      this.tables.dimStyle.push(newStyle);
      this.dimStyleMap.set(name, newStyle);
      return newStyle;
    }
  }
  protected getDimStyleName(unitScale: number, borderScale: number, drawScale: number): string{
    if(Math.abs(borderScale - drawScale) < 1e-6){
      return `${borderScale}(${unitScale})`;
    }else{
      return `${borderScale}-${drawScale}(${unitScale})`
    }
  }
  push(...items: PaperDrawItem[]): void {
    for(const item of items){
      item.accept(this);
    }
  }
  visitArc(arc: PaperArc): void{
    this.entities.push(new DXFArc(arc, this.handleGen.handle, this.getLayer(arc.lineType)));
  }
  visitArrow(arrow: PaperArrow): void{
    this.entities.push(new DXFArrow(arrow, this.handleGen.handle, this.getLayer(arrow.lineType)));
  }
  visitCircle(circle: PaperCircle): void{
    this.entities.push(new DXFCircle(circle, this.handleGen.handle, this.getLayer(circle.lineType)));
  }
  visitDimAligned(dim: PaperDimAligned): void{
    this.entities.push(
      new DXFDimAligned(
        dim,
        dim.override ? dim.override.accept(this) : '',
        this.handleGen.handle,
        this.getLayer(dim.lineType),
        this.getDimStyle(dim.unitScale, dim.borderScale, dim.drawScale)
      )
    );
  }
  visitLine(line: PaperLine): void{
    this.entities.push(new DXFLine(line, this.handleGen.handle, this.getLayer(line.lineType)));
  }
  visitMText(text: PaperMText): void{
    this.entities.push(
      new DXFMText(
        text,
        this.handleGen.handle,
        this.getLayer(text.lineType),
        this.tables.style.hz,
      )
    )
  }
  visitPolyline(pline: PaperPolyline): void{
    for(const seg of pline.segments){
      seg.accept(this);
    }
  }
  visitText(text: PaperText): void{
    const {code72, code73} = this.getTextAlignCode(text.textAlign);
    this.entities.push(
      new DXFText(
        text,
        text.content.accept(this),
        this.handleGen.handle,
        this.getLayer(text.lineType),
        this.tables.style.hz,
        code72,
        code73
      )
    )
  }
  visitString(content: PaperContentString): string {
    return content.content;
  }
  visitSpecial(content: PaperContentSpecial): string {
    switch (content.content) {
      case "HPB300":
        return "%%c";
      case "HRB400":
        return "%%133";
      default:
        return "";
    }
  }
  visitContent(content: PaperContent): string {
    return content.contents
      .map((c) => c.accept(this))
      .reduce((pre, cur) => pre + cur);
  }

}