import { DrawItem } from "../../drawItem";
import { BoundingBox, last, sum, vec, Vector } from "../../misc";

interface Box {
  left: number;
  right: number;
  bottom: number;
  top: number;
}

abstract class BoxContainer implements Box {
  constructor(protected topLeft: Vector) {}
  get width(): number {
    return this.right - this.left;
  }
  get height(): number {
    return this.top - this.bottom;
  }

  get left(): number {
    return this.topLeft.x;
  }

  abstract get right(): number;

  get top(): number {
    return this.topLeft.y;
  }

  abstract get bottom(): number;
}

export class Border extends BoxContainer {
  columns: Column[] = [];
  items: DrawItem[] = [];
  origins: Vector[] = [];
  constructor(public boundary: Boundary) {
    super(boundary.topLeft);
  }

  get right(): number {
    if (this.columns.length === 0) return this.left;
    return last(this.columns).right;
  }

  get bottom(): number {
    if (this.columns.length === 0) return this.top;
    return Math.min(...this.columns.map((c) => c.bottom));
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
  fillBox(box: BoundingBox): boolean {
    const lastCol = last(this.columns);
    const origin = box.center;
    if (lastCol !== undefined && lastCol.fill(box)) {
      this.origins.push(origin);
      return true;
    }

    const insert = vec(this.right, this.top);
    const nextCol = new Column(insert, this.boundary);
    if (nextCol.fill(box)) {
      this.columns.push(nextCol);
      this.origins.push(origin);
      return true;
    }

    return false;
  }
  fillItem(item: DrawItem): void {
    this.items.push(item);
  }
  plan(): void {
    this.adjustRowPos();
    this.adjustColPos();
    this.adjustBoxPos();
    const centers = this.getCenters();
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      const origin = this.origins[i];
      const center = centers[i];
      item.move(center.sub(origin));
    }
  }
  getCenters(): Vector[] {
    return this.columns.reduce(
      (pre: Vector[], cur) => pre.concat(cur.getCenters()),
      []
    );
  }
  adjustColPos(): void {
    const edges = this.boundary.getVOverlapEdges(this.bottom, this.top);
    const rightIds = edges.map((e) => e.findRightMost(this.columns));
    for (let i = 0; i < this.columns.length; i++) {
      const left = i === 0 ? this.left : this.columns[i - 1].right;
      const col = this.columns[i];
      let space = Infinity;
      for (let j = 0; j < edges.length; j++) {
        const edge = edges[j];
        const rightId = rightIds[j];
        if (rightId < i) continue;
        const count = rightId - i + 2;
        const rightCol = this.columns[rightId];
        const totalWidth = sum(
          ...this.columns.slice(i, rightId + 1).map((c) => c.width)
        );
        if (left + totalWidth > edge.x) {
          const rowWidth = Math.max(
            ...rightCol
              .getOverlapRows(edge.yBottom, edge.yTop)
              .map((r) => r.width)
          );
          const width =
            sum(...this.columns.slice(i, rightId).map((c) => c.width)) +
            rowWidth;
          space = Math.min(space, (edge.x - left - width) / count);
        } else {
          const width = sum(
            ...this.columns.slice(i, rightId + 1).map((c) => c.width)
          );
          space = Math.min(space, (edge.x - left - width) / count);
        }
      }
      const v = vec(left + space - col.left, 0);
      col.move(v);

      if (!this.boundary.isInside(col)) {
        for (const row of col.rows) {
          if (!this.boundary.isInside(row)) {
            throw Error("After adjust col pos, row is outside");
          }
        }
      }
    }
  }
  adjustRowPos(): void {
    for (const col of this.columns) {
      col.adjustRowPos();
    }
  }
  adjustBoxPos(): void {
    for (const col of this.columns) {
      col.adjustBoxPos();
    }
  }
}

export class Column extends BoxContainer {
  rows: Row[] = [];
  constructor(topLeft: Vector, public boundary: Boundary) {
    super(topLeft);
  }
  get right(): number {
    if (this.rows.length === 0) return this.left;
    return Math.max(...this.rows.map((r) => r.right));
  }
  get bottom(): number {
    if (this.rows.length === 0) return this.top;
    return last(this.rows).bottom;
  }
  getCenters(): Vector[] {
    return this.rows.reduce(
      (pre: Vector[], cur) => pre.concat(cur.getCenters()),
      []
    );
  }
  getOverlapRows(yBottom: number, yTop: number): Row[] {
    return this.rows.reduce((pre: Row[], cur) => {
      if (cur.bottom > yTop || cur.top < yBottom) return pre;
      pre.push(cur);
      return pre;
    }, []);
  }
  move(vector: Vector): void {
    this.topLeft = this.topLeft.add(vector);
    for (const row of this.rows) {
      row.move(vector);
    }
  }
  fill(box: BoundingBox): boolean {
    const lastRow = last(this.rows);
    if (
      lastRow !== undefined &&
      lastRow.width + box.width <= this.width &&
      lastRow.fill(box)
    ) {
      if (!this.boundary.isInside(lastRow)) {
        throw Error("last row fill is outside");
      }

      return true;
    }

    const insert = vec(this.left, this.bottom);
    const nextRow = new Row(insert, this.boundary);
    if (nextRow.fill(box)) {
      this.rows.push(nextRow);
      if (!this.boundary.isInside(nextRow)) {
        throw Error("last row fill is outside");
      }
      return true;
    }

    return false;
  }
  adjustBoxPos(): void {
    const width = this.width;
    for (const row of this.rows) {
      row.adjustBoxPos(width);
    }
  }
  adjustRowPos(): void {
    const edges = this.boundary.getHOverlapEdges(this.left, this.right);
    const bottomIds = edges.map((e) => e.findBottom(this.rows));
    for (let i = 0; i < this.rows.length; i++) {
      const top = i === 0 ? this.top : this.rows[i - 1].bottom;
      const row = this.rows[i];
      let space = Infinity;
      for (let j = 0; j < edges.length; j++) {
        const edge = edges[j];
        const bottomId = bottomIds[j];
        if (bottomId < i) continue;
        const height = this.rows
          .slice(i, bottomId + 1)
          .reduce((pre, cur) => pre + cur.height, 0);
        const count = bottomId - i + 2;
        space = Math.min(space, (top - edge.y - height) / count);
      }
      const v = vec(0, top - space - row.top);
      row.move(v);

      if (!this.boundary.isInside(row)) {
        throw Error("After adjust row pos, row is outside");
      }
    }
  }
}

export class Row extends BoxContainer {
  boxs: BoundingBox[] = [];
  constructor(topLeft: Vector, public boundary: Boundary) {
    super(topLeft);
  }
  get right(): number {
    if (this.boxs.length === 0) return this.left;
    return last(this.boxs).right;
  }
  get bottom(): number {
    if (this.boxs.length === 0) return this.top;
    return Math.min(...this.boxs.map((b) => b.bottom));
  }
  getCenters(): Vector[] {
    return this.boxs.map((b) => b.center);
  }

  move(vector: Vector): void {
    this.topLeft = this.topLeft.add(vector);
    for (const b of this.boxs) {
      b.move(vector);
    }
  }
  fill(box: BoundingBox): boolean {
    const v = vec(this.right, this.top).sub(box.topLeft);
    box.move(v);
    this.boxs.push(box);
    if (!this.boundary.isInside(this)) {
      this.boxs.pop();
      box.move(v.mul(-1));
      return false;
    }
    return true;
  }

  adjustBoxPos(maxWidth: number): void {
    const nearX = this.boundary.getXOfNearestVEdge(this.bottom, this.top);
    const width = Math.min(maxWidth, nearX - this.left);

    const h = this.height;
    const boxWidth = sum(...this.boxs.map((b) => b.width));
    const xSpace = (width - boxWidth) / (this.boxs.length + 1);
    let left = this.left + xSpace;
    for (const b of this.boxs) {
      const ySpace = (h - b.height) / 2;

      const xMove = left - b.left;
      const yMove = this.top - ySpace - b.top;
      b.move(vec(xMove, yMove));
      left += b.width + xSpace;
    }
    if (!this.boundary.isInside(this)) {
      throw Error("After adjust box pos, row is outside");
    }
  }
}

export class HEdge {
  constructor(public xLeft: number, public xRight: number, public y: number) {}
  scale(factor: number): void {
    this.xLeft *= factor;
    this.xRight *= factor;
    this.y *= factor;
  }
  isOverlap(xLeft: number, xRight: number): boolean {
    if (xLeft > this.xRight || xRight < this.xLeft) return false;
    return true;
  }
  isInside(x: number): boolean {
    return this.xLeft <= x && x <= this.xRight;
  }
  findBottom(items: Array<Box>): number {
    let index = -1;
    let bottom = Infinity;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (this.isOverlap(item.left, item.right) && item.bottom < bottom) {
        bottom = item.bottom;
        index = i;
      }
    }
    return index;
  }
}

export class VEdge {
  constructor(public yBottom: number, public yTop: number, public x: number) {}
  scale(factor: number): void {
    this.yBottom *= factor;
    this.yTop *= factor;
    this.x *= factor;
  }
  isOverlap(yBottom: number, yTop: number): boolean {
    if (yBottom >= this.yTop || yTop <= this.yBottom) return false;
    return true;
  }
  isInside(y: number): boolean {
    return this.yBottom <= y && y <= this.yTop;
  }
  isIntersect(box: Box): boolean {
    if (
      this.isOverlap(box.bottom, box.top) &&
      box.left < this.x &&
      this.x < box.right
    )
      return true;
    return false;
  }
  findRightMost(items: Array<Box>): number {
    let index = -1;
    let right = -Infinity;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (this.isOverlap(item.bottom, item.top) && item.right > right) {
        right = item.right;
        index = i;
      }
    }
    return index;
  }
}

export class Boundary {
  hEdges: HEdge[] = [];
  vEdges: VEdge[] = [];
  protected x: number;
  protected y: number;
  constructor(public start: Vector) {
    this.x = start.x;
    this.y = start.y;
  }
  get topLeft(): Vector {
    return vec(this.hEdges[0].xLeft, last(this.vEdges).yTop);
  }
  corner(hDist: number, vDist: number): this {
    this.hEdges.push(new HEdge(this.x, this.x + hDist, this.y));
    this.x += hDist;
    this.vEdges.push(new VEdge(this.y, this.y + vDist, this.x));
    this.y += vDist;
    return this;
  }
  scale(factor: number): void {
    this.hEdges.forEach((e) => e.scale(factor));
    this.vEdges.forEach((e) => e.scale(factor));
    this.start = this.start.mul(factor);
    this.x *= factor;
    this.y *= factor;
  }
  isInside(item: Box): boolean {
    if (this.vEdges.length !== this.hEdges.length) {
      throw Error("vertical edge do not match horizontal edge");
    }
    const { left, right, bottom, top } = item;
    const bLeft = this.hEdges[0].xLeft;
    const bRight = last(this.hEdges).xRight;
    const bBottom = this.vEdges[0].yBottom;
    const bTop = last(this.vEdges).yTop;

    if (left < bLeft || left > bRight) return false;
    if (right < bLeft || right > bRight) return false;
    if (top > bTop || top < bBottom) return false;
    if (bottom > bTop || bottom < bBottom) return false;

    for (const h of this.hEdges) {
      if (h.isInside(right) && bottom <= h.y) return false;
    }
    return true;
  }
  getHOverlapEdges(xLeft: number, xRight: number): HEdge[] {
    if (this.hEdges.length === 0) {
      throw Error("h edges length is 0");
    }
    return this.hEdges.reduce((pre: HEdge[], cur: HEdge) => {
      if (cur.isOverlap(xLeft, xRight)) {
        const left = Math.max(xLeft, cur.xLeft);
        const right = Math.min(xRight, cur.xRight);
        pre.push(new HEdge(left, right, cur.y));
      }
      return pre;
    }, []);
  }
  getYOfNearestHEdge(xLeft: number, xRight: number): number {
    const edges = this.getHOverlapEdges(xLeft, xRight);
    if (edges.length === 0) {
      throw Error("edges length is 0");
    }
    return Math.max(...edges.map((v) => v.y));
  }
  getVOverlapEdges(yBottom: number, yTop: number): VEdge[] {
    if (this.vEdges.length === 0) {
      throw Error("h edges length is 0");
    }
    return this.vEdges.reduce((pre: VEdge[], cur: VEdge) => {
      if (cur.isOverlap(yBottom, yTop)) {
        const bottom = Math.max(yBottom, cur.yBottom);
        const top = Math.min(yTop, cur.yTop);
        pre.push(new VEdge(bottom, top, cur.x));
      }
      return pre;
    }, []);
  }
  getXOfNearestVEdge(yBottom: number, yTop: number): number {
    const edges = this.getVOverlapEdges(yBottom, yTop);
    if (edges.length === 0) {
      throw Error("edges length is 0");
    }
    return Math.min(...edges.map((v) => v.x));
  }
}
