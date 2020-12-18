import { vec } from "@/draw/misc";
import { Arc } from "./Arc";
import { Line } from "./Line";
import { Polyline } from "./Polyline";

test("offset", () => {
  const p = new Polyline();
  expect(p.segments.length).toEqual(0);
});

test("add line", () => {
  const p = new Polyline();
  p.lineTo(1, 2);
  expect(p.segments.length).toEqual(1);

  const l = p.segments[0] as Line;
  expect(l.start).toEqual(vec(0, 0));
  expect(l.end).toEqual(vec(1, 2));
});
test("add arc 180", () => {
  const p = new Polyline();
  p.arcTo(2, 0, 180);
  expect(p.segments.length).toEqual(1);
  const a = p.segments[0] as Arc;
  expect(a.center).toEqual(vec(1, 0));
  expect(a.radius).toEqual(1);
  expect(a.startAngle).toEqual(180);
  expect(a.endAngle).toEqual(0);
});
test("add arc 90", () => {
  const p = new Polyline();
  p.arcTo(2, 0, 90);
  expect(p.segments.length).toEqual(1);
  const a = p.segments[0] as Arc;
  expect(a.center.x).toBeCloseTo(1);
  expect(a.center.y).toBeCloseTo(1);
  expect(a.radius).toBeCloseTo(1.414, 0.01);
  expect(a.startAngle).toBeCloseTo(225);
  expect(a.endAngle).toBeCloseTo(315);
});
test("close", () => {
  const p = new Polyline();
  p.lineTo(2, 0);
  p.lineTo(2, 2);
  p.close();
  expect(p.segments.length).toEqual(3);
  expect(p.segments[2].start).toEqual(vec(2, 2));
  expect(p.segments[2].end).toEqual(vec(0, 0));
});
test("line offset", () => {
  const p = new Polyline();
  p.lineTo(2, 0);
  p.lineTo(2, 2);
  const offset = p.offset(1);
  expect(offset.segments.length).toEqual(2);
  const first = offset.segments[0] as Line;
  expect(first.start).toEqual(vec(0, 1));
  expect(first.end).toEqual(vec(1, 1));
  const second = offset.segments[1] as Line;
  expect(second.start).toEqual(vec(1, 1));
  expect(second.end).toEqual(vec(1, 2));
});
test("line arc offset", () => {
  const p = new Polyline();
  p.lineTo(10, 0);
  p.arcTo(10, 4, 180);
  const o = p.offset(1);
  expect(o.segments.length).toEqual(2);
  const first = o.segments[0] as Line;
  expect(first.start).toEqual(vec(0, 1));
  const second = o.segments[1] as Arc;
  expect(second.radius).toEqual(1);
});
test("ray iter", () => {
  const p = new Polyline();
  p.lineBy(0, -50).lineBy(100, 0).lineBy(0, 50);
  expect(p.rayIntersect(vec(-20, -20), vec(1, 0))).toEqual([
    vec(0, -20),
    vec(100, -20),
  ]);
});
test('get nearest pt', ()=>{
  const p = new Polyline();
  p.lineTo(10, 0);
  p.arcTo(10, 4, 180);
  const n = p.getNearestPt(vec(2, 4));
  expect(n.x).toBeCloseTo(2);
  expect(n.y).toBeCloseTo(0);
});
test('distance to', ()=>{
  const p = new Polyline();
  p.lineTo(10, 0);
  p.arcTo(10, 4, 180);
  expect(p.distanceTo(vec(2, 4))).toBeCloseTo(4);
});
test('get nearest seg', ()=>{
  const p = new Polyline();
  p.lineTo(10, 0);
  p.arcTo(10, 4, 180);
  const seg = p.getNearestSegment(vec(2, 4));
  expect(seg).toBeInstanceOf(Line);
});
test('divide', ()=>{
  const p = new Polyline();
  p.lineBy(0, -50).lineBy(100, 0).lineBy(0, 50);
  p.divide(10);
  const pts = p.points;
  expect(pts.length).toEqual(21);
  expect(pts[0]).toEqual(vec(0, 0));
  expect(pts[1]).toEqual(vec(0, -10));
});
test('project', ()=>{
  const p = new Polyline();
  p.lineBy(0, -50).lineBy(100, 0).lineBy(0, 50);
  p.divide(10)
  const op = p.project(10);
  const pts = op.points;
  expect(pts.length).toEqual(21);
  expect(pts[0]).toEqual(vec(10, 0));
  expect(pts[1]).toEqual(vec(10, -10));
});
