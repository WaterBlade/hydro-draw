import { Vector, vec } from "@/draw/misc";
import { Circle, Line } from "./Geometry";
import { CompositeItem } from "./CompositeItem";

test("push", () => {
  const comp = new CompositeItem();
  const line = new Line(new Vector(0, 0), new Vector(1, 1));
  comp.push(line);
  expect(comp.itemList.length).toEqual(1);
});

test("insert point", () => {
  const comp = new CompositeItem(new Vector(0, 1));
  const line = new Line(new Vector(0, 0), new Vector(1, 1));
  comp.push(line);
  const mock = {
    visitArc: jest.fn(),
    visitArrow: jest.fn(),
    visitCircle: jest.fn(),
    visitDimAligned: jest.fn(),
    visitLine: jest.fn(),
    visitMText: jest.fn(),
    visitPolyline: jest.fn(),
    visitText: jest.fn(),
    visitContent: jest.fn(),
    visitSpecial: jest.fn(),
    visitString: jest.fn(),
  };
  comp.accept(mock, new Vector(3, 4));
  const pt = mock.visitLine.mock.calls[0][1];
  expect(pt.x).toEqual(3);
  expect(pt.y).toEqual(5);
});

test("scale", () => {
  const comp = new CompositeItem(vec(1, 1));
  const circle = new Circle(vec(4, 4), 5);
  comp.push(circle);
  comp.scale(5);
  expect(comp.insertPoint).toEqual(vec(5, 5));
  expect(circle.center).toEqual(vec(20, 20));
  expect(circle.radius).toEqual(25);
});

test("move", () => {
  const comp = new CompositeItem(vec(1, 1));
  const circle = new Circle(vec(4, 4), 5);
  comp.push(circle);
  comp.move(vec(10, 20));
  expect(comp.insertPoint).toEqual(vec(11, 21));
  expect(circle.center).toEqual(vec(4, 4));
});

test("bounding box", () => {
  const comp = new CompositeItem(vec(1, 1));
  const c1 = new Circle(vec(4, 4), 5);
  const c2 = new Circle(vec(10, 10), 2);
  comp.push(c1, c2);
  const b = comp.getBoundingBox();
  expect(b.left).toEqual(0);
  expect(b.right).toEqual(13);
  expect(b.bottom).toEqual(0);
  expect(b.top).toEqual(13);
});
