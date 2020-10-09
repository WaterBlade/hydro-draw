import { Boundary } from "./Boundary";
import { vec } from "./Vector";

test("is inside", () => {
  const b = new Boundary(vec(0, 0), vec(2, 0), vec(2, 2), vec(0, 2));
  expect(b.isInside(vec(1, 1))).toBeTruthy();
  expect(b.isInside(vec(3, 0))).toBeFalsy();
});
