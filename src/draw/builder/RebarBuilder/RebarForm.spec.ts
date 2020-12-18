import { Arc, Line, Text } from "@/draw/drawItem";
import { RotateDirection, TextAlign, vec } from "@/draw/misc";
import { RebarPathForm } from "./RebarForm";

test("add line", () => {
  const s = new RebarPathForm(8);
  s.lineBy(1, 1);
  expect(s.segments.length).toEqual(1);
  const l = s.segments[0] as Line;
  expect(l.start).toEqual(vec(0, 0));
  expect(l.end).toEqual(vec(5, 5));
});

test("add arc", () => {
  const s = new RebarPathForm(8);
  s.arcBy(4, 0, 180);
  expect(s.segments.length).toEqual(1);
  const a = s.segments[0] as Arc;
  expect(a.startAngle).toEqual(180);
  expect(a.endAngle).toEqual(0);
  expect(a.center).toEqual(vec(10, 0));
});

test("line dimlength 0", () => {
  const s = new RebarPathForm(8);
  s.lineBy(2, 0).dimLength(500);
  expect(s.notes.length).toEqual(1);
  const t = s.notes[0] as Text;
  expect(t.insertPoint).toEqual(vec(5, 0.625));
  expect(t.height).toEqual(2.5);
  expect(t.textAlign).toEqual(TextAlign.BottomCenter);
});

test("line dimlength 90", () => {
  const s = new RebarPathForm(8);
  s.lineBy(0, 2).dimLength(500);
  expect(s.notes.length).toEqual(1);
  const t = s.notes[0] as Text;
  expect(t.insertPoint).toEqual(vec(-0.625, 5));
  expect(t.height).toEqual(2.5);
  expect(t.textAlign).toEqual(TextAlign.BottomCenter);
});

test("line dimlength 180", () => {
  const s = new RebarPathForm(8);
  s.lineBy(-2, 0).dimLength(500);
  expect(s.notes.length).toEqual(1);
  const t = s.notes[0] as Text;
  expect(t.insertPoint).toEqual(vec(-5, -0.625));
  expect(t.height).toEqual(2.5);
  expect(t.textAlign).toEqual(TextAlign.TopCenter);
});

test("line dimlength 270", () => {
  const s = new RebarPathForm(8);
  s.lineBy(0, -2).dimLength(500);
  expect(s.notes.length).toEqual(1);
  const t = s.notes[0] as Text;
  expect(t.insertPoint).toEqual(vec(0.625, -5));
  expect(t.height).toEqual(2.5);
  expect(t.textAlign).toEqual(TextAlign.TopCenter);
});

test("arc dimlength 0", () => {
  const s = new RebarPathForm(8);
  s.arcBy(2, 0, 180, RotateDirection.clockwise).dimLength(500);
  expect(s.notes.length).toEqual(1);
  const t = s.notes[0] as Text;
  const p = t.insertPoint;
  expect(p.x).toBeCloseTo(5);
  expect(p.y).toBeCloseTo(5.625);
  expect(t.height).toEqual(2.5);
  expect(t.textAlign).toEqual(TextAlign.BottomCenter);
});

test("arc dimlength 90", () => {
  const s = new RebarPathForm(8);
  s.arcBy(0, 2, 180).dimLength(500);
  expect(s.notes.length).toEqual(1);
  const t = s.notes[0] as Text;
  const p = t.insertPoint;
  expect(p.x).toBeCloseTo(5.625);
  expect(p.y).toBeCloseTo(5);
  expect(t.height).toEqual(2.5);
  expect(t.textAlign).toEqual(TextAlign.TopCenter);
});

test("arc dimlength 180", () => {
  const s = new RebarPathForm(8);
  s.arcBy(2, 0, 180).dimLength(500);
  expect(s.notes.length).toEqual(1);
  const t = s.notes[0] as Text;
  const p = t.insertPoint;
  expect(p.x).toBeCloseTo(5);
  expect(p.y).toBeCloseTo(-5.625);
  expect(t.height).toEqual(2.5);
  expect(t.textAlign).toEqual(TextAlign.TopCenter);
});

test("arc dimlength 270", () => {
  const s = new RebarPathForm(8);
  s.arcBy(0, -2, 180).dimLength(500);
  expect(s.notes.length).toEqual(1);
  const t = s.notes[0] as Text;
  const p = t.insertPoint;
  expect(p.x).toBeCloseTo(-5.625);
  expect(p.y).toBeCloseTo(-5);
  expect(t.height).toEqual(2.5);
  expect(t.textAlign).toEqual(TextAlign.BottomCenter);
});
