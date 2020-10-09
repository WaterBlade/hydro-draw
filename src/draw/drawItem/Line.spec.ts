import { vec } from "../misc";
import { Line } from "./Line";

test("scale", () => {
  const l = new Line(vec(0, 0), vec(1, 1));
  l.scale(5);
  expect(l.start.toArray()).toEqual([0, 0]);
  expect(l.end.toArray()).toEqual([5, 5]);
});

test("move", () => {
  const l = new Line(vec(0, 0), vec(1, 1));
  l.move(vec(10, 20));
  expect(l.start.toArray()).toEqual([10, 20]);
  expect(l.end.toArray()).toEqual([11, 21]);
});

test("bounding box", () => {
  const b = new Line(vec(0, 0), vec(1, 1)).getBoundingBox();
  expect(b.left).toEqual(0);
  expect(b.right).toEqual(1);
  expect(b.bottom).toEqual(0);
  expect(b.top).toEqual(1);
});
