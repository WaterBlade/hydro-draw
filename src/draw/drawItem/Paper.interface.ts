import { LineType, Vector, RotateDirection, TextAlign } from "@/draw/misc";

export interface Paper {
  visitArc(item: PaperArc, insertPoint: Vector): void;
  visitArrow(item: PaperArrow, insertPoint: Vector): void;
  visitCircle(item: PaperCircle, insertPoint: Vector): void;
  visitDimAligned(item: PaperDimAligned, insertPoint: Vector): void;
  visitLine(item: PaperLine, insertPoint: Vector): void;
  visitMText(item: PaperMText, insertPoint: Vector): void;
  visitPolyline(item: PaperPolyline, insertPoint: Vector): void;
  visitText(item: PaperText, insertPoint: Vector): void;

  visitContent(item: PaperContent): string;
  visitString(item: PaperContentString): string;
  visitSpecial(item: PaperContentSpecial): string;
}

export interface PaperDrawItem {
  lineType: LineType;
  accept(paper: Paper, insertPoint: Vector): void;
}

export interface PaperArc extends PaperDrawItem {
  center: Vector;
  radius: number;
  startAngle: number;
  endAngle: number;
  direction: RotateDirection;
}

export interface PaperArrow extends PaperDrawItem {
  start: Vector;
  end: Vector;
  width: number;
}

export interface PaperCircle extends PaperDrawItem {
  center: Vector;
  radius: number;
}

export interface PaperDimAligned extends PaperDrawItem {
  unitScale: number;
  borderScale: number;
  drawScale: number;
  start: Vector;
  end: Vector;
  textPoint: Vector;
  override?: PaperContent;
}

export interface PaperLine extends PaperDrawItem {
  start: Vector;
  end: Vector;
}

export interface PaperMText extends PaperDrawItem {
  insertPoint: Vector;
  height: number;
  rowSpace: number;
  width: number;
  content: string[];
}

export interface PaperPolyline extends PaperDrawItem {
  segments: (PaperLine | PaperArc)[];
}

export interface PaperText extends PaperDrawItem {
  insertPoint: Vector;
  height: number;
  rotateAngle: number;
  content: PaperContent;
  textAlign: TextAlign;
}

export interface PaperContentString {
  accept(paper: Paper): string;
  content: string;
}

export interface PaperContentSpecial {
  accept(paper: Paper): string;
  content: SpecialSymbol;
}

export interface PaperContent {
  contents: (PaperContentSpecial | PaperContentString)[];
  accept(paper: Paper): string;
  length: number;
  text(t: string): this;
  special(t: SpecialSymbol): this;
}

export type SpecialSymbol = "HPB300" | "HRB400";
