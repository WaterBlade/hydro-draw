import { vec, Vector } from "./Vector";

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
  expect(a.sub(b).toArray()).toEqual([-1, 1]);
});
test("mul", () => {
  const a = vec(3, 4);
  expect(a.mul(3).toArray()).toEqual([9, 12]);
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
test("perpend", () => {
  const a = vec(5, -2);
  expect(a.perpend().toArray()).toEqual([2, 5]);
});
test("unit", () => {
  const a = vec(3, 4).unit();
  expect(a.x).toEqual(0.6);
  expect(a.y).toEqual(0.8);
});
test("close to", () => {
  const a = vec(0.52, 0.555);
  const b = vec(0.5234, 0.555);
  expect(a.closeTo(b, 3)).toBeFalsy();
  expect(a.closeTo(b, 2)).toBeTruthy();
});
test("toFixed", () => {
  const a = new Vector(0, 1);
  expect(a.toFixed(4)).toEqual("0.0000,1.0000");
});
