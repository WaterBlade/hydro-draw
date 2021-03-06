import { last, vec, Vector } from "@/draw/misc";
import { Boundary } from "../Boundary";
import { BoxContainer } from "./BoxContainer";
import { Cell } from "./Cell";

export class Row extends BoxContainer {
  boxs: Cell[] = [];
  constructor(topLeft: Vector, protected border: Boundary) {
    super(topLeft);
  }

  arrange(boundary: Boundary): void {
    const b = boundary.genSubByV(this.bottom, this.top);
    this.hArrange(b);
    this.boxs.forEach((cell) => cell.arrange(b));
    this.resetSize();
  }
  vMinSpace(
    top: number,
    preCount: number,
    preTotalHeight: number,
    boundary: Boundary
  ): number {
    const colRight = (boundary.left + boundary.right) / 2 + this.width / 2;
    const colFloor = boundary.getBottom(this.left, colRight);
    const rowFloor = boundary.getBottom(this.left, this.right);
    const bottom = this.bottom > colFloor ? colFloor : rowFloor;
    return Math.max(
      0,
      (top - bottom - preTotalHeight - this.height) / (preCount + 2)
    );
  }

  get netWidth(): number {
    return this.boxs.reduce((pre, cur) => pre + cur.netWidth, 0);
  }

  add(box: Cell): void {
    box.topLeft = vec(this.right, this.top);
    this.boxs.push(box);
    this.resetSize();
  }
  fill(cell: Cell, rightBoundary?: number): boolean {
    if (this.isEmpty()) {
      const bottomRight = vec(this.left + cell.width, this.top - cell.height);
      if (this.border.insideTest(bottomRight)) {
        this.add(cell);
        return true;
      } else {
        return false;
      }
    } else {
      let height = cell.height;
      const preCell = last(this.boxs);
      if (preCell.baseAligned && cell.baseAligned) {
        height =
          Math.max(preCell.baseTop, cell.baseTop) -
          Math.min(preCell.baseTop, cell.baseBottom);
      }
      const bottomRight = vec(
        this.left + this.netWidth + cell.netWidth,
        this.top - height
      );
      if (rightBoundary !== undefined && bottomRight.x > rightBoundary) {
        return false;
      }
      if (this.border.insideTest(bottomRight)) {
        // handle center aligned
        if (this.boxs.length === 1) {
          this.boxs[0].resetCenterAligned(false);
          this.resetSize();
        }
        cell.resetCenterAligned(false);
        // handle base aligned
        const top = Math.max(cell.baseTop, preCell.baseTop);
        const bottom = Math.min(cell.baseBottom, preCell.baseBottom);
        cell.setBase(bottom, top);
        for (const box of this.boxs) {
          if (box.baseAligned) {
            box.setBase(bottom, top);
          }
        }
        // add to collection
        this.add(cell);
        return true;
      } else {
        return false;
      }
    }
  }
  protected resetSize(): void {
    this.width = last(this.boxs).right - this.topLeft.x;
    this.height = Math.max(...this.boxs.map((c) => c.height));
  }
}
