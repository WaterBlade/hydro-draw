import { Side, vec } from "@/draw/misc";
import { Arc } from "./Arc";
import { Line } from "./Line";
import { offsetJoint } from "./OffsetPoint.function";

test("line and line", () => {
  const l0 = new Line(vec(0, 0), vec(10, 0));
  const l1 = new Line(vec(10, 0), vec(10, 10));
  expect(offsetJoint(l0, l1, 2, Side.Left)).toEqual(vec(8, 2));
});

test("line and arc", () => {
  const a = new Arc(vec(0, 0), 2, 0, 180);
  const l = new Line(vec(2, -10), vec(2, 0));
  expect(offsetJoint(l, a, 2, Side.Right)).toEqual(vec(4, 0));
});

test("arc and arc", () => {
  const a0 = new Arc(vec(0, 0), 3, 0, 180);
  const a1 = new Arc(vec(-6, 0), 3, 0, 180);
  expect(offsetJoint(a0, a1, 2, Side.Right)).toEqual(vec(-3, 4));
});
