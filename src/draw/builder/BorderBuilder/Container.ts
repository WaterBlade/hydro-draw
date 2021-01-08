import { CompositeItem, DrawItem } from "@/draw/drawItem";
import { last, sum, vec, Vector } from "@/draw/misc";
import { Boundary } from "./Boundary";

abstract class BoxContainer {
  constructor(public topLeft: Vector, public width = 0, public height = 0) {}
  get left(): number {
    return this.topLeft.x;
  }
  get right(): number {
    return this.left + this.width;
  }
  get bottom(): number {
    return this.top - this.height;
  }
  get top(): number {
    return this.topLeft.y;
  }
  abstract move(v: Vector): void;
  abstract fill(item: DrawItem): boolean;
  protected abstract resetSize(): void;
}

export class Container extends BoxContainer {
  columns: Column[] = [];
  constructor(public boundary: Boundary) {
    super(vec(boundary.left, boundary.top));
  }
  protected resetSize(): void {
    this.width = last(this.columns).right - this.topLeft.x;
    this.height = Math.max(...this.columns.map((c) => c.height));
  }
  protected add(column: Column): void {
    this.columns.push(column);
    this.resetSize();
  }
  move(v: Vector): void {
    this.topLeft = this.topLeft.add(v);
    this.columns.forEach((c) => c.move(v));
  }
  isEmpty(): boolean {
    return this.columns.length === 0;
  }
  fill(
    item: DrawItem,
    title?: DrawItem,
    centerAligned = false,
    titlePosKeep = false
  ): boolean {
    if (this.columns.length !== 0) {
      const column = last(this.columns);
      if (column.fill(item, title, centerAligned, titlePosKeep)) {
        this.resetSize();
        return true;
      }
    }
    const column = new Column(this.topLeft.add(vec(this.width, 0)), this);
    if (column.fill(item, title, centerAligned, titlePosKeep)) {
      this.add(column);
      return true;
    } else {
      return false;
    }
  }
  insideTest(pt: Vector): boolean {
    return this.boundary.insideTest(pt);
  }
  generate(): CompositeItem {
    const c = new CompositeItem();
    this.resetColumnsX();
    this.resetRowsY();
    this.resetCellXs();
    this.resetItemsCenter();
    c.push(...this.getItems());
    return c;
  }
  resetRowsY(): void {
    this.columns.forEach((c) => c.resetRowsY());
  }
  resetColumnsX(): void {
    const boundary = this.boundary;
    const boundaryLeft = this.topLeft.x;
    const cols = this.columns;
    const colCount = cols.length;
    for (let i = 0; i < colCount; i++) {
      const xList = [];
      const left = i === 0 ? boundaryLeft : cols[i - 1].right;
      for (let j = i; j < colCount; j++) {
        const rightCol = cols[j];
        const count = j - i + 2;
        if (rightCol.crossTest()) {
          const preColWidth = sum(...cols.slice(i, j).map((c) => c.width));
          for (const row of rightCol.rows) {
            const right = boundary.getRight(row.bottom, row.top);
            const totalWidth = preColWidth + row.width;
            const space = right - left - totalWidth;
            xList.push(left + space / count);
          }
        } else {
          const right = boundary.getRight(rightCol.bottom, rightCol.top);
          const totalWidth = sum(...cols.slice(i, j + 1).map((r) => r.width));
          const space = right - left - totalWidth;
          xList.push(left + space / count);
        }
      }
      const col = cols[i];
      col.move(vec(Math.min(...xList) - col.left, 0));
    }
    this.resetSize();
  }
  resetCellXs(): void {
    this.columns.forEach((c) => c.resetCellsX());
  }
  resetItemsCenter(): void {
    this.columns.forEach((c) => c.resetItemsCenter());
  }
  getItems(): DrawItem[] {
    return this.columns.reduce(
      (pre: DrawItem[], cur) => pre.concat(cur.getItems()),
      []
    );
  }
}

export class Column extends BoxContainer {
  constructor(topLeft: Vector, public container: Container) {
    super(topLeft);
  }
  rows: Row[] = [];
  protected add(row: Row): void {
    this.rows.push(row);
    this.resetSize();
  }
  protected resetSize(): void {
    this.width = Math.max(...this.rows.map((r) => r.width));
    this.height = this.topLeft.y - last(this.rows).bottom;
  }
  move(v: Vector): void {
    this.topLeft = this.topLeft.add(v);
    this.rows.forEach((r) => r.move(v));
  }
  fill(
    item: DrawItem,
    title?: DrawItem,
    centerAligned = false,
    titlePosKeep = false
  ): boolean {
    if (this.rows.length !== 0) {
      const row = last(this.rows);
      if (row.fill(item, title, centerAligned, titlePosKeep)) {
        this.resetSize();
        return true;
      }
    }
    const row = new Row(this.topLeft.add(vec(0, -this.height)), this);
    if (row.fill(item, title, centerAligned, titlePosKeep)) {
      this.add(row);
      return true;
    } else {
      return false;
    }
  }
  resetRowsY(): void {
    const boundary = this.container.boundary;
    const boundaryTop = this.topLeft.y;
    const colFloor = boundary.getBottom(this.left, this.right);
    const rows = this.rows;
    const rowCount = rows.length;
    for (let i = 0; i < rowCount; i++) {
      const yList = [];
      const top = i === 0 ? boundaryTop : rows[i - 1].bottom;
      for (let j = i; j < rowCount; j++) {
        const bottomRow = rows[j];
        const rowFloor =boundary.getBottom(bottomRow.left, bottomRow.right);
        const floor = bottomRow.bottom > colFloor ? colFloor : rowFloor;
        const totalHeight = sum(...rows.slice(i, j + 1).map((r) => r.height));
        const space = top - floor - totalHeight;
        const count = j - i + 2;
        yList.push(top - space / count);
      }
      const row = rows[i];
      row.move(vec(0, Math.max(...yList) - row.top));
    }
    this.resetSize();
  }
  resetCellsX(): void {
    this.rows.forEach((r) => r.resetCellsX());
  }
  resetItemsCenter(): void {
    this.rows.forEach((r) => r.resetItemsCenter());
  }
  crossTest(): boolean {
    const pt = vec(this.right, this.bottom);
    return !this.container.insideTest(pt);
  }
  getItems(): DrawItem[] {
    return this.rows.reduce(
      (pre: DrawItem[], cur) => pre.concat(cur.getItems()),
      []
    );
  }
}

export class Row extends BoxContainer {
  cells: Cell[] = [];
  constructor(topLeft: Vector, public column: Column) {
    super(topLeft);
  }

  get container(): Container {
    return this.column.container;
  }
  get netWidth(): number {
    return this.cells.reduce((pre, cur) => pre + cur.netWidth, 0);
  }
  move(v: Vector): void {
    this.topLeft = this.topLeft.add(v);
    this.cells.forEach((c) => c.move(v));
  }

  protected add(cell: Cell): void {
    this.cells.push(cell);
    this.resetSize();
  }
  protected resetSize(): void {
    this.width = last(this.cells).right - this.topLeft.x;
    this.height = Math.max(...this.cells.map((c) => c.height));
  }
  fill(
    item: DrawItem,
    title?: DrawItem,
    centerAligned = false,
    titlePosKeep = false
  ): boolean {
    if (this.cells.length === 0) {
      const cell = new Cell(this.topLeft.add(vec(this.width, 0)), this);
      if (cell.fill(item, title, centerAligned, titlePosKeep)) {
        this.add(cell);
        return true;
      } else {
        return false;
      }
    } else {
      const cell = new Cell(this.topLeft.add(vec(this.netWidth, 0)), this);
      if (cell.fill(item, title, false, titlePosKeep)) {
        if (
          this.column.width > 0 &&
          this.netWidth + cell.width > this.column.width
        ) {
          return false;
        } else {
          if (this.cells.length === 1) {
            this.cells[0].resetCenterAligned(false);
          }
          this.add(cell);
          return true;
        }
      } else {
        return false;
      }
    }
  }
  resetCellsX(): void {
    const boundary = this.container.boundary;
    const cells = this.cells;
    const count = cells.length;
    const totalWidth = sum(...cells.map((c) => c.width));
    const left = this.column.topLeft.x;
    const boundaryRight = boundary.getRight(this.bottom, this.top);
    const columnRight = this.column.right;
    const right = Math.min(boundaryRight, columnRight);
    const space = right - left - totalWidth;
    const xDist = space / (count + 1);
    for (let i = 0; i < count; i++) {
      cells[i].move(vec(xDist * (i + 1), 0));
    }
    this.resetSize();
  }
  resetItemsCenter(): void {
    this.cells.forEach((c) => c.resetItemsCenter());
  }
  getItems(): DrawItem[] {
    return this.cells.reduce(
      (pre: DrawItem[], cur) => pre.concat(cur.getItems()),
      []
    );
  }
}
export class Cell extends BoxContainer {
  protected item?: DrawItem;
  protected title?: DrawItem;
  protected centerAligned = false;
  protected titlePosKeep = false;
  constructor(topLeft: Vector, public row: Row) {
    super(topLeft);
  }
  get container(): Container {
    return this.row.container;
  }
  move(v: Vector): void {
    this.topLeft = this.topLeft.add(v);
  }
  protected init(
    item: DrawItem,
    title?: DrawItem,
    centerAligned = false,
    titlePosKeep = false
  ): void {
    this.item = item;
    this.title = title;
    this.centerAligned = centerAligned;
    this.titlePosKeep = titlePosKeep;
    this.resetSize();
  }
  netWidth = 0;
  protected resetSize(): void {
    if (!this.item) throw Error("content in cell is undefined");
    const box = this.item.getBoundingBox();
    this.width = box.width;
    this.netWidth = box.width;
    this.height = box.height;

    if (this.centerAligned) {
      this.width = 2 * Math.max(Math.abs(box.left), Math.abs(box.right));
    }
    if (this.title) {
      const titleBox = this.title.getBoundingBox();

      if (this.titlePosKeep && this.centerAligned) {
        this.width =
          Math.max(this.width / 2, titleBox.right) -
          Math.min(-this.width / 2, titleBox.left);
      } else if (this.titlePosKeep) {
        this.width =
          Math.max(box.right, titleBox.right) -
          Math.min(box.left, titleBox.left);
      } else {
        this.width = Math.max(this.width, titleBox.width);
      }

      if (this.titlePosKeep) {
        this.netWidth =
          Math.max(box.right, titleBox.right) -
          Math.min(box.left, titleBox.left);
      } else {
        this.netWidth = Math.max(box.width, titleBox.width);
      }
      this.height += titleBox.height * 2.5;
    }
  }
  resetCenterAligned(centerAligned = false): this {
    this.centerAligned = centerAligned;
    this.resetSize();
    return this;
  }
  fill(
    item: DrawItem,
    title?: DrawItem,
    centerAligned = false,
    titlePosKeep = false
  ): boolean {
    this.init(item, title, centerAligned, titlePosKeep);
    const pt = vec(this.right, this.bottom);
    if (this.container.insideTest(pt)) {
      return true;
    } else {
      return false;
    }
  }
  resetItemsCenter(): void {
    if (!this.item) {
      throw Error("item not init");
    }
    const { bottom, top } = this.row;
    const xMid = (this.left + this.right) / 2;
    const yTitleTop =
      bottom + (this.title ? this.title.getBoundingBox().height : 0);
    const yMid = (top + yTitleTop) / 2;
    const { x, y } = this.item.getBoundingBox().Center;

    const xMove = this.centerAligned ? xMid : xMid - x;
    const yMove = yMid - y;
    this.item.move(vec(xMove, yMove));

    if (this.title) {
      const yTitleMid = (yTitleTop + bottom) / 2;
      const { x: x0, y: y0 } = this.title.getBoundingBox().Center;
      const xTitleMove = this.titlePosKeep ? xMove : xMid - x0;
      const yTitleMove = yTitleMid - y0;
      this.title.move(vec(xTitleMove, yTitleMove));
    }
  }
  getItems(): DrawItem[] {
    const res: DrawItem[] = [];
    if (this.item) res.push(this.item);
    if (this.title) res.push(this.title);
    return res;
  }
}
