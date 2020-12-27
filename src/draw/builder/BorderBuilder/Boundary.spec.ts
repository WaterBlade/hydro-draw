import { vec } from "@/draw/misc"
import { Boundary, Edge } from "./Boundary"

test('edge left test', ()=>{
  const e = new Edge(vec(0, 0), vec(10, 0));
  expect(e.leftTest(vec(5, 2))).toBeTruthy();
  expect(e.leftTest(vec(5, -2))).toBeFalsy();
});

test('edge inside test', ()=>{
  const e = new Edge(vec(0, 0), vec(10, 10));
  expect(e.xInsideTest(vec(5, 0))).toBeTruthy();
  expect(e.xInsideTest(vec(12, 0))).toBeFalsy();
  expect(e.yInsideTest(vec(0, 5))).toBeTruthy();
  expect(e.yInsideTest(vec(0, 12))).toBeFalsy();
});

test('edge overlap test', ()=>{
  const e = new Edge(vec(0, 0), vec(10, 10));
  expect(e.xOverlapTest(-2, 5)).toBeTruthy();
  expect(e.xOverlapTest(-2, -1)).toBeFalsy();
  expect(e.yOverlapTest(-2, 5)).toBeTruthy();
  expect(e.yOverlapTest(-2, -1)).toBeFalsy();
});

test('edge side', ()=>{
  const b = new Edge(vec(0, -1), vec(10,11));
  expect(b.left).toEqual(0);
  expect(b.right).toEqual(10);
  expect(b.bottom).toEqual(-1);
  expect(b.top).toEqual(11);
});

test('boundary build', ()=>{
  const b = new Boundary(vec(0, 0)).h(20).v(10);
  expect(b.edges.length).toEqual(2);
  expect(b.edges[0].start).toEqual(vec(0, 0));
  expect(b.edges[0].end).toEqual(vec(20, 0));
  expect(b.edges[1].start).toEqual(vec(20, 0));
  expect(b.edges[1].end).toEqual(vec(20, 10));
})

test('inside test', ()=>{
  const b = new Boundary(vec(0, 0));
  b.h(20).v(10);
  expect(b.insideTest(vec(5, 5))).toBeTruthy();
});


test('get bottom test', ()=>{
  const b = new Boundary(vec(0, 0)).h(20).v(10).h(20).v(10);
  expect(b.getBottom(0, 30)).toEqual(10);
  expect(b.getBottom(0, 20)).toEqual(10);
  expect(b.getBottom(0, 15)).toEqual(0);
  expect(b.getBottom(0, 45)).toEqual(20);
});

test('get right test', ()=>{
  const b = new Boundary(vec(0, 0)).h(10).v(20).h(10).v(20);
  expect(b.getRight(1, 30)).toEqual(10);
  expect(b.getRight(1, 20)).toEqual(10);
  expect(b.getRight(1, 15)).toEqual(10);
  expect(b.getRight(1, 45)).toEqual(10);
})