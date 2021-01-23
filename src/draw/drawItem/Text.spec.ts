import { vec } from "@/draw/misc";
import { Text } from "./Text";

test("scale", () => {
  const t = new Text("hello", vec(1, 1), 5);
  t.scale(5);
  expect(t.insertPoint).toEqual(vec(5, 5));
  expect(t.height).toEqual(25);
});

test("move", () => {
  const t = new Text("hello", vec(1, 1), 5);
  t.move(vec(10, 20));
  expect(t.insertPoint).toEqual(vec(11, 21));
});

test("bounding box", () => {
  const b = new Text("hello", vec(1, 1), 5).getBoundingBox();
  expect(b.left).toEqual(1);
  expect(b.right).toEqual(26);
  expect(b.bottom).toEqual(1);
  expect(b.top).toEqual(6);
});

test('proper anlge', ()=>{
  expect(Text.properAngle(0)).toEqual(0);
  expect(Text.properAngle(90)).toEqual(90);
  expect(Text.properAngle(180)).toEqual(0);
  expect(Text.properAngle(270)).toEqual(90);
  expect(Text.properAngle(360)).toEqual(0);
})
