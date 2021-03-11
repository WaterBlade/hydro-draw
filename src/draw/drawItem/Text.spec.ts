import { vec } from "@/draw/misc";
import { TextDraw } from "./Text";

test("scale", () => {
  const t = new TextDraw("hello", vec(1, 1), 5);
  t.scale(5);
  expect(t.insertPoint).toEqual(vec(5, 5));
  expect(t.height).toEqual(25);
});

test("move", () => {
  const t = new TextDraw("hello", vec(1, 1), 5);
  t.move(vec(10, 20));
  expect(t.insertPoint).toEqual(vec(11, 21));
});

test("bounding box", () => {
  const b = new TextDraw("hello", vec(1, 1), 5).getBoundingBox();
  expect(b.left).toEqual(1);
  expect(b.right).toEqual(26);
  expect(b.bottom).toEqual(1);
  expect(b.top).toEqual(6);
});

test("proper anlge", () => {
  expect(TextDraw.properAngle(0)).toEqual(0);
  expect(TextDraw.properAngle(90)).toEqual(90);
  expect(TextDraw.properAngle(180)).toEqual(0);
  expect(TextDraw.properAngle(270)).toEqual(90);
  expect(TextDraw.properAngle(360)).toEqual(0);
});
