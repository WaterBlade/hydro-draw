import { BoundingBox } from "./BoundingBox";
import { vec } from "./Vector";

test("basic", () => {
  const box = new BoundingBox(0, 10, 2, 12);
  expect(box.BottomLeft).toEqual(vec(0, 2));
  expect(box.TopRight).toEqual(vec(10, 12));
  expect(box.Center).toEqual(vec(5, 7));
  expect(box.width).toEqual(10);
  expect(box.height).toEqual(10);
});

test("from points", () => {
  const box = BoundingBox.fromPoints(vec(0, 0), vec(1, 1));
  expect(box.left).toEqual(0);
  expect(box.right).toEqual(1);
  expect(box.bottom).toEqual(0);
  expect(box.top).toEqual(1);
});

test("scale", () => {
  const box = new BoundingBox(0, 10, 2, 12);
  box.scale(5);
  expect(box.left).toEqual(0);
  expect(box.right).toEqual(50);
  expect(box.bottom).toEqual(10);
  expect(box.top).toEqual(60);
});

test("move", () => {
  const box = new BoundingBox(0, 10, 2, 12);
  box.move(vec(10, 20));
  expect(box.left).toEqual(10);
  expect(box.right).toEqual(20);
  expect(box.bottom).toEqual(22);
  expect(box.top).toEqual(32);
});

test("merge", () => {
  const a = new BoundingBox(0, 1, 0, 1);
  const b = new BoundingBox(1, 2, 1, 2);
  const c = a.merge(b);
  expect(c.left).toEqual(0);
  expect(c.right).toEqual(2);
  expect(c.bottom).toEqual(0);
  expect(c.top).toEqual(2);
});
