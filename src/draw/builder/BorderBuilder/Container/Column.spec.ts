import { Circle } from "@/draw/drawItem";
import { vec } from "@/draw/misc";
import { Boundary } from "../Boundary";
import { Cell } from "./Cell";
import { Column } from "./Column";

test("fill", () => {
  const b = new Boundary(vec(0, 0));
  b.h(10).v(10).h(10).v(10);
  const col = new Column(vec(0, 20), b);
  const c0 = new Cell(new Circle(vec(0, 0), 2));
  const c1 = new Cell(new Circle(vec(0, 0), 3));
  const c2 = new Cell(new Circle(vec(0, 0), 4));
  const c3 = new Cell(new Circle(vec(0, 0), 5));
  expect(col.fill(c0)).toBeTruthy();
  expect(col.boxs[0].topLeft).toEqual(vec(0, 20));
  expect(col.fill(c1)).toBeTruthy();
  expect(col.boxs[1].topLeft).toEqual(vec(0, 16));
  expect(col.fill(c2)).toBeTruthy();
  expect(col.boxs[2].topLeft).toEqual(vec(0, 10));
  expect(col.fill(c3)).toBeFalsy();
});
