import { Circle } from "@/draw/drawItem";
import { vec } from "@/draw/misc";
import { Boundary } from "../Boundary";
import { Cell } from "./Cell";
import { Row } from "./Row";

test("fill", () => {
  const b = new Boundary(vec(0, 0));
  b.h(10).v(10).h(10).v(10);
  const row = new Row(vec(0, 20), b);
  const c0 = new Cell(new Circle(vec(0, 0), 2));
  const c1 = new Cell(new Circle(vec(0, 0), 3));
  const c2 = new Cell(new Circle(vec(0, 0), 4));
  const c3 = new Cell(new Circle(vec(0, 0), 5));
  expect(row.fill(c0)).toBeTruthy();
  expect(c0.topLeft).toEqual(vec(0, 20));
  expect(row.fill(c1)).toBeTruthy();
  expect(c1.topLeft).toEqual(vec(4, 20));
  expect(row.fill(c2)).toBeTruthy();
  expect(c2.topLeft).toEqual(vec(10, 20));
  expect(row.fill(c3)).toBeFalsy();
});
