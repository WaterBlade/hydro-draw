import { vec } from "../Vector";
import { Arrow } from "./Arrow";

test("scale", () => {
  const a = new Arrow(vec(1, 1), vec(3, 2), 2);
  a.scale(5);
  expect(a.start.toArray()).toEqual([5, 5]);
  expect(a.end.toArray()).toEqual([15, 10]);
  expect(a.width).toEqual(10);
});

test("move", () => {
  const a = new Arrow(vec(1, 1), vec(3, 2), 2);
  a.move(vec(10, 20));
  expect(a.start.toArray()).toEqual([11, 21]);
  expect(a.end.toArray()).toEqual([13, 22]);
});

test("bounding box", () => {
  const box = new Arrow(vec(1, 1), vec(3, 1), 2).getBoundingBox();
  expect(box.center.x).toEqual(2);
  expect(box.center.y).toEqual(1);
});
