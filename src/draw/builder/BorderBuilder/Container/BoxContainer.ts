import { DrawItem } from "@/draw/drawItem";
import { sum, vec } from "@/draw/misc";
import { Boundary } from "../Boundary";
import { Box } from "./Box";

export class BoxContainer extends Box{
  boxs: Box[] = [];
  isEmpty(): boolean{
    return this.boxs.length === 0;
  }
  hArrange(boundary: Boundary): void{
    const leftMost = this.topLeft.x;
    const cols = this.boxs;
    const colCount = cols.length;
    for (let i = 0; i < colCount; i++) {
      const spaceList = [];
      const left = i === 0 ? leftMost : cols[i - 1].right;
      for (let j = i; j < colCount; j++) {
        const rightCol = cols[j];
        const count = j - i;
        const preTotalWidth = sum(...cols.slice(i, j).map((c) => c.width));
        spaceList.push(rightCol.hMinSpace(left, count, preTotalWidth, boundary));
      }
      const col = cols[i];
      const space = Math.min(...spaceList);
      col.leftSpace = space;
      if(i !== 0){
        cols[i-1].rightSpace = space;
      }
      if(i === colCount-1){
        col.rightSpace = space;
      }
      col.topLeft = vec(left + space, this.top);
    }
    this.resetSize();
  }
  vArrange(boundary: Boundary): void{
    const topMost = this.topLeft.y;
    const rows = this.boxs;
    const rowCount = rows.length;
    for (let i = 0; i < rowCount; i++) {
      const spaceList = [];
      const top = i === 0 ? topMost : rows[i - 1].bottom;
      for (let j = i; j < rowCount; j++) {
        const bottomRow = rows[j];
        const count = j - i;
        const preTotalHeight = sum(...rows.slice(i, j).map(c => c.height));
        spaceList.push(bottomRow.vMinSpace(top, count, preTotalHeight, boundary));
      }
      const row = rows[i];
      row.topLeft = vec(this.left, top - Math.min(...spaceList));
    }
    this.resetSize();
  }
  getItems(): DrawItem[]{
    return this.boxs.reduce((pre: DrawItem[], cur)=> pre.concat(cur.getItems()), []);
  }
}