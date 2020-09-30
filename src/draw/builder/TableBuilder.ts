import { BoundingBox } from "../BoundingBox";
import { CompositeItem, DrawItem, Line, Text } from "../drawItem";
import { sum } from "../Misc";
import { TextAlign } from "../TextAlign";
import { vec, Vector } from "../Vector";
import { Builder } from "./Builder.interface";

export class TableBuilder implements Builder<DrawItem> {
  cells: Cell[] = [];
  rowCount = 0;
  colCount = 0;
  heightList?: number[];
  widthList?: number[];
  title?: string;

  unitSize: number;
  constructor(public textHeight = 3.5) {
    this.unitSize = (5 / 3.5) * textHeight;
  }

  generate(): DrawItem {
    const comp = new CompositeItem();

    // 设定表格宽度与高度

    if (!this.heightList) {
      this.heightList = this.computeHeightList();
    }
    if (this.heightList.length !== this.rowCount) {
      throw Error("height list length do not match row count");
    }
    if (!this.widthList) {
      this.widthList = this.computeWidthList();
    }
    if (this.widthList.length !== this.colCount) {
      throw Error("width list length do not match col count");
    }

    // 绘制内容与分隔线
    const hIntervals = new HIntervals(this.rowCount, this.colCount);
    const vIntervals = new VIntervals(this.rowCount, this.colCount);
    for (const c of this.cells) {
      if (c.colSpan > 1) {
        vIntervals.split(c.row, c.col, c.rowSpan, c.colSpan);
      }
      if (c.rowSpan > 1) {
        hIntervals.split(c.row, c.col, c.rowSpan, c.colSpan);
      }
      comp.push(...c.draw(this.heightList, this.widthList));
    }
    comp.push(...hIntervals.draw(this.heightList, this.widthList));
    comp.push(...vIntervals.draw(this.heightList, this.widthList));

    // 绘制边界
    const height = sum(...this.heightList);
    const width = sum(...this.widthList);
    comp.push(
      new Line(vec(0, 0), vec(width, 0)),
      new Line(vec(0, -height), vec(width, -height)),
      new Line(vec(0, 0), vec(0, -height)),
      new Line(vec(width, 0), vec(width, -height))
    );

    // 绘制标题
    if (this.title) {
      comp.push(
        new Text(
          this.title,
          vec(width / 2, this.unitSize * 1.25),
          this.unitSize,
          TextAlign.MiddleCenter
        )
      );
    }

    return comp;
  }
  cell(row: number, col: number, rowSpan = 1, colSpan = 1): Cell {
    const c = new Cell(this.textHeight, row, col, rowSpan, colSpan);
    this.cells.push(c);
    this.rowCount = Math.max(this.rowCount, row + rowSpan);
    this.colCount = Math.max(this.colCount, col + colSpan);
    return c;
  }
  computeCellWidth(width: number): number {
    return this.unitSize * (Math.round(width / this.unitSize) + 2);
  }
  computeWidthList(): number[] {
    const ws = Array(this.colCount).fill(0);
    for (const c of this.cells) {
      if (c.colSpan > 1) continue;
      const width = this.computeCellWidth(c.getBoundingBox().width);
      const id = c.col;
      ws[id] = Math.max(ws[id], width);
    }
    for (let i = 0; i < ws.length; i++) {
      ws[i] = Math.max(2 * this.unitSize, ws[i]);
    }
    return ws;
  }
  computeCellHeight(height: number): number {
    return (
      2 * this.unitSize * Math.max(Math.round(height / this.unitSize / 2), 1)
    );
  }
  computeHeightList(): number[] {
    const hs = Array(this.rowCount).fill(0);
    for (const c of this.cells) {
      if (c.rowSpan > 1) continue;
      const height = this.computeCellHeight(c.getBoundingBox().height);
      const id = c.row;
      hs[id] = Math.max(hs[id], height);
    }
    for (let i = 0; i < hs.length; i++) {
      hs[i] = Math.max(2 * this.unitSize, hs[i]);
    }
    return hs;
  }
}

export class Cell {
  items: DrawItem[] = [];
  constructor(
    public textHeight: number,
    public row: number,
    public col: number,
    public rowSpan = 1,
    public colSpan = 1
  ) {}
  push(...items: DrawItem[]): void {
    this.items.push(...items);
  }

  private insertPoint = vec(0, 0);
  text(content: string): void {
    const t = new Text(
      content,
      this.insertPoint,
      this.textHeight,
      TextAlign.MiddleCenter
    );
    this.insertPoint = this.insertPoint.add(vec(0, -2 * this.textHeight));
    this.push(t);
  }
  getCellCenter(heightList: number[], widthList: number[]): Vector {
    const top = -sum(...heightList.slice(0, this.row));
    const bottom =
      top - sum(...heightList.slice(this.row, this.row + this.rowSpan));
    const left = sum(...widthList.slice(0, this.col));
    const right =
      left + sum(...widthList.slice(this.col, this.col + this.colSpan));
    return vec((left + right) / 2, (bottom + top) / 2);
  }
  getBoundingBox(): BoundingBox {
    return this.items
      .map((item) => item.getBoundingBox())
      .reduce((pre, cur) => pre.merge(cur));
  }
  draw(heightList: number[], widthList: number[]): DrawItem[] {
    const cellCenter = this.getCellCenter(heightList, widthList);
    const itemsCenter = this.getBoundingBox().center;
    const vector = cellCenter.sub(itemsCenter);
    this.items.forEach((item) => item.move(vector));
    return this.items;
  }
}

export class Interval {
  segments: number[];
  constructor(public count: number) {
    this.segments = Array<number>(count).fill(1);
  }
  split(start: number, spanCount: number): void {
    for (let i = start; i < start + spanCount; i++) {
      this.segments[i] = 0;
    }
  }
  draw(start: Vector, lengthList: number[], direction = vec(1, 0)): Line[] {
    const res: Line[] = [];
    const unit = direction.unit();
    let lineLength = 0;
    for (let i = 0; i < this.count; i++) {
      const segLength = lengthList[i];
      if (this.segments[i] === 0) {
        if (lineLength === 0) {
          start = start.add(unit.mul(segLength));
        } else {
          const end = start.add(unit.mul(lineLength));
          res.push(new Line(start, end));

          start = end.add(unit.mul(segLength));
          lineLength = 0;
        }
      } else {
        lineLength += segLength;
      }
    }
    // 上述循环不能处理最后的情况，需额外处理
    if (lineLength > 0) {
      res.push(new Line(start, start.add(unit.mul(lineLength))));
    }
    return res;
  }
}

export class HIntervals {
  intervals: Interval[] = [];
  constructor(public rowCount: number, public colCount: number) {
    for (let i = 0; i < rowCount - 1; i++) {
      this.intervals.push(new Interval(colCount));
    }
  }
  split(row: number, col: number, rowSpan: number, colSpan: number): void {
    for (let i = row; i < row + rowSpan - 1; i++) {
      this.intervals[i].split(col, colSpan);
    }
  }
  draw(heightList: number[], widthList: number[]): Line[] {
    const lines: Line[] = [];
    let start = vec(0, 0);
    for (let i = 0; i < heightList.length - 1; i++) {
      start = start.add(vec(0, -heightList[i]));
      lines.push(...this.intervals[i].draw(start, widthList));
    }
    return lines;
  }
}

export class VIntervals {
  intervals: Interval[] = [];
  constructor(public rowCount: number, public colCount: number) {
    for (let i = 0; i < colCount - 1; i++) {
      this.intervals.push(new Interval(rowCount));
    }
  }
  split(row: number, col: number, rowSpan: number, colSpan: number): void {
    for (let i = col; i < col + colSpan - 1; i++) {
      this.intervals[i].split(row, rowSpan);
    }
  }
  draw(heightList: number[], widthList: number[]): Line[] {
    const lines: Line[] = [];
    let start = vec(0, 0);
    const direction = vec(0, -1);
    for (let i = 0; i < widthList.length - 1; i++) {
      start = start.add(vec(widthList[i], 0));
      lines.push(...this.intervals[i].draw(start, heightList, direction));
    }
    return lines;
  }
}
