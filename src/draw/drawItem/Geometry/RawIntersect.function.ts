import { vec, Vector } from "@/draw/misc";

export function rawInterLineAndLine(
  s0: Vector,
  e0: Vector,
  s1: Vector,
  e1: Vector
): Vector[] {
  const { x: ax, y: ay } = s0;
  const { x: bx, y: by } = e0;
  const { x: cx, y: cy } = s1;
  const { x: dx, y: dy } = e1;

  const denom =
    ax * (dy - cy) + bx * (cy - dy) + dx * (by - ay) + cx * (ay - by);
  if (Math.abs(denom) < 1e-6) {
    if (Math.abs(s1.sub(s0).cross(s1.sub(e0))) > 1e-6) return [];
    return [s0, e0, s1, e1];
  }
  const sNum = ax * (dy - cy) + cx * (ay - dy) + dx * (cy - ay);
  const s = sNum / denom;
  const pt = vec(ax + s * (bx - ax), ay + s * (by - ay));
  return [pt];
}

export function rawInterCircleAndCircle(
  c0: Vector,
  r0: number,
  c1: Vector,
  r1: number
): Vector[] {
  const dist = c0.sub(c1).length();
  if (dist > r0 + r1) {
    throw Error("intersect error: arc do not contact");
  }
  if (Math.abs(dist - r0 - r1) < 1e-6) {
    const p = c0.add(c1.sub(c0).mul(r0 / (r0 + r1)));
    return [p];
  }
  const u = c1.sub(c0);
  const v = vec(u.y, -u.x);

  const r02 = r0 ** 2;
  const r12 = r1 ** 2;
  const u2 = u.dot(u);

  const s = 0.5 * ((r02 - r12) / u2 + 1);
  const t = Math.sqrt(r02 / u2 - s ** 2);

  const p0 = c0.add(u.mul(s)).add(v.mul(t));
  const p1 = c0.add(u.mul(s)).add(v.mul(-t));

  return [p0, p1];
}

export function rawInterLineAndCircle(
  start: Vector,
  end: Vector,
  center: Vector,
  radius: number
): Vector[] {
  const d = end.sub(start);
  const D = start.sub(center);
  const r = radius;

  const root = d.dot(D) ** 2 - d.dot(d) * (D.dot(D) - r ** 2);
  if (root < 0 && Math.abs(root) / d.dot(d) > 1e-6) {
    return [];
  }
  if (Math.abs(root) / d.dot(d) < 1e-6) {
    const t = -d.dot(D) / d.dot(d);
    const p = start.add(d.mul(t));
    return [p];
  } else {
    const left = -d.dot(D) / d.dot(d);
    const right = Math.sqrt(root) / d.dot(d);
    const t1 = left + right;
    const t2 = left - right;

    const p0 = start.add(d.mul(t1));
    const p1 = start.add(d.mul(t2));
    return [p0, p1];
  }
}
