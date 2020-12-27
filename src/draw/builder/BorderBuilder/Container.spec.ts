import { Circle } from "@/draw/drawItem";
import { vec } from "@/draw/misc";
import { Boundary } from "./Boundary"
import { Container } from "./Container"


test('fill', ()=>{
  const c = new Container(new Boundary(vec(0, 0)).h(100).v(10).h(20).v(50));
  expect(c.fill(new Circle(vec(0, 0), 10))).toBeTruthy();
  expect(c.fill(new Circle(vec(0, 0), 10))).toBeTruthy();
  expect(c.fill(new Circle(vec(0, 0), 40))).toBeFalsy();
  expect(c.fill(new Circle(vec(0, 0), 9))).toBeTruthy();
  expect(c.columns.length).toEqual(1);
  expect(c.columns[0].topLeft).toEqual(vec(0, 60));
  expect(c.fill(new Circle(vec(0, 0), 10))).toBeTruthy();
  expect(c.columns.length).toEqual(2);
  expect(c.fill(new Circle(vec(0, 0), 4))).toBeTruthy();
  expect(c.fill(new Circle(vec(0, 0), 4))).toBeTruthy();
  expect(c.columns[1].rows.length).toEqual(2);
  expect(c.fill(new Circle(vec(0, 0), 4))).toBeTruthy();
  expect(c.columns[1].rows.length).toEqual(3);
  
});

test('inside test', ()=>{
  const c = new Container(new Boundary(vec(0, 0)).h(50).v(50));
  expect(c.topLeft).toEqual(vec(0, 50));
  expect(c.insideTest(vec(25, 25))).toBeTruthy();
  expect(c.insideTest(vec(5, 25))).toBeTruthy();
  expect(c.insideTest(vec(55, 25))).toBeFalsy();
  
})

test('reset', ()=>{
  const c = new Container(new Boundary(vec(0, 0)).h(50).v(50));
  c.fill(new Circle(vec(0, 0), 10));
  const col = c.columns[0];
  const row = col.rows[0];
  const cel = row.cells[0];
  col.resetRowsY();
  expect(row.topLeft).toEqual(vec(0, 35));
  c.resetColumnsX();
  expect(col.topLeft).toEqual(vec(15, 50));
  row.resetCellsX();
  expect(cel.topLeft).toEqual(vec(15, 35));
  
})
