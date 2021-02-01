import { vec } from "@/draw/misc";
import { Boundary } from "../Boundary";
import { Box } from "./Box";
import { BoxContainer } from "./BoxContainer";

test("h arrange", () => {
  const c = new BoxContainer(vec(0, 0));
  c.boxs.push(
    new Box(vec(0, 0), 2, 2),
    new Box(vec(2, 0), 4, 4),
    new Box(vec(6, 0), 6, 6)
  );
  const b = new Boundary(vec(0, -6));
  b.h(20).v(20);
  c.hArrange(b);
  expect(c.boxs[0].left).toEqual(2);
  expect(c.boxs[1].left).toEqual(6);
  expect(c.boxs[2].left).toEqual(12);
});

test("v arrange", () => {
  const c = new BoxContainer(vec(0, 0));
  c.boxs.push(
    new Box(vec(0, 0), 2, 2),
    new Box(vec(0, -2), 4, 4),
    new Box(vec(0, -6), 6, 6)
  );
  const b = new Boundary(vec(0, -20));
  b.h(20).v(20);
  c.vArrange(b);
  expect(c.boxs[0].top).toEqual(-2);
  expect(c.boxs[1].top).toEqual(-6);
  expect(c.boxs[2].top).toEqual(-12);
});
