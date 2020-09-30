import { vec } from "../Vector";
import { Arc } from "./Arc";

test("scale", () => {
  const arc = new Arc(vec(3, 2), 2, 0, 180);
  arc.scale(5);
  expect(arc.center.toArray()).toEqual([15, 10]);
  expect(arc.radius).toEqual(10);
});

test("move", () => {
  const arc = new Arc(vec(3, 2), 2, 0, 180);
  arc.move(vec(10, 20));
  expect(arc.center.toArray()).toEqual([13, 22]);
});

test("boundingbox", () => {
  const arc = new Arc(vec(3, 2), 2, 0, 180);
  const box = arc.getBoundingBox();
  expect(box.center.x).toEqual(3);
  expect(box.center.y).toEqual(3);
});
