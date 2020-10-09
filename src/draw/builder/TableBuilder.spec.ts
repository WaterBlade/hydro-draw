import { Line, Text } from "../drawItem";
import { vec } from "../misc";
import {
  Cell,
  HIntervals,
  Interval,
  TableBuilder,
  VIntervals,
} from "./TableBuilder";

describe("Table", () => {
  test("cell", () => {
    const t = new TableBuilder();
    t.cell(1, 1);
    expect(t.cells.length).toEqual(1);
    expect(t.rowCount).toEqual(2);
    expect(t.colCount).toEqual(2);
  });
  test("compute cell width", () => {
    const t = new TableBuilder();
    expect(t.computeCellWidth(5)).toEqual(15);
  });
  test("compute width list", () => {
    const t = new TableBuilder();
    const c = t.cell(1, 1);
    c.push(new Line(vec(0, 0), vec(1, 1)));
    expect(t.computeWidthList()).toEqual([10, 10]);
  });
  test("compute cell height", () => {
    const t = new TableBuilder();
    expect(t.computeCellHeight(2)).toEqual(10);
  });
  test("compute height list", () => {
    const t = new TableBuilder();
    const c = t.cell(1, 1);
    c.push(new Line(vec(0, 0), vec(1, 1)));
    expect(t.computeHeightList()).toEqual([10, 10]);
  });
});

describe("cell", () => {
  test("push", () => {
    const c = new Cell(3.5, 1, 1);
    c.push(new Line(vec(0, 0), vec(1, 1)));
    expect(c.items.length).toEqual(1);
  });
  test("center", () => {
    const c = new Cell(3.5, 1, 1);
    const v = c.getCellCenter([2, 1], [2, 1]);
    expect(v.toArray()).toEqual([2.5, -2.5]);
  });
  test("draw", () => {
    const c = new Cell(3.5, 0, 0);
    const l = new Line(vec(0, 0), vec(2, 2));
    c.push(l);
    c.draw([4], [10]);
    expect(l.start.toArray()).toEqual([4, -3]);
    expect(l.end.toArray()).toEqual([6, -1]);
  });
  test("text", () => {
    const c = new Cell(3.5, 0, 0);
    c.text("hello");
    expect(c.items.length).toEqual(1);
    expect((c.items[0] as Text).insertPoint.toArray()).toEqual([0, 0]);
    expect((c.items[0] as Text).height).toEqual(3.5);
  });
});

describe("interval", () => {
  test("init", () => {
    const h = new Interval(5);
    expect(h.segments.length).toEqual(5);
  });
  test("split", () => {
    const h = new Interval(5);
    h.split(0, 2);
    expect(h.segments.slice(0, 2)).toEqual([0, 0]);
  });
  test("draw", () => {
    const h = new Interval(2);
    const lines = h.draw(vec(0, 0), [1, 2]);
    expect(lines[0].start.x).toEqual(0);
    expect(lines[0].end.x).toEqual(3);
  });
  test("draw split", () => {
    const h = new Interval(5);
    h.split(2, 2);
    const ls = [1, 1, 1, 1, 1];
    const lines = h.draw(vec(0, 0), ls);
    expect(lines.length).toEqual(2);
    expect(lines[0].start.x).toEqual(0);
    expect(lines[0].end.x).toEqual(2);
    expect(lines[1].start.x).toEqual(4);
    expect(lines[1].end.x).toEqual(5);
  });
  test("draw split to end", () => {
    const h = new Interval(2);
    h.split(1, 1);
    const ls = [1, 1];
    const lines = h.draw(vec(0, 0), ls);
    expect(lines.length).toEqual(1);
    expect(lines[0].start.x).toEqual(0);
    expect(lines[0].end.x).toEqual(1);
  });
});

describe("horizontal interval", () => {
  test("init", () => {
    const h = new HIntervals(5, 5);
    expect(h.intervals.length).toEqual(4);
    expect(h.intervals[0].count).toEqual(5);
  });
  test("split", () => {
    const h = new HIntervals(5, 5);
    h.split(1, 1, 2, 3);
    expect(h.intervals[1].segments).toEqual([1, 0, 0, 0, 1]);
    expect(h.intervals[2].segments).toEqual([1, 1, 1, 1, 1]);
  });
  test("split to end", () => {
    const h = new HIntervals(5, 5);
    h.split(1, 1, 2, 4);
    expect(h.intervals[1].segments).toEqual([1, 0, 0, 0, 0]);
  });
  test("draw", () => {
    const h = new HIntervals(3, 2);
    const ls = h.draw([1, 2, 3], [1, 2]);
    expect(ls.length).toEqual(2);
    expect((ls[0] as Line).start.toArray()).toEqual([0, -1]);
    expect((ls[0] as Line).end.toArray()).toEqual([3, -1]);
    expect((ls[1] as Line).start.toArray()).toEqual([0, -3]);
    expect((ls[1] as Line).end.toArray()).toEqual([3, -3]);
  });
});

describe("vertical interval", () => {
  test("init", () => {
    const h = new VIntervals(5, 6);
    expect(h.intervals.length).toEqual(5);
    expect(h.intervals[0].count).toEqual(5);
  });
  test("split", () => {
    const h = new VIntervals(5, 5);
    h.split(1, 1, 2, 3);
    expect(h.intervals[1].segments).toEqual([1, 0, 0, 1, 1]);
    expect(h.intervals[2].segments).toEqual([1, 0, 0, 1, 1]);
    expect(h.intervals[3].segments).toEqual([1, 1, 1, 1, 1]);
  });
  test("split to end", () => {
    const h = new VIntervals(5, 5);
    h.split(3, 2, 2, 2);
    expect(h.intervals[2].segments).toEqual([1, 1, 1, 0, 0]);
  });
  test("draw", () => {
    const h = new VIntervals(3, 4);
    const ls = h.draw([1, 2, 3], [1, 2, 3, 4]);
    expect(ls.length).toEqual(3);
    expect((ls[0] as Line).start.toArray()).toEqual([1, 0]);
    expect((ls[0] as Line).end.toArray()).toEqual([1, -6]);
    expect((ls[1] as Line).start.toArray()).toEqual([3, 0]);
    expect((ls[1] as Line).end.toArray()).toEqual([3, -6]);
    expect((ls[2] as Line).start.toArray()).toEqual([6, 0]);
    expect((ls[2] as Line).end.toArray()).toEqual([6, -6]);
  });
});
