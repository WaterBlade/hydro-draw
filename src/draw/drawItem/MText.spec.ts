import { vec } from "../misc";
import { MText } from "./MText";

test("scale", () => {
  const t = new MText(["hello", "world"], vec(0, 0), 5, 30);
  t.scale(5);
  expect(t.insertPoint.toArray()).toEqual([0, 0]);
  expect(t.height).toEqual(25);
});

test("move", () => {
  const t = new MText(["hello", "world"], vec(0, 0), 5, 30);
  t.move(vec(10, 20));
  expect(t.insertPoint.toArray()).toEqual([10, 20]);
});

test("bounding box", () => {
  const t = new MText(["hello", "world"], vec(0, 0), 5, 30);
  const b = t.getBoundingBox();
  expect(b.left).toEqual(0);
  expect(b.top).toEqual(0);
  expect(b.right).toEqual(17.5);
  expect(b.bottom).toEqual(-15);
});
