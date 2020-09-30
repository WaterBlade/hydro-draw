import { BoundingBox } from "../BoundingBox";
import { DrawItem } from "../drawItem";
import { sum } from "../Misc";
import { vec, Vector } from "../Vector";
import { Builder } from "./Builder.interface";

export class BorderBuilder implements Builder<DrawItem[]> {
  generate(): DrawItem[] {
    return [];
  }
}

export class Border {
  columns: Column[] = [];
  maxHeight: number;
  maxWidth: number;

  constructor(public topLeft: Vector, public boundary: HBoundary) {
    const left = topLeft.x;
    const right = boundary.right;
    const top = topLeft.y;
    const btm = boundary.bottom;
    this.maxHeight = top - btm;
    this.maxWidth = right - left;
    this.columns.push(
      new Column(topLeft, this.maxWidth, this.maxHeight, boundary)
    );
  }

  fill(box: BoundingBox): boolean {
    if (!this.columns[this.columns.length - 1].fill(box)) {
      const w = sum(...this.columns.map((c) => c.width));
      const col = new Column(
        this.topLeft.add(vec(w, 0)),
        this.maxWidth - w,
        this.maxHeight,
        this.boundary
      );
      if (col.fill(box)) {
        this.columns.push(col);
        return true;
      }
      return false;
    }
    return true;
  }
  plan(): void {
    // depracated
    const x0 = this.topLeft.x;
    const y0 = this.topLeft.y;
    const boxHs = [...this.boundary.edges.slice(1).map((d) => y0 - d.y), 0];
    const boxWs = this.boundary.edges.map((d) => d.xRight - x0);

    const colHs = this.columns.map((c) => c.height);
    const colWs = this.columns.map((c) => c.width);

    let left = 0;
    for (let leftColIdx = 0; leftColIdx < this.columns.length; leftColIdx++) {
      const leftSpaces: number[] = [];
      for (let boxIdx = 0; boxIdx < boxHs.length; boxIdx++) {
        const boxH = boxHs[boxIdx];
        const boxW = boxWs[boxIdx];
        // 找到最右边的列
        let rightColIdx = this.columns.length - 1;
        while (rightColIdx >= 0) {
          if (colHs[rightColIdx] > boxH) break;
          rightColIdx -= 1;
        }
        // 没有列在这个高度范围内进入下一个循环
        if (rightColIdx === -1) continue;
        // 有列在这个高度范围内计算最小左边框
        const count = rightColIdx - leftColIdx + 1;
        const colWidth = sum(...colWs.slice(leftColIdx, rightColIdx + 1));
        const totalWidth = boxW - left;
        const space = totalWidth - colWidth;
        leftSpaces.push(space / (count + 1));
      }

      const col = this.columns[leftColIdx];
      const leftSpace = Math.min(...leftSpaces);
      col.topLeft = this.topLeft.add(vec(left + leftSpace, 0));

      left += leftSpace + colWs[leftColIdx];
    }
  }
  getCenters(): Vector[] {
    const res = [];
    for (const c of this.columns) {
      res.push(...c.getCenters());
    }
    return res;
  }
  findRightColumn(edge: VEdge): Column {
    let idx = 0;
    for (let i = 0; i < this.columns.length; i++) {
      const column = this.columns[i];
      if (column.top < edge.yBottom || column.bottom > edge.yTop) continue;
      idx = i;
    }
    return this.columns[idx];
  }
  calcMinRightMove(
    left: number,
    column: Column,
    rightColumns: Column[],
    edges: VEdge[]
  ): number {
    const move = [];

    const start = this.columns.indexOf(column);

    for (let i = 0; i < edges.length; i++) {
      const right = rightColumns[i];
      const edge = edges[i];

      if (right.isLeftTo(column)) continue;

      const end = this.columns.indexOf(right);
      let totalWidth = sum(
        ...this.columns.slice(start, end + 1).map((c) => c.width)
      );
      // 如果右下角存在相交的情况，需要修正宽度。
      if (right.topLeft.x + right.width > edge.x) {
        totalWidth = sum(...this.columns.slice(start, end).map((c) => c.width));

        let rowWidth = 0;
        for (const row of right.rows) {
          if (row.top < edge.yBottom || row.bottom > edge.yTop) continue;
          rowWidth = Math.max(row.width, rowWidth);
        }
        totalWidth += rowWidth;
      }

      move.push((edge.x - left - totalWidth) / (end - start + 2));
    }

    return Math.min(...move);
  }
}

export class ColumnBox {
  constructor(
    public cols: Column[],
    public left: number,
    public right: VEdge
  ) {}
  computeSpace(): number {
    let width = sum(...this.cols.map((r) => r.width));
    if (width + this.left > this.right.x) {
      let rowWidth = 0;
      for (const row of this.cols[this.cols.length - 1].rows) {
        if (row.bottom > this.right.yTop || row.top < this.right.yBottom)
          continue;
        rowWidth = Math.max(rowWidth, row.width);
      }
      width = sum(...this.cols.slice(0, -1).map((r) => r.width)) + rowWidth;
    }
    const count = this.cols.length + 1;
    return (this.right.x - this.left - width) / count;
  }
}

export class Column {
  rows: Row[] = [];
  constructor(
    public topLeft: Vector,
    public maxWidth: number,
    public maxHeight: number,
    public boundary: HBoundary
  ) {
    this.rows.push(new Row(topLeft, maxWidth, maxHeight, boundary));
  }

  get width(): number {
    return Math.max(...this.rows.map((r) => r.width));
  }

  get height(): number {
    return this.top - this.bottom;
  }

  get left(): number {
    return this.topLeft.x;
  }

  get right(): number {
    return this.topLeft.x + this.width;
  }

  get top(): number {
    return this.topLeft.y;
  }

  get bottom(): number {
    return Math.min(...this.rows.map((r) => r.bottom));
  }

  move(vector: Vector): void {
    this.topLeft = this.topLeft.add(vector);
    for (const row of this.rows) {
      row.move(vector);
    }
  }

  isLeftTo(col: Column): boolean {
    return this.topLeft.x < col.topLeft.x;
  }

  getCenters(): Vector[] {
    const res: Vector[] = [];
    for (const r of this.rows) {
      res.push(...r.getCenters());
    }
    return res;
  }

  vPlan(): void {
    const edges = this.boundary.edges;
    const bottomRows = edges.map((edge) => this.findBottomRow(edge));

    let top = this.topLeft.y;
    for (const row of this.rows) {
      const downMove = this.calcMinDownMove(top, row, bottomRows, edges);
      row.topLeft.y = top - downMove;
      top = top - downMove - row.height;
    }
  }

  findBottomRow(edge: HEdge): Row {
    // 返回与线段接邻的行
    let idxBottom = 0;
    for (let i = 0; i < this.rows.length; i++) {
      const row = this.rows[i];

      const left = row.topLeft.x;
      const right = left + row.width;

      if (right < edge.xLeft || left > edge.xRight) continue;

      idxBottom = i;
    }
    return this.rows[idxBottom];
  }

  calcMinDownMove(
    top: number,
    row: Row,
    bottomRows: Row[],
    edges: HEdge[]
  ): number {
    if (bottomRows.length !== edges.length) {
      throw Error("bottom row count do not match edge count");
    }
    const move = [];

    const start = this.rows.indexOf(row);

    for (let i = 0; i < bottomRows.length; i++) {
      const bottom = bottomRows[i];

      if (bottom.topLeft.y > row.topLeft.y) continue;

      const end = this.rows.indexOf(bottom);
      const totalHeight = sum(
        ...this.rows.slice(start, end + 1).map((c) => c.height)
      );

      const edge = edges[i];
      move.push((top - edge.y - totalHeight) / (end - start + 2));
    }

    return Math.min(...move);
  }

  fill(box: BoundingBox): boolean {
    let succeed = this.rows[this.rows.length - 1].fill(box);
    const aboveWidth = this.width;
    if (!succeed) {
      const h = sum(...this.rows.map((r) => r.height));
      const row = new Row(
        this.topLeft.sub(vec(0, h)),
        this.maxWidth,
        this.maxHeight - h,
        this.boundary,
        aboveWidth
      );
      if (row.fill(box)) {
        this.rows.push(row);
        succeed = true;
      }
    }

    const isWider = aboveWidth < this.rows[this.rows.length - 1].width;

    if (succeed && isWider) {
      const left = this.topLeft.x;
      const right = left + this.width;
      const y = this.topLeft.sub(vec(0, this.maxHeight)).y;
      const yTopEdge = this.boundary.findTopEdge(left, right, y);
      if (yTopEdge > y) {
        this.maxHeight = this.topLeft.y - yTopEdge;
      }
    }

    return succeed;
  }
}

export class RowBox {
  constructor(public rows: Row[], public top: number, public bottom: HEdge) {}
  computeSpace(): number {
    const height = sum(...this.rows.map((r) => r.height));
    const count = this.rows.length + 1;
    return (this.top - this.bottom.y - height) / count;
  }
}

export class Row {
  boxs: BoundingBox[] = [];
  constructor(
    public topLeft: Vector,
    public maxWidth: number,
    public maxHeight: number,
    public boundary: HBoundary,
    public aboveColWidth = 0
  ) {}

  get width(): number {
    return sum(...this.boxs.map((b) => b.width));
  }

  get height(): number {
    return Math.max(...this.boxs.map((b) => b.height));
  }

  get left(): number {
    return this.topLeft.x;
  }

  get right(): number {
    return this.left + this.width;
  }

  get top(): number {
    return this.topLeft.y;
  }

  get bottom(): number {
    return this.topLeft.y - this.height;
  }

  move(vector: Vector): void {
    this.topLeft = this.topLeft.add(vector);
  }

  isAboveOn(row: Row): boolean {
    return this.topLeft.y > row.topLeft.y;
  }

  getCenters(): Vector[] {
    return this.boxs.map((c) => c.center);
  }

  fill(box: BoundingBox): boolean {
    // 初始行只允许装一个
    if (this.aboveColWidth === 0 && this.boxs.length > 0) return false;

    if (box.height > this.maxHeight) return false;

    if (box.width > this.maxWidth) return false;

    const leftWidth = sum(...this.boxs.map((b) => b.width));
    if (this.boxs.length > 0 && leftWidth + box.width > this.aboveColWidth)
      return false;

    const left = this.topLeft.x + leftWidth;
    const right = left + box.width;
    const y = this.topLeft.y - box.height;
    if (this.boundary.checkBelow(left, right, y)) return false;

    this.boxs.push(box);
    return true;
  }
}

export class HBoundary {
  edges: HEdge[] = [];
  xCurrent = 0;
  get right(): number {
    return this.edges[this.edges.length - 1].xRight;
  }
  get bottom(): number {
    return Math.min(...this.edges.map((d) => d.y));
  }
  addEdge(xStart: number, xEnd: number, y: number): void {
    if (this.edges.length > 0 && this.xCurrent !== xStart) {
      throw Error("boundary edge do not concatenate");
    }
    this.edges.push(new HEdge(xStart, xEnd, y));
    this.xCurrent = xEnd;
  }
  checkBelow(xStart: number, xEnd: number, y: number): boolean {
    // 测试线段是否在边界之下
    for (const edge of this.edges) {
      if (edge.xRight < xStart || edge.xLeft > xEnd) continue;
      if (y >= edge.y) return false;
    }
    return true;
  }
  findTopEdge(xStart: number, xEnd: number, y: number): number {
    // 搜索区域内的最高边界线y坐标
    const ys: number[] = [];
    for (const edge of this.edges) {
      if (edge.xRight < xStart || edge.xLeft > xEnd) continue;
      if (y < edge.y) ys.push(edge.y);
    }
    return Math.max(...ys);
  }
  genSubBoundary(xStart: number, xEnd: number): HBoundary {
    // 生成区域重叠的边界
    const h = new HBoundary();
    for (const edge of this.edges) {
      if (edge.xRight < xStart || edge.xLeft > xEnd) continue;
      const start = Math.max(edge.xLeft, xStart);
      const end = Math.min(edge.xRight, xEnd);
      h.addEdge(start, end, edge.y);
    }
    return h;
  }
}

export class HEdge {
  constructor(public xLeft: number, public xRight: number, public y: number) {}
}

export class VBoundary {
  edges: VEdge[] = [];
  yCurrent = 0;
  static fromHBoundary(topLeft: Vector, h: HBoundary): VBoundary {
    const v = new VBoundary();
    let start = h.edges[0].y;
    for (const edge of h.edges.slice(1)) {
      v.addEdge(start, edge.y, edge.xLeft);
      start = edge.y;
    }
    v.addEdge(start, topLeft.y, h.edges[h.edges.length - 1].xRight);
    return v;
  }
  addEdge(yStart: number, yEnd: number, x: number): void {
    if (this.edges.length > 0 && this.yCurrent !== yStart) {
      throw Error("boundary edge do not concatenate");
    }
    this.edges.push(new VEdge(yStart, yEnd, x));
    this.yCurrent = yEnd;
  }
  checkRight(yStart: number, yEnd: number, x: number): boolean {
    // 测试线段是否在边界之右
    for (const edge of this.edges) {
      if (edge.yTop < yStart || edge.yBottom > yEnd) continue;
      if (x >= edge.x) return false;
    }
    return true;
  }
  findLeftEdge(yStart: number, yEnd: number, x: number): number {
    // 搜索区域内的最左边界线x坐标
    const xs: number[] = [];
    for (const edge of this.edges) {
      if (edge.yTop < yStart || edge.yBottom > yEnd) continue;
      if (x > edge.x) xs.push(edge.x);
    }
    return Math.min(...xs);
  }
}

export class VEdge {
  constructor(public yBottom: number, public yTop: number, public x: number) {}
}
