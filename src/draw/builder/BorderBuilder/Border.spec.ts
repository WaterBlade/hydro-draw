import { BoundingBox, vec } from "../../misc";
import { Border, Boundary, Column, HEdge, Row, VEdge } from "./Border";

describe("border", () => {
  test("fill", () => {
    const b = new Boundary(vec(0, 0));
    b.corner(10, 10);
    const border = new Border(b);
    expect(border.fillBox(new BoundingBox(0, 5, 0, 5))).toBeTruthy();
    expect(border.columns.length).toEqual(1);
    expect(border.width).toEqual(5);
    expect(border.height).toEqual(5);
    expect(border.fillBox(new BoundingBox(0, 2, 0, 5))).toBeTruthy();
    expect(border.columns.length).toEqual(2);
    expect(border.width).toEqual(7);
    expect(border.height).toEqual(5);
    expect(border.fillBox(new BoundingBox(0, 6, 0, 5))).toBeFalsy();
    expect(border.fillBox(new BoundingBox(0, 4, 0, 4))).toBeTruthy();
    expect(border.columns.length).toEqual(2);
    expect(border.width).toEqual(9);
    expect(border.height).toEqual(9);
  });
  test("adjust col pos", () => {
    const b = new Boundary(vec(0, 0));
    b.corner(10, 10);
    const border = new Border(b);
    border.fillBox(new BoundingBox(0, 3, 0, 5));
    border.fillBox(new BoundingBox(0, 2, 0, 4));
    border.fillBox(new BoundingBox(0, 4, 0, 5));

    border.adjustColPos();
    expect(border.columns[0].left).toEqual(1);
    expect(border.columns[1].left).toEqual(5);
  });
  test("adjust", () => {
    const b = new Boundary(vec(0, 0));
    b.corner(10, 10);
    const border = new Border(b);
    const b1 = new BoundingBox(0, 3, 0, 3);
    const b2 = new BoundingBox(0, 1, 0, 4);
    const b3 = new BoundingBox(0, 4, 0, 4);
    border.fillBox(b1);
    border.fillBox(b2);
    border.fillBox(b3);
    border.adjustRowPos();
    border.adjustColPos();
    border.adjustBoxPos();
    expect(b1.top).toEqual(9);
    expect(b2.top).toEqual(5);
    expect(b3.top).toEqual(7);
    expect(b1.left).toEqual(1);
    expect(b2.left).toEqual(2);
    expect(b3.left).toEqual(5);
    const cs = border.getCenters();
    expect(cs[0].x).toEqual(2.5);
    expect(cs[1].x).toEqual(2.5);
    expect(cs[2].x).toEqual(7);
  });
});

describe("col", () => {
  test("fill", () => {
    const b = new Boundary(vec(0, 0));
    b.corner(11, 11);
    const c = new Column(vec(0, 11), b);
    expect(c.fill(new BoundingBox(0, 5, 0, 5))).toBeTruthy();
    expect(c.rows.length).toEqual(1);
    expect(c.width).toEqual(5);
    expect(c.height).toEqual(5);
    expect(c.fill(new BoundingBox(0, 2, 0, 5))).toBeTruthy();
    expect(c.rows.length).toEqual(2);
    expect(c.width).toEqual(5);
    expect(c.height).toEqual(10);
    expect(c.fill(new BoundingBox(0, 5, 0, 5))).toBeFalsy();
    expect(c.fill(new BoundingBox(0, 3, 0, 5))).toBeTruthy();
    expect(c.rows.length).toEqual(2);
    expect(c.width).toEqual(5);
    expect(c.height).toEqual(10);
  });
  test("adjust row pos", () => {
    const b = new Boundary(vec(0, 0));
    b.corner(10, 10);
    b.corner(10, 10);
    const c = new Column(vec(0, 20), b);
    c.fill(new BoundingBox(0, 5, 0, 5));
    c.fill(new BoundingBox(0, 15, 0, 2));
    c.fill(new BoundingBox(0, 2, 0, 3));
    c.adjustRowPos();
    expect(c.rows[0].top).toEqual(19);
    expect(c.rows[1].top).toEqual(13);
    expect(c.rows[2].top).toEqual(7);
  });
});

describe("row", () => {
  test("box prop", () => {
    const b = new Boundary(vec(0, 0));
    const r = new Row(vec(0, 10), b);
    r.boxs.push(new BoundingBox(0, 5, 5, 10));
    r.boxs.push(new BoundingBox(5, 11, 3, 10));
    expect(r.width).toEqual(11);
    expect(r.height).toEqual(7);
    expect(r.left).toEqual(0);
    expect(r.right).toEqual(11);
    expect(r.top).toEqual(10);
    expect(r.bottom).toEqual(3);
  });
  test("fill", () => {
    const b = new Boundary(vec(0, 0));
    b.corner(10, 10);
    const r = new Row(vec(0, 10), b);
    expect(r.fill(new BoundingBox(0, 5, 0, 5))).toBeTruthy();
    expect(r.fill(new BoundingBox(0, 5, 0, 12))).toBeFalsy();
    expect(r.fill(new BoundingBox(0, 6, 0, 5))).toBeFalsy();
    expect(r.fill(new BoundingBox(0, 4, 0, 5))).toBeTruthy();
  });
  test("box adjust", () => {
    const b = new Boundary(vec(0, 0));
    b.corner(14, 10);
    const r = new Row(vec(0, 10), b);
    r.boxs.push(new BoundingBox(0, 5, 5, 10));
    r.boxs.push(new BoundingBox(5, 11, 3, 10));
    r.adjustBoxPos(14);
    expect(r.boxs[0].left).toEqual(1);
    expect(r.boxs[1].left).toEqual(7);
    expect(r.boxs[0].top).toEqual(9);
    expect(r.boxs[1].top).toEqual(10);
  });
});

describe("hedge", () => {
  test("overlap", () => {
    const h = new HEdge(0, 10, 0);
    expect(h.isOverlap(0, 2)).toBeTruthy();
    expect(h.isOverlap(-3, -1)).toBeFalsy();
    expect(h.isOverlap(9, 11)).toBeTruthy();
  });
  test("inside", () => {
    const h = new HEdge(0, 10, 0);
    expect(h.isInside(5)).toBeTruthy();
    expect(h.isInside(11)).toBeFalsy();
  });
  test("find bottom", () => {
    const h = new HEdge(0, 10, 0);
    const boxs = [
      { bottom: 5, top: 6, left: 11, right: 14 },
      { bottom: 3, top: 4, left: 0, right: 4 },
      { bottom: 1, top: 2, left: 0, right: 4 },
      { bottom: 0.5, top: 1, left: -1, right: -0.5 },
    ];
    expect(h.findBottom(boxs)).toEqual(2);
  });
  test("scale", () => {
    const h = new HEdge(-1, 10, 2);
    h.scale(5);
    expect(h.xLeft).toEqual(-5);
    expect(h.xRight).toEqual(50);
    expect(h.y).toEqual(10);
  });
});

describe("vedge", () => {
  test("overlap", () => {
    const v = new VEdge(0, 10, 0);
    expect(v.isOverlap(0, 2)).toBeTruthy();
    expect(v.isOverlap(-3, -1)).toBeFalsy();
    expect(v.isOverlap(9, 11)).toBeTruthy();
  });
  test("inside", () => {
    const v = new VEdge(0, 10, 0);
    expect(v.isInside(5)).toBeTruthy();
    expect(v.isInside(11)).toBeFalsy();
  });
  test("intersect", () => {
    const v = new VEdge(0, 10, 0);
    expect(
      v.isIntersect({ left: -1, right: 3, bottom: 2, top: 5 })
    ).toBeTruthy();
    expect(
      v.isIntersect({ left: -1, right: -0.5, bottom: 2, top: 5 })
    ).toBeFalsy();
    expect(
      v.isIntersect({ left: -1, right: 3, bottom: 12, top: 15 })
    ).toBeFalsy();
  });
  test("find right most", () => {
    const v = new VEdge(0, 10, 10);
    const boxs = [
      { bottom: 5, top: 6, left: 0, right: 2 },
      { bottom: 3, top: 4, left: 2, right: 4 },
      { bottom: 1, top: 2, left: 4, right: 6 },
      { bottom: -1.5, top: -1, left: 6, right: 8 },
    ];
    expect(v.findRightMost(boxs)).toEqual(2);
  });
  test("scale", () => {
    const v = new VEdge(-1, 10, 2);
    v.scale(5);
    expect(v.yBottom).toEqual(-5);
    expect(v.yTop).toEqual(50);
    expect(v.x).toEqual(10);
  });
});

describe("boundary", () => {
  test("corner", () => {
    const b = new Boundary(vec(0, 0));
    b.corner(5, 5);
    expect(b.hEdges.length).toEqual(1);
    expect(b.hEdges[0].xLeft).toEqual(0);
    expect(b.hEdges[0].xRight).toEqual(5);
    expect(b.hEdges[0].y).toEqual(0);
    expect(b.vEdges.length).toEqual(1);
    expect(b.vEdges[0].yBottom).toEqual(0);
    expect(b.vEdges[0].yTop).toEqual(5);
    expect(b.vEdges[0].x).toEqual(5);
  });
  test("intersect", () => {
    const b = new Boundary(vec(0, 0));
    b.corner(5, 2);
    b.corner(3, 2);
    expect(b.isInside({ left: 0, right: 2, bottom: 1, top: 2 })).toBeTruthy();
    expect(b.isInside({ left: 0, right: 2, bottom: -1, top: 2 })).toBeFalsy();
    expect(b.isInside({ left: 0, right: 6, bottom: 1, top: 2 })).toBeFalsy();
    expect(b.isInside({ left: 0, right: 6, bottom: -1, top: 2 })).toBeFalsy();
    expect(b.isInside({ left: 0, right: 2, bottom: 4, top: 2 })).toBeTruthy();
    expect(b.isInside({ left: 0, right: 7, bottom: 1, top: 2 })).toBeFalsy();
  });
  test("get h overlap", () => {
    const b = new Boundary(vec(0, 0));
    b.corner(5, 2);
    b.corner(3, 2);
    const edges = b.getHOverlapEdges(4, 6);
    expect(edges.length).toEqual(2);

    expect(edges[0].xLeft).toEqual(4);
    expect(edges[0].xRight).toEqual(5);
    expect(edges[0].y).toEqual(0);

    expect(edges[1].xLeft).toEqual(5);
    expect(edges[1].xRight).toEqual(6);
    expect(edges[1].y).toEqual(2);
  });
  test("get y of nearest h edge", () => {
    const b = new Boundary(vec(0, 0));
    b.corner(5, 2);
    b.corner(3, 2);
    expect(b.getYOfNearestHEdge(2, 4)).toEqual(0);
    expect(b.getYOfNearestHEdge(6, 7)).toEqual(2);
  });
  test("get v overlap", () => {
    const b = new Boundary(vec(0, 0));
    b.corner(5, 2);
    b.corner(3, 2);
    const edges = b.getVOverlapEdges(1, 3);
    expect(edges.length).toEqual(2);

    expect(edges[0].yBottom).toEqual(1);
    expect(edges[0].yTop).toEqual(2);
    expect(edges[0].x).toEqual(5);

    expect(edges[1].yBottom).toEqual(2);
    expect(edges[1].yTop).toEqual(3);
    expect(edges[1].x).toEqual(8);
  });
  test("get x of nearest v edge", () => {
    const b = new Boundary(vec(0, 0));
    b.corner(5, 2);
    b.corner(3, 2);
    expect(b.getXOfNearestVEdge(1, 2)).toEqual(5);
    expect(b.getXOfNearestVEdge(3, 4)).toEqual(8);
  });
});
