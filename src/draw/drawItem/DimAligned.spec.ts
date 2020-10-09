import { vec } from "../misc";
import { DimAligned } from "./DimAligned";

test("scale", () => {
  const dim = new DimAligned(vec(1, 1), vec(10, 1), vec(6, 3), 1, 1);
  dim.scale(5);
  expect(dim.start.toArray()).toEqual([5, 5]);
  expect(dim.end.toArray()).toEqual([50, 5]);
  expect(dim.textPoint.toArray()).toEqual([30, 15]);
  expect(dim.borderScale).toEqual(5);
});

test("move", () => {
  const dim = new DimAligned(vec(1, 1), vec(10, 1), vec(6, 3), 1, 1);
  dim.move(vec(10, 20));
  expect(dim.start.toArray()).toEqual([11, 21]);
  expect(dim.end.toArray()).toEqual([20, 21]);
  expect(dim.textPoint.toArray()).toEqual([16, 23]);
});

test("bounding box", () => {
  const dim = new DimAligned(vec(1, 1), vec(10, 1), vec(6, 3), 1, 1);
  const box = dim.getBoundingBox();
  expect(box.left).toEqual(1);
  expect(box.right).toEqual(10);
  expect(box.bottom).toEqual(1);
  expect(box.top).toEqual(6);
});
