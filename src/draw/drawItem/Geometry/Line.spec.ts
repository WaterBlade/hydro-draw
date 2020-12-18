import { Side, StrecthSide, vec } from "@/draw/misc";
import { Line } from "./Line";

test("scale", () => {
  const l = new Line(vec(0, 0), vec(1, 1));
  l.scale(5);
  expect(l.start).toEqual(vec(0, 0));
  expect(l.end).toEqual(vec(5, 5));
});

test("move", () => {
  const l = new Line(vec(0, 0), vec(1, 1));
  l.move(vec(10, 20));
  expect(l.start).toEqual(vec(10, 20));
  expect(l.end).toEqual(vec(11, 21));
});

test("bounding box", () => {
  const b = new Line(vec(0, 0), vec(1, 1)).getBoundingBox();
  expect(b.left).toEqual(0);
  expect(b.right).toEqual(1);
  expect(b.bottom).toEqual(0);
  expect(b.top).toEqual(1);
});

test("offset point", () => {
  const l = new Line(vec(0, 0), vec(2, 0));
  const ls = l.offsetStart(1, Side.Left);
  const le = l.offsetEnd(2, Side.Left);
  const rs = l.offsetStart(1, Side.Right);
  const re = l.offsetEnd(2, Side.Right);
  expect(ls).toEqual(vec(0, 1));
  expect(le).toEqual(vec(2, 2));
  expect(rs).toEqual(vec(0, -1));
  expect(re).toEqual(vec(2, -2));
});
test("offset", () => {
  const l = new Line(vec(0, 0), vec(2, 0));
  const off = l.offset(1, Side.Left);
  expect(off.start).toEqual(vec(0, 1));
  expect(off.end).toEqual(vec(2, 1));
});
test("divide even", () => {
  const l = new Line(vec(0, 0), vec(10, 0));
  l.divide(2, StrecthSide.both);
  const p = l.points;
  expect(p[0]).toEqual(vec(0, 0));
  expect(p[1]).toEqual(vec(2, 0));
  expect(p[2]).toEqual(vec(4, 0));
  expect(p[3]).toEqual(vec(6, 0));
  expect(p[4]).toEqual(vec(8, 0));
  expect(p[5]).toEqual(vec(10, 0));
});
test("divide uneven", () => {
  const l = new Line(vec(0, 0), vec(11, 0));
  l.divide(2, StrecthSide.both);
  const p = l.points;
  expect(p[0]).toEqual(vec(0, 0));
  expect(p[1]).toEqual(vec(1.5, 0));
  expect(p[2]).toEqual(vec(3.5, 0));
  expect(p[3]).toEqual(vec(5.5, 0));
  expect(p[4]).toEqual(vec(7.5, 0));
  expect(p[5]).toEqual(vec(9.5, 0));
  expect(p[6]).toEqual(vec(11, 0));
});
test("divide even head", () => {
  const l = new Line(vec(0, 0), vec(10, 0));
  l.divide(2, StrecthSide.head);
  const p = l.points;
  expect(p[0]).toEqual(vec(0, 0));
  expect(p[1]).toEqual(vec(2, 0));
  expect(p[2]).toEqual(vec(4, 0));
  expect(p[3]).toEqual(vec(6, 0));
  expect(p[4]).toEqual(vec(8, 0));
  expect(p[5]).toEqual(vec(10, 0));
});
test("divide uneven head", () => {
  const l = new Line(vec(0, 0), vec(11, 0));
  l.divide(2, StrecthSide.head);
  const p = l.points;
  expect(p[0]).toEqual(vec(0, 0));
  expect(p[1]).toEqual(vec(1, 0));
  expect(p[2]).toEqual(vec(3, 0));
  expect(p[3]).toEqual(vec(5, 0));
  expect(p[4]).toEqual(vec(7, 0));
  expect(p[5]).toEqual(vec(9, 0));
  expect(p[6]).toEqual(vec(11, 0));
});
test("divide uneven tail", () => {
  const l = new Line(vec(0, 0), vec(11, 0));
  l.divide(2, StrecthSide.tail);
  const p = l.points;
  expect(p[0]).toEqual(vec(0, 0));
  expect(p[1]).toEqual(vec(2, 0));
  expect(p[2]).toEqual(vec(4, 0));
  expect(p[3]).toEqual(vec(6, 0));
  expect(p[4]).toEqual(vec(8, 0));
  expect(p[5]).toEqual(vec(10, 0));
  expect(p[6]).toEqual(vec(11, 0));
});
test("include", () => {
  const l = new Line(vec(0, 0), vec(10, 0));
  expect(l.includeTest(vec(5, 0))).toBeTruthy();
  expect(l.includeTest(vec(11, 0))).toBeFalsy();
});
test('get point norm', ()=>{
  const l = new Line(vec(0, 0), vec(10, 0));
  const p = l.getPointNorm();
  expect(p.x).toBeCloseTo(0);
  expect(p.y).toBeCloseTo(1);
});
test('get point tangent', ()=>{
  const l = new Line(vec(0, 0), vec(10, 0));
  const p = l.getPointTangent();
  expect(p.x).toEqual(1);
  expect(p.y).toEqual(0);
});
test('distance to', ()=>{
  const l= new Line(vec(0, 0), vec(10, 0));
  expect(l.distanceTo(vec(5, 2))).toEqual(2);
});
test('get nearest point', ()=>{
  const l = new Line(vec(0, 0), vec(10, 0));
  const p = l.getNearestPt(vec(5, 2));
  expect(p.x).toBeCloseTo(5);
  expect(p.y).toBeCloseTo(0);
})
