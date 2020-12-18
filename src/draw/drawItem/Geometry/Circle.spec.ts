import { Side, vec } from "@/draw/misc";
import { Circle } from "./Circle";

test("circle", () => {
  const c = new Circle(vec(1, 1), 5);
  c.scale(5);
  expect(c.center).toEqual(vec(5, 5));
  expect(c.radius).toEqual(25);
});

test("move", () => {
  const c = new Circle(vec(1, 1), 5);
  c.move(vec(10, 20));
  expect(c.center).toEqual(vec(11, 21));
});

test("bounding box", () => {
  const box = new Circle(vec(1, 1), 5).getBoundingBox();
  expect(box.Center).toEqual(vec(1, 1));
  expect(box.width).toEqual(10);
});

test("circle divide", () => {
  const c = new Circle(vec(0, 0), 10 / Math.PI);
  c.divide(4);
  expect(c.points.length).toEqual(5);
});

test("circle divide not even", () => {
  const c = new Circle(vec(0, 0), 10 / Math.PI);
  c.divide(6);
  expect(c.points.length).toEqual(3);
});

test("divide by count", () => {
  const c = new Circle(vec(0, 0), 7);
  c.divideByCount(4);
  expect(c.points[0].x).toBeCloseTo(7);
  expect(c.points[0].y).toBeCloseTo(0);
  expect(c.points[1].x).toBeCloseTo(0);
  expect(c.points[1].y).toBeCloseTo(7);
  expect(c.points[2].x).toBeCloseTo(-7);
  expect(c.points[2].y).toBeCloseTo(0);
  expect(c.points[3].x).toBeCloseTo(0);
  expect(c.points[3].y).toBeCloseTo(-7);
});

test("circle offset", () => {
  const c = new Circle(vec(0, 0), 2);
  const d = c.offset(1, Side.Left);
  expect(d.radius).toEqual(1);
  const e = c.offset(1, Side.Right);
  expect(e.radius).toEqual(3);
});

test("circle project", () => {
  const c = new Circle(vec(0, 0), 5);
  c.divideByCount(4);
  const d = c.project(2, Side.Right);
  expect(d.radius).toEqual(7);
  expect(d.points[0].x).toBeCloseTo(7);
  expect(d.points[0].y).toBeCloseTo(0);
  expect(d.points[1].x).toBeCloseTo(0);
  expect(d.points[1].y).toBeCloseTo(7);
  expect(d.points[2].x).toBeCloseTo(-7);
  expect(d.points[2].y).toBeCloseTo(0);
  expect(d.points[3].x).toBeCloseTo(0);
  expect(d.points[3].y).toBeCloseTo(-7);
});
