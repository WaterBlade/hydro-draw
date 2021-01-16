import { vec } from "@/draw/misc"
import { Boundary } from "../Boundary";
import { Box } from "./Box"

test('side', ()=> {
  const b = new Box(vec(0, 0), 5, 10);
  expect(b.left).toEqual(0);
  expect(b.right).toEqual(5);
  expect(b.top).toEqual(0);
  expect(b.bottom).toEqual(-10);
  expect(b.width).toEqual(5);
  expect(b.height).toEqual(10);
});

test('cross test', ()=>{
  const box = new Box(vec(0, 0), 5, 10);
  const b = new Boundary(vec(0, -2))
  b.h(20).v(10);
  expect(box.crossTest(b)).toBeTruthy();
});

test('h min space', ()=>{
  const box = new Box(vec(0, 0), 6, 10);
  const b = new Boundary(vec(0, -12))
  b.h(20).v(12);
  expect(box.hMinSpace(0, 0, 0, b)).toEqual(7);
});

test('v min space', ()=>{
  const box = new Box(vec(0, 0), 6, 4);
  const b = new Boundary(vec(0, -12))
  b.h(20).v(12);
  expect(box.vMinSpace(0, 0, 0, b)).toEqual(4);
});