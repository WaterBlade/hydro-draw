import { Circle, Line, rawInterLineAndLine } from "@/draw/drawItem";
import { last, Side, vec, Vector } from "@/draw/misc";
import { PointNote } from "./PointNote";

export class LayerPointNote extends PointNote {
  protected _layerSide = Side.Left;
  protected _layers: Line[] = [];
  layers(
    start: Vector,
    end: Vector,
    pointCount: number,
    layerSpace: number,
    layerCount: number,
    side = Side.Left
  ): this {
    const f = side === Side.Left ? 1 : -1;
    const n = end.sub(start).norm().unit().mul(f);
    for (let i = 0; i < layerCount; i++) {
      const v = n.mul(i * layerSpace);
      this._layers.push(
        new Line(start.add(v), end.add(v)).divideByCount(pointCount - 1)
      );
    }
    const rebars = this.rebars;
    const r = this.drawRadius;
    this._layers.forEach((layer) => {
      layer.points.forEach((p) => rebars.push(new Circle(p, r).thickLine()));
    });
    return this;
  }
  onlineNote(pt: Vector, dir: Vector): this {
    const iters = this.genIters(pt, dir);
    const [start, end] = this.findTwoEnds(pt, dir, iters);
    const n = end.sub(start).norm();
    const isNormAndPointsSameSide = this._layers[0].start.sub(start).dot(n) > 0;
    const side = isNormAndPointsSameSide ? Side.Right : Side.Left;
    this.notes.push(
      new Line(start, end),
      ...this.genCrossLine(pt, iters),
      ...this.genOnlineText(pt, dir, side)
    );

    return this;
  }
  leaderNote(pt: Vector, leaderVector: Vector, noteVector?: Vector): this {
    const dir = leaderVector;
    const iters = this.genIters(pt, dir);
    const start = this.findFarest(pt, iters);
    this.notes.push(
      ...this.genCrossLine(pt, iters),
      ...this.genLeader(start, pt, noteVector)
    );

    return this;
  }
  protected genCrossLine(pt: Vector, iters: Vector[]): Line[] {
    const layer0 = this._layers[0];
    const start = layer0.start;
    const end = layer0.end;
    const points0 = layer0.points;
    const space = points0[0].sub(points0[1]).length() / 2;
    const res: Line[] = [];
    let n = end.sub(start).norm().unit().mul(space);
    if (n.dot(pt.sub(start)) < 0) {
      n = n.mul(-1);
    }

    const layers = this._layers;

    const count =
      points0.length % 2 === 0 ? points0.length / 2 : (points0.length - 1) / 2;
    for (let i = 0; i < count; i++) {
      const iter = iters[i];
      let dist = 0;
      let farPt = vec(0, 0);
      for (const layer of layers) {
        const pts = layer.points;
        const left = pts[2 * i];
        const right = pts[2 * i + 1];
        const mid = left.add(right).mul(0.5).add(n);
        res.push(new Line(left, mid), new Line(right, mid));
        const d = mid.sub(iter).length();
        if (d > dist) {
          dist = d;
          farPt = mid;
        }
      }
      res.push(new Line(iter, farPt));
    }
    if (points0.length % 2 === 1) {
      const iter = last(iters);
      let dist = 0;
      let farPt = vec(0, 0);
      for (const layer of layers) {
        const [left, right] = layer.points.slice(-2);
        const mid = left.add(right).mul(0.5).add(n);
        res.push(new Line(right, mid));
        const d = mid.sub(iter).length();
        if (d > dist) {
          dist = d;
          farPt = mid;
        }
      }
      res.push(new Line(iter, farPt));
    }
    return res;
  }

  protected genIters(pt: Vector, dir: Vector): Vector[] {
    const res: Vector[] = [];
    const layer = this._layers[0];
    if (!layer) {
      throw Error("layer not init");
    }
    const { start, end } = layer;
    const ptOnDir = pt.add(dir);
    const points = layer.points;
    const n = end.sub(start).norm();
    const count =
      points.length % 2 === 0 ? points.length / 2 : (points.length - 1) / 2;
    for (let i = 0; i < count; i++) {
      const left = points[2 * i];
      const right = points[2 * i + 1];
      const mid = left.add(right).mul(0.5);
      const iters = rawInterLineAndLine(mid, mid.add(n), pt, ptOnDir);
      if (iters.length === 0) {
        throw Error("line do not iter");
      }
      res.push(iters[0]);
    }
    if (points.length % 2 === 1) {
      const [left, right] = layer.points.slice(-2);
      const mid = left.add(right).mul(0.5).add(n);
      const iters = rawInterLineAndLine(mid, mid.add(n), pt, ptOnDir);
      if (iters.length === 0) {
        throw Error("line do not iter");
      }
      res.push(iters[0]);
    }

    return res;
  }
}
