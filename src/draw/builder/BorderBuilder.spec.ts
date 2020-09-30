import { BoundingBox } from "../BoundingBox";
import { vec } from "../Vector";
import {
  Border,
  Column,
  HBoundary,
  HEdge,
  Row,
  RowBox,
  VBoundary,
  VEdge,
} from "./BorderBuilder";

describe("border", () => {
  test("fill", () => {
    const h = new HBoundary();
    h.addEdge(0, 10, 0);
    const b = new Border(vec(0, 6), h);
    expect(b.fill(new BoundingBox(0, 5, 0, 5))).toBeTruthy();
    expect(b.fill(new BoundingBox(0, 4, 0, 4))).toBeTruthy();
    expect(b.fill(new BoundingBox(0, 6, 0, 8))).toBeFalsy();
    expect(b.columns.length).toEqual(2);
  });
  test("plan", () => {
    const h = new HBoundary();
    h.addEdge(0, 12, 0);
    const b = new Border(vec(0, 6), h);
    b.fill(new BoundingBox(0, 3, 0, 4));
    b.fill(new BoundingBox(0, 3, 0, 4));
    b.plan();

    expect(b.columns.length).toEqual(2);
    expect(b.columns[0].topLeft.toArray()).toEqual([2, 6]);
    expect(b.columns[1].topLeft.toArray()).toEqual([7, 6]);
  });
  test("find right col", () => {
    const h = new HBoundary();
    h.addEdge(0, 10, 0);
    const b = new Border(vec(0, 10), h);
    b.fill(new BoundingBox(0, 5, 0, 5));
    b.fill(new BoundingBox(0, 4, 0, 4));
    b.fill(new BoundingBox(0, 4, 0, 5));
    expect(b.columns.length).toEqual(2);
    expect(b.findRightColumn(new VEdge(0, 4, 10)).topLeft.x).toEqual(0);
    expect(b.findRightColumn(new VEdge(0, 10, 10)).topLeft.x).toEqual(5);
  });
});

describe("horizontal boundary", () => {
  test("check below", () => {
    const b = new HBoundary();
    b.addEdge(0, 10, 5);
    b.addEdge(10, 15, 10);
    expect(b.checkBelow(0, 8, 4)).toBeTruthy();
    expect(b.checkBelow(0, 8, 6)).toBeFalsy();
    expect(b.checkBelow(0, 12, 5)).toBeFalsy();
    expect(b.checkBelow(11, 12, 5)).toBeTruthy();
  });
  test("find overlap", () => {
    const b = new HBoundary();
    b.addEdge(0, 10, 5);
    b.addEdge(10, 15, 10);
    const r = b.genSubBoundary(2, 8);
    expect(r.edges.length).toEqual(1);
    expect(r.edges[0].xLeft).toEqual(2);
    expect(r.edges[0].xRight).toEqual(8);
    const r2 = b.genSubBoundary(5, 12);
    expect(r2.edges.length).toEqual(2);
    expect(r2.edges[0].xLeft).toEqual(5);
    expect(r2.edges[0].xRight).toEqual(10);
    expect(r2.edges[1].xLeft).toEqual(10);
    expect(r2.edges[1].xRight).toEqual(12);
  });
});

describe("vertical boundary", () => {
  test("check right", () => {
    const b = new VBoundary();
    b.addEdge(0, 10, 5);
    b.addEdge(10, 15, 10);
    expect(b.checkRight(0, 8, 4)).toBeTruthy();
    expect(b.checkRight(0, 8, 6)).toBeFalsy();
    expect(b.checkRight(0, 12, 5)).toBeFalsy();
    expect(b.checkRight(11, 12, 5)).toBeTruthy();
  });
  test("from h boundary", () => {
    const b = new HBoundary();
    b.addEdge(0, 10, 5);
    b.addEdge(10, 15, 10);
    const v = VBoundary.fromHBoundary(vec(0, 15), b);
    expect(v.edges.length).toEqual(2);
    expect(v.edges[0].x).toEqual(10);
    expect(v.edges[0].yBottom).toEqual(5);
    expect(v.edges[0].yTop).toEqual(10);
    expect(v.edges[1].x).toEqual(15);
    expect(v.edges[1].yBottom).toEqual(10);
    expect(v.edges[1].yTop).toEqual(15);
  });
});

describe("col", () => {
  test("fill", () => {
    const b = new HBoundary();
    b.addEdge(0, 10, 0);
    const c = new Column(vec(0, 10), 10, 10, b);
    expect(c.fill(new BoundingBox(0, 5, 0, 5))).toBeTruthy();
    expect(c.fill(new BoundingBox(0, 5, 0, 12))).toBeFalsy();
    expect(c.fill(new BoundingBox(0, 6, 0, 5))).toBeTruthy();
    expect(c.fill(new BoundingBox(0, 4, 0, 5))).toBeFalsy();
  });
  test("bottom row", () => {
    const b = new HBoundary();
    b.addEdge(0, 10, 0);
    const c = new Column(vec(0, 10), 10, 10, b);
    c.fill(new BoundingBox(0, 9, 0, 4));
    c.fill(new BoundingBox(0, 5, 0, 3));
    expect(c.findBottomRow(new HEdge(2, 3, 0)).topLeft.y).toEqual(6);
    expect(c.findBottomRow(new HEdge(0, 10, 0)).topLeft.y).toEqual(6);
    expect(c.findBottomRow(new HEdge(6, 10, 0)).topLeft.y).toEqual(10);
  });
  test("min down move", () => {
    const b = new HBoundary();
    b.addEdge(0, 10, 0);
    const c = new Column(vec(0, 10), 10, 10, b);
    c.fill(new BoundingBox(0, 9, 0, 4));
    c.fill(new BoundingBox(0, 5, 0, 3));
    expect(c.rows.length).toEqual(2);
    expect(
      c.calcMinDownMove(10, c.rows[0], [c.rows[1]], [new HEdge(0, 10, 0)])
    ).toEqual(1);
  });
  test("vplan", () => {
    const b = new HBoundary();
    b.addEdge(0, 10, 0);
    const c = new Column(vec(0, 10), 10, 10, b);
    c.fill(new BoundingBox(0, 9, 0, 4));
    c.fill(new BoundingBox(0, 5, 0, 3));
    c.vPlan();
    expect(c.rows.length).toEqual(2);
    expect(c.rows[0].topLeft.y).toEqual(9);
    expect(c.rows[1].topLeft.y).toEqual(4);
  });
});

describe("row box", () => {
  test("compute space", () => {
    const b = new HBoundary();
    b.addEdge(0, 10, 0);
    const r = new Row(vec(0, 10), 10, 10, b);
    r.fill(new BoundingBox(0, 5, 0, 5));
    const box = new RowBox([r], 10, new HEdge(0, 10, 0));
    expect(box.computeSpace()).toEqual(2.5);
  });
});

describe("row", () => {
  test("fill", () => {
    const b = new HBoundary();
    b.addEdge(0, 10, 0);
    const r = new Row(vec(0, 10), 10, 10, b);
    expect(r.fill(new BoundingBox(0, 5, 0, 5))).toBeTruthy();
    expect(r.fill(new BoundingBox(0, 5, 0, 12))).toBeFalsy();
    expect(r.fill(new BoundingBox(0, 6, 0, 5))).toBeFalsy();
    expect(r.fill(new BoundingBox(0, 4, 0, 5))).toBeFalsy();
  });
});
