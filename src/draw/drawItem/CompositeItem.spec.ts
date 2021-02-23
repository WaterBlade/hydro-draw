import { Vector, vec } from "@/draw/misc";
import { Circle, Line } from "./Geometry";
import { CompositeItem } from "./CompositeItem";

test("push", () => {
  const comp = new CompositeItem();
  const line = new Line(new Vector(0, 0), new Vector(1, 1));
  comp.push(line);
  expect(comp.itemList.length).toEqual(1);
});

test("scale", () => {
  const comp = new CompositeItem();
  const circle = new Circle(vec(4, 4), 5);
  comp.push(circle);
  comp.scale(5);
  expect(circle.center).toEqual(vec(20, 20));
  expect(circle.radius).toEqual(25);
});

test("move", () => {
  const comp = new CompositeItem();
  const circle = new Circle(vec(4, 4), 5);
  comp.push(circle);
  comp.move(vec(10, 20));
  expect(circle.center).toEqual(vec(14, 24));
});

test("bounding box", () => {
  const comp = new CompositeItem();
  const c1 = new Circle(vec(4, 4), 5);
  const c2 = new Circle(vec(10, 10), 2);
  comp.push(c1, c2);
  const b = comp.getBoundingBox();
  expect(b.left).toEqual(-1);
  expect(b.right).toEqual(12);
  expect(b.bottom).toEqual(-1);
  expect(b.top).toEqual(12);
});
