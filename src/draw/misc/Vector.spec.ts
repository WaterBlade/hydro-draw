import { toLeftTest, vec, Vector } from "./Vector";

test("add", () => {
  const a = new Vector(0, 1);
  const b = new Vector(1, 0);
  const c = a.add(b);
  expect(c.x).toEqual(1);
  expect(c.y).toEqual(1);
});
test("sub", () => {
  const a = vec(0, 1);
  const b = vec(1, 0);
  expect(a.sub(b)).toEqual(vec(-1, 1));
});
test("mul", () => {
  const a = vec(3, 4);
  expect(a.mul(3)).toEqual(vec(9, 12));
});
test("dot", () => {
  const a = vec(3, 4);
  expect(a.dot(vec(4, 3))).toEqual(24);
});
test("cross", () => {
  const a = vec(1, 0);
  expect(a.cross(vec(0, 1))).toBeGreaterThan(0);
  expect(a.cross(vec(1, 1))).toBeGreaterThan(0);
  expect(a.cross(vec(0, -1))).toBeLessThan(0);
});
test("equal", () => {
  const a = vec(0, 0);
  const b = vec(1, 1);
  const c = vec(1, 1);
  expect(a.eq(b)).toBeFalsy();
  expect(b.eq(c)).toBeTruthy();
});
test("length", () => {
  const a = vec(1, 1);
  expect(a.length()).toBeCloseTo(1.414, 3);
});
test("norm", () => {
  const a = vec(5, -2);
  expect(a.norm()).toEqual(vec(2, 5));
});
test("unit", () => {
  const a = vec(3, 4).unit();
  expect(a.x).toEqual(0.6);
  expect(a.y).toEqual(0.8);
});
test("rotate", () => {
  const a = vec(3, 4);
  const b = a.rotate(90);
  expect(b.x).toBeCloseTo(-4);
  expect(b.y).toBeCloseTo(3);
  const c = a.rotate(180);
  expect(c.x).toBeCloseTo(-3);
  expect(c.y).toBeCloseTo(-4);
  const d = a.rotate(270);
  expect(d.x).toBeCloseTo(4);
  expect(d.y).toBeCloseTo(-3);
  const f = a.rotate(360);
  expect(f.x).toBeCloseTo(3);
  expect(f.y).toBeCloseTo(4);
});
test("quadrant angle", () => {
  const a = vec(1, 1);
  expect(a.quadrantAngle()).toBeCloseTo(45);
  const b = vec(0, 1);
  expect(b.quadrantAngle()).toBeCloseTo(90);
  const c = vec(-1, 0);
  expect(c.quadrantAngle()).toBeCloseTo(180);
  expect(vec(-1, -1).quadrantAngle()).toBeCloseTo(225);
});
test("close to", () => {
  const a = vec(0.52, 0.555);
  const b = vec(0.5234, 0.555);
  expect(a.closeTo(b, 1e-3)).toBeFalsy();
  expect(a.closeTo(b, 1e-2)).toBeTruthy();
});
test("toFixed", () => {
  const a = new Vector(0, 1);
  expect(a.toFixed(4)).toEqual("0.0000,1.0000");
});
test("toLeft test", () => {
  const a = vec(0, 0);
  const b = vec(10, 0);
  const c = vec(5, 2);
  const d = vec(5, -2);
  expect(toLeftTest(a, b, c)).toBeTruthy();
  expect(toLeftTest(a, b, d)).toBeFalsy();
});
test('scaleby test', ()=>{
  const a = vec(10, 10);
  expect(a.scaleBy(vec(2, 2), 0.5, 1)).toEqual(vec(6, 10));
})
