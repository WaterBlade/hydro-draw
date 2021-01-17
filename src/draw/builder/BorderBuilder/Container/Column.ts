import { last, vec, Vector } from "@/draw/misc";
import { Boundary } from "../Boundary";
import { BoxContainer } from "./BoxContainer";
import { Cell } from "./Cell";
import { Row } from "./Row";


export class Column extends BoxContainer {
  constructor(topLeft: Vector, protected border: Boundary) {
    super(topLeft);
  }
  boxs: Row[] = [];
  fill(cell: Cell): boolean{
    const tail = last(this.boxs);
    if(tail && tail.fill(cell, this.right)){
      this.resetSize();
      return true;
    }else{
      const row = new Row(vec(this.left, this.bottom), this.border);
      if(row.fill(cell)){
        this.add(row);
        return true;
      }else{
        return false;
      }
    }
  }
  add(row: Row): void {
    this.boxs.push(row);
    this.resetSize();
  }
  protected resetSize(): void {
    this.width = Math.max(...this.boxs.map((r) => r.width));
    this.height = this.topLeft.y - last(this.boxs).bottom;
  }
  arrange(boundary: Boundary): void {
    const b = boundary.genSubByH(this.left-this.leftSpace/2, this.right+this.rightSpace/2);
    this.vArrange(b);
    this.boxs.forEach(row => row.arrange(b));
    this.resetSize();
  }
  hMinSpace(left: number, preCount: number, preTotalWidth: number, boundary: Boundary): number {
    if (this.crossTest(boundary) && this.boxs.length !== 0) {
      const spaceList = [];
      for (const row of this.boxs) {
        const right = boundary.getRight(row.bottom, row.top);
        const totalWidth = preTotalWidth + row.width;
        const space = Math.max(0, (right - left - totalWidth) / (preCount + 2));
        spaceList.push(space);
      }
      return Math.min(...spaceList);
    } else {
      const right = boundary.getRight(this.bottom, this.top);
      const totalWidth = preTotalWidth + this.width;
      return (right - left - totalWidth) / (preCount + 2);
    }
  }
}
