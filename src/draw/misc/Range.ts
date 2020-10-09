export class Range {
  constructor(public left: number, public right: number) {}
  isOverlap(range: Range): boolean {
    if (range.left > this.right || range.right < this.left) return false;
    return true;
  }
}
