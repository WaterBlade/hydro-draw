import { vec } from "../Vector";
import { Circle } from "./Circle";

test("circle", () => {
  const c = new Circle(vec(1, 1), 5);
  c.scale(5);
  expect(c.center.toArray()).toEqual([5, 5]);
  expect(c.radius).toEqual(25);
});

test("move", () => {
  const c = new Circle(vec(1, 1), 5);
  c.move(vec(10, 20));
  expect(c.center.toArray()).toEqual([11, 21]);
});

test("bounding box", () => {
  const box = new Circle(vec(1, 1), 5).getBoundingBox();
  expect(box.center.toArray()).toEqual([1, 1]);
  expect(box.width).toEqual(10);
});
