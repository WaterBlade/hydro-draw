import { Range } from "./Range";

test("overlap", () => {
  const a = new Range(1, 10);
  const b = new Range(2, 5);
  const c = new Range(6, 7);
  expect(a.isOverlap(b)).toBeTruthy();
  expect(a.isOverlap(c)).toBeTruthy();
  expect(b.isOverlap(c)).toBeFalsy();
});
