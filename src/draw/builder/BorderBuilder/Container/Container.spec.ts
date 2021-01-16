import { Circle } from "@/draw/drawItem";
import { vec } from "@/draw/misc";
import { Boundary } from "../Boundary";
import { Container } from "./Container";

test("fill", () => {
  const c = new Container(new Boundary(vec(0, 0)).h(100).v(10).h(20).v(50));
  expect(c.fill(new Circle(vec(0, 0), 10))).toBeTruthy();
  expect(c.fill(new Circle(vec(0, 0), 10))).toBeTruthy();
  expect(c.fill(new Circle(vec(0, 0), 40))).toBeFalsy();
  expect(c.fill(new Circle(vec(0, 0), 9))).toBeTruthy();
  expect(c.boxs.length).toEqual(1);
  expect(c.boxs[0].topLeft).toEqual(vec(0, 60));
  expect(c.fill(new Circle(vec(0, 0), 10))).toBeTruthy();
  expect(c.boxs.length).toEqual(2);
  expect(c.fill(new Circle(vec(0, 0), 4))).toBeTruthy();
  expect(c.fill(new Circle(vec(0, 0), 4))).toBeTruthy();
  expect(c.boxs[1].boxs.length).toEqual(2);
  expect(c.fill(new Circle(vec(0, 0), 4))).toBeTruthy();
  expect(c.boxs[1].boxs.length).toEqual(3);
});