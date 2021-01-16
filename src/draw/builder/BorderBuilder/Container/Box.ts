import { DrawItem } from "@/draw/drawItem";
import { vec, Vector } from "@/draw/misc";
import { Boundary } from "../Boundary";


export class Box {
  constructor(public topLeft: Vector, public width = 0, public height = 0) { }
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
    return this.top - this.height;
  }
  crossTest(boundary: Boundary): boolean {
    const pt = vec(this.right, this.bottom);
    return !boundary.insideTest(pt);
  }
  hMinSpace(left: number, preCount: number, preTotalWidth: number, boundary: Boundary): number {
    const right = Math.max(this.right, boundary.getRight(this.bottom, this.top));
    return Math.max(0, (right - left - preTotalWidth - this.width) / (preCount + 2));
  }
  vMinSpace(top: number, preCount: number, preTotalHeight: number, boundary: Boundary): number {
    const bottom = Math.min(this.bottom, boundary.getBottom(this.left, this.right));
    return Math.max(0, (top - bottom - preTotalHeight - this.height) / (preCount + 2));
  }
  arrange(boundary: Boundary): void {
    // to override
    boundary;
  }
  getItems(): DrawItem[] {
    // to override
    return [];
  }
  protected resetSize(): void {
    // to override
  }
}
