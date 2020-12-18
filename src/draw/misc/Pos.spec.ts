import { vec } from "./Vector";
import { Pos } from "./Pos";

test("cur", () => {
  const a = new Pos(0, 1);
  expect(a.cur).toEqual(vec(0, 1));
});

test("to", () => {
  const a = new Pos(0, 1);
  a.to(1, 1);
  expect(a.points.length).toEqual(2);
  expect(a.points.slice(-1)[0]).toEqual(vec(1, 1));
});

test("by", () => {
  const a = new Pos(0, 1);
  a.by(1, 1);
  expect(a.points.length).toEqual(2);
  expect(a.points.slice(-1)[0]).toEqual(vec(1, 2));
});

test("pre", () => {
  const a = new Pos(0, 1);
  a.to(1, 1);
  expect(a.pre).toEqual(vec(0, 1));
});

test("last", () => {
  const a = new Pos(0, 0);
  for (let i = 1; i < 5; i++) {
    a.by(i, i);
  }
  expect(a.last(2)).toEqual(vec(6, 6));
});

test("left", () => {
  const a = new Pos(0, 0);
  a.left(5);
  expect(a.cur).toEqual(vec(-5, 0));
});

test("right", () => {
  const a = new Pos(0, 0);
  a.right(5);
  expect(a.cur).toEqual(vec(5, 0));
});

test("up", () => {
  const a = new Pos(0, 0);
  a.up(5);
  expect(a.cur).toEqual(vec(0, 5));
});

test("down", () => {
  const a = new Pos(0, 0);
  a.down(5);
  expect(a.cur).toEqual(vec(0, -5));
});
