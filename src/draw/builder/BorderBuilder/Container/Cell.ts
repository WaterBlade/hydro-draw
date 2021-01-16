import { DrawItem } from "@/draw/drawItem";
import { vec } from "@/draw/misc";
import { Boundary } from "../Boundary";
import { Box } from "./Box";

export class Cell extends Box {
  constructor(
    protected item: DrawItem,
    protected title?: DrawItem,
    protected centerAligned = false,
    protected titlePosKeep = false
  ) {
    super(vec(0, 0));
    this.resetSize();
  }
  arrange(boundary: Boundary): void {
    const { bottom, top } = boundary;
    const xMid = (this.left + this.right) / 2;
    const yTitleTop = bottom + (this.title ? this.title.getBoundingBox().height : 0);
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
    this.resetSize();
  }
  get netWidth(): number{
    return this._netWidth;
  }
  protected _netWidth = 0;
  protected resetSize(): void {
    const box = this.item.getBoundingBox();
    this.width = box.width;
    this._netWidth = box.width;
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
        this._netWidth =
          Math.max(box.right, titleBox.right) -
          Math.min(box.left, titleBox.left);
      } else {
        this._netWidth = Math.max(box.width, titleBox.width);
      }
      this.height += titleBox.height * 2.5;
    }
  }
  resetCenterAligned(centerAligned = false): this {
    if(this.centerAligned !== centerAligned){
      this.centerAligned = centerAligned;
      this.resetSize();
    }
    return this;
  }
  getItems(): DrawItem[] {
    const res: DrawItem[] = [];
    if (this.item)
      res.push(this.item);
    if (this.title)
      res.push(this.title);
    return res;
  }
}
