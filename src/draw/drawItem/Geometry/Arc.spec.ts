import { RotateDirection, Side, StrecthSide, vec } from "@/draw/misc";
import { Arc } from "./Arc";

test("scale", () => {
  const arc = new Arc(vec(3, 2), 2, 0, 180);
  arc.scale(5);
  expect(arc.center).toEqual(vec(15, 10));
  expect(arc.radius).toEqual(10);
});

test("move", () => {
  const arc = new Arc(vec(3, 2), 2, 0, 180);
  arc.move(vec(10, 20));
  expect(arc.center).toEqual(vec(13, 22));
});

test("boundingbox", () => {
  const arc = new Arc(vec(3, 2), 2, 0, 180);
  const box = arc.getBoundingBox();
  expect(box.Center.x).toEqual(3);
  expect(box.Center.y).toEqual(3);
});

test("mid", () => {
  const a = new Arc(vec(0, 0), 2, 0, 180);
  const m = a.mid;
  expect(m.x).toBeCloseTo(0);
  expect(m.y).toBeCloseTo(2);
});

test("calc angle", () => {
  const a = new Arc(vec(0, 0), 2, 0, 90);
  expect(a.calcAngle()).toEqual(90);
});

test("offset", () => {
  const a = new Arc(vec(0, 0), 2, 0, 180);
  const b = a.offset(2, Side.Right);
  expect(b.center).toEqual(vec(0, 0));
  expect(b.radius).toEqual(4);
});

test("offset point", () => {
  const a = new Arc(vec(0, 0), 2, 0, 180);
  expect(a.offsetPoint(vec(0, 2), 2, Side.Right)).toEqual(vec(0, 4));
});

test("divide even", () => {
  const a = new Arc(vec(0, 0), 4, 0, 180, RotateDirection.counterclockwise);
  a.divide(Math.PI * 2);
  const p = a.points;
  expect(p.length).toEqual(3);
  expect(p[1].x).toBeCloseTo(0);
  expect(p[1].y).toBeCloseTo(4);
});
test("divide uneven", () => {
  const a = new Arc(vec(0, 0), 4, 0, 180, RotateDirection.counterclockwise);
  a.divide(Math.PI * 1.2);
  const p = a.points;
  expect(p.length).toEqual(5);
  expect(p[1].x).toBeCloseTo(4 * Math.cos((0.8 / 4) * Math.PI));
});
test("divide uneven head", () => {
  const a = new Arc(vec(0, 0), 4, 0, 180, RotateDirection.counterclockwise);
  a.divide(Math.PI * 1.2, StrecthSide.head);
  const p = a.points;
  expect(p.length).toEqual(4);
  expect(p[1].x).toBeCloseTo(4 * Math.cos((1.6 / 4) * Math.PI));
});
test("include", () => {
  const a = new Arc(vec(0, 0), 2, 0, 180, RotateDirection.counterclockwise);
  expect(a.includeTest(vec(0, 2))).toBeTruthy();
  expect(a.includeTest(vec(0, -2))).toBeFalsy();
});
test("check ahead", () => {
  const a = new Arc(vec(0, 0), 2, 0, 180, RotateDirection.counterclockwise);
  expect(a.checkAhead(vec(2, 0), vec(0, 2))).toBeTruthy();
});
test("get point norm counterclockwise", () => {
  const a = new Arc(vec(0, 0), 2, 0, 180, RotateDirection.counterclockwise);
  const p = a.getPointNorm(vec(0, 2));
  expect(p.x).toBeCloseTo(0);
  expect(p.y).toBeCloseTo(-1);
});
test("get point norm clockwise", () => {
  const a = new Arc(vec(0, 0), 2, 0, 180, RotateDirection.clockwise);
  const p = a.getPointNorm(vec(0, -2));
  expect(p.x).toBeCloseTo(0);
  expect(p.y).toBeCloseTo(-1);
});
test("get point tangent counterclockwise", () => {
  const a = new Arc(vec(0, 0), 2, 0, 180, RotateDirection.counterclockwise);
  const p = a.getPointTangent(vec(0, 2));
  expect(p.x).toBeCloseTo(-1);
  expect(p.y).toBeCloseTo(0);
});
test("get point tangent clockwise", () => {
  const a = new Arc(vec(0, 0), 2, 0, 180, RotateDirection.clockwise);
  const p = a.getPointTangent(vec(0, -2));
  expect(p.x).toBeCloseTo(-1);
  expect(p.y).toBeCloseTo(0);
});
test("distance to", () => {
  const a = new Arc(vec(0, 0), 2, 0, 180, RotateDirection.counterclockwise);
  expect(a.distanceTo(vec(0, 4))).toBeCloseTo(2);
});
test("get nearest point", () => {
  const a = new Arc(vec(0, 0), 2, 0, 180, RotateDirection.counterclockwise);
  const p = a.getNearestPt(vec(0, 4));
  expect(p.x).toEqual(0);
  expect(p.y).toEqual(2);
});
test("mirror by y axis", () => {
  const a = new Arc(vec(1, 0), 2, 0, 180, RotateDirection.counterclockwise);
  const b = a.mirrorByYAxis();
  expect(b.center).toEqual(vec(-1, 0));
  expect(b.startAngle).toEqual(180);
  expect(b.endAngle).toEqual(0);
  expect(b.direction).toEqual(RotateDirection.clockwise);
});
