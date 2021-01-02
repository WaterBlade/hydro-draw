import { vec } from "@/draw/misc";
import {
  rawInterLineAndCircle,
  rawInterLineAndLine,
} from "./RawIntersect.function";

test("line and line", () => {
  const iter = rawInterLineAndLine(
    vec(0, 0),
    vec(10, 0),
    vec(5, -2),
    vec(5, 4)
  );
  expect(iter).toEqual([vec(5, 0)]);
});

test("line and line big number", () => {
  const iters = rawInterLineAndLine(
    vec(-2550, -2825),
    vec(-2549, -2825),
    vec(2100, -3265),
    vec(2100, -1130)
  );
  expect(iters.length).toBeGreaterThan(0);
});

test("line and arc", () => {
  const iters = rawInterLineAndCircle(vec(0, 0), vec(10, 0), vec(11, 0), 2);
  expect(iters.length).toEqual(2);
});
