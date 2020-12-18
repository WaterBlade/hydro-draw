import { RotateDirection, Side, Vector } from "@/draw/misc";
import { Arc } from "./Arc";
import { Line } from "./Line";
import {
  rawInterCircleAndCircle,
  rawInterLineAndCircle,
  rawInterLineAndLine,
} from "./RawIntersect.function";

function offsetJointLineAndLine(
  left: Line,
  right: Line,
  dist: number,
  side: Side
): Vector {
  const offsetLeft = left.offset(dist, side);
  const offsetRight = right.offset(dist, side);
  if (offsetLeft.end.closeTo(offsetRight.start, 1e-6)) {
    return offsetLeft.end;
  } else {
    return rawInterLineAndLine(
      offsetLeft.start,
      offsetLeft.end,
      offsetRight.start,
      offsetRight.end
    )[0];
  }
}
function offsetJointArcAndArc(
  left: Arc,
  right: Arc,
  dist: number,
  side: Side
): Vector {
  const offsetLeft = left.offset(dist, side);
  const offsetRight = right.offset(dist, side);

  const offsetIters = rawInterCircleAndCircle(
    offsetLeft.center,
    offsetLeft.radius,
    offsetRight.center,
    offsetRight.radius
  );

  if (offsetIters.length === 0) {
    throw Error("arc offset failure, do not contact");
  }

  if (offsetIters.length === 1) {
    return offsetIters[0];
  }

  const intersection = left.end;

  const d0 = offsetIters[0].sub(intersection).length();
  const d1 = offsetIters[1].sub(intersection).length();
  if (Math.abs(d0 - d1) < 1e-6) {
    const c0 = left.direction === RotateDirection.counterclockwise ? 1 : -1;
    const v1 = intersection.sub(left.center);
    const v2 = offsetIters[0].sub(left.center);
    if (c0 * v1.cross(v2) < 0) return offsetIters[0];
    return offsetIters[1];
  } else if (d0 < d1) {
    return offsetIters[0];
  } else {
    return offsetIters[1];
  }
}
function offsetJointLineAndArc(
  line: Line,
  arc: Arc,
  dist: number,
  side: Side
): Vector {
  const offsetLine = line.offset(dist, side);
  const offsetArc = arc.offset(dist, side);
  const offsetIters = rawInterLineAndCircle(
    offsetLine.start,
    offsetLine.end,
    offsetArc.center,
    offsetArc.radius
  );

  if (offsetIters.length === 0) {
    throw Error("no intersect");
  }
  if (offsetIters.length === 1) {
    return offsetIters[0];
  }

  const isLineAhead = line.end.closeTo(arc.start, 1e-6);
  const intersection = isLineAhead ? line.end : line.start;

  const d0 = offsetIters[0].sub(intersection).length();
  const d1 = offsetIters[1].sub(intersection).length();
  if (Math.abs(d0 - d1) < 1e-6) {
    const c0 = arc.direction === RotateDirection.counterclockwise ? 1 : -1;
    const v1 = intersection.sub(arc.center);
    const v2 = offsetIters[0].sub(arc.center);
    if (isLineAhead) {
      if (c0 * v1.cross(v2) > 0) return offsetIters[0];
      return offsetIters[1];
    } else {
      if (c0 * v1.cross(v2) < 0) return offsetIters[0];
      return offsetIters[1];
    }
  } else if (d0 < d1) {
    return offsetIters[0];
  } else {
    return offsetIters[1];
  }
}

export function offsetJoint(
  left: Line,
  right: Line,
  dist: number,
  side: Side
): Vector;
export function offsetJoint(
  left: Line,
  right: Arc,
  dist: number,
  side: Side
): Vector;
export function offsetJoint(
  left: Arc,
  right: Line,
  dist: number,
  side: Side
): Vector;
export function offsetJoint(
  left: Arc,
  right: Arc,
  dist: number,
  side: Side
): Vector;
export function offsetJoint(
  left: Line | Arc,
  right: Line | Arc,
  dist: number,
  side: Side
): Vector;
export function offsetJoint(
  left: Line | Arc,
  right: Line | Arc,
  dist: number,
  side: Side
): Vector {
  if (left instanceof Line) {
    if (right instanceof Line)
      return offsetJointLineAndLine(left, right, dist, side);
    else return offsetJointLineAndArc(left, right, dist, side);
  } else {
    if (right instanceof Line)
      return offsetJointLineAndArc(right, left, dist, side);
    else return offsetJointArcAndArc(left, right, dist, side);
  }
}
