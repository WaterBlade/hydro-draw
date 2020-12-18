import { Circle } from "@/draw/drawItem";
import { vec } from "@/draw/misc";
import { HLayoutBuilder } from "./HLayoutBuilder";

test("generate", () => {
  const h = new HLayoutBuilder();
  h.push(new Circle(vec(0, 0), 5));
  h.push(new Circle(vec(0, 0), 10));
  const c = h.generate();
  const c1 = c.itemList[0] as Circle;
  const c2 = c.itemList[1] as Circle;
  expect(c1.center.x).toEqual(5);
  expect(c1.center.y).toEqual(-5);
  expect(c2.center.x).toEqual(20);
  expect(c2.center.y).toEqual(-10);
});
