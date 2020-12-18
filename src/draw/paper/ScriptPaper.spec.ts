import { ScriptPaper } from "./ScriptPaper";
import {
  Arc,
  Arrow,
  Circle,
  DimAligned,
  Line,
  MText,
  Text,
} from "@/draw/drawItem";
import { vec, LineType, RotateDirection } from "@/draw/misc";

test("push method", () => {
  const paper = new ScriptPaper();
  paper.push(new Line(vec(0, 0), vec(1, 1)));
  expect(paper.itemList.length).toEqual(1);
});
test("pack", () => {
  const paper = new ScriptPaper();
  const mock = {
    lineType: LineType.Thick,
    accept: jest.fn(),
  };
  paper.push(mock);
  paper.pack();
  expect(mock.accept.mock.calls.length).toEqual(1);
});
test("pack init", () => {
  const paper = new ScriptPaper();
  const res = paper.pack();
  expect(res).toEqual(
    [
      "-layer",
      "m",
      "细线",
      "c",
      "green",
      "细线",
      "",
      "-layer",
      "m",
      "中粗线",
      "c",
      "yellow",
      "中粗线",
      "",
      "-layer",
      "m",
      "粗线",
      "c",
      "red",
      "粗线",
      "",
      "-layer",
      "m",
      "加粗线",
      "c",
      "magenta",
      "加粗线",
      "",
      "-layer",
      "m",
      "虚线",
      "c",
      "blue",
      "虚线",
      "",
      "-layer",
      "m",
      "中心线",
      "c",
      "cyan",
      "中心线",
      "",
      "-layer",
      "m",
      "淡显线",
      "c",
      "9",
      "淡显线",
      "",
      "-style",
      "hz",
      "simp1.shx,hztxt.shx",
      "0",
      "0.7",
      "0",
      "n",
      "n",
      "n",
      "zoom",
      "E",
      "",
    ].join("\r\n")
  );
});

test("arc counterclockwise", () => {
  const paper = new ScriptPaper();
  const arc = new Arc(vec(0, 0), 2, 0, 180);
  paper.visitArc(arc, vec(1, 1));
  expect(paper.scriptList).toEqual([
    ScriptPaper.ESCChar + "-layer",
    "S",
    "细线",
    "",
    ScriptPaper.ESCChar + "arc",
    "c",
    "1.0000,1.0000",
    "3.0000,1.0000",
    "-1.0000,1.0000",
  ]);
});
test("arc clockwise", () => {
  const paper = new ScriptPaper();
  const arc = new Arc(vec(0, 0), 2, 0, 180, RotateDirection.clockwise);
  paper.visitArc(arc, vec(1, 1));
  expect(paper.scriptList).toEqual([
    ScriptPaper.ESCChar + "-layer",
    "S",
    "细线",
    "",
    ScriptPaper.ESCChar + "arc",
    "c",
    "1.0000,1.0000",
    "-1.0000,1.0000",
    "3.0000,1.0000",
  ]);
});
test("arrow", () => {
  const paper = new ScriptPaper();
  const arrow = new Arrow(vec(0, 0), vec(1, 0), 2);
  paper.visitArrow(arrow, vec(1, 1));
  expect(paper.scriptList).toEqual([
    ScriptPaper.ESCChar + "-layer",
    "S",
    "细线",
    "",
    ScriptPaper.ESCChar + "pline",
    "1.0000,1.0000",
    "w",
    "0",
    "2.0000",
    "2.0000,1.0000",
    "",
    "plinewid",
    "0",
  ]);
});
test("circle", () => {
  const paper = new ScriptPaper();
  const circle = new Circle(vec(0, 0), 2);
  paper.visitCircle(circle, vec(1, 1));
  expect(paper.scriptList).toEqual([
    ScriptPaper.ESCChar + "-layer",
    "S",
    "细线",
    "",
    ScriptPaper.ESCChar + "circle",
    "1.0000,1.0000",
    "2.0000",
  ]);
});
test("dimaligned with used scale", () => {
  const paper = new ScriptPaper();
  const dim = new DimAligned(vec(0, 0), vec(1, 0), vec(0.5, 1.5), 1, 1, "100");
  paper.dimStyleNameList.push("1-1");
  paper.visitDimAligned(dim, vec(1, 1));
  expect(paper.scriptList).toEqual([
    ScriptPaper.ESCChar + "-layer",
    "S",
    "细线",
    "",
    "-dimstyle",
    "r",
    "1-1",
    ScriptPaper.ESCChar + "dimaligned",
    "1.0000,1.0000",
    "2.0000,1.0000",
    "T",
    "100",
    "1.5000,2.5000",
  ]);
});
test("dimaligned with unused scale", () => {
  const paper = new ScriptPaper();
  const dim = new DimAligned(vec(0, 0), vec(1, 0), vec(0.5, 1.5), 1, 1);
  paper.visitDimAligned(dim, vec(1, 1));
  expect(paper.scriptList).toEqual([
    ScriptPaper.ESCChar + "-layer",
    "S",
    "细线",
    "",
    "dimasz",
    "2.5",
    "dimtxsty",
    "HZ",
    "dimtxt",
    "2.5",
    "dimclrd",
    "256",
    "dimclre",
    "256",
    "dimclrt",
    "256",
    "dimdec",
    "0",
    "dimfrac",
    "0",
    "dimtfill",
    "0",
    "dimtmove",
    "1",
    "dimlfac",
    "1.0000",
    "dimscale",
    "1.0000",
    "-dimstyle",
    "s",
    "1-1",
    ScriptPaper.ESCChar,
    ScriptPaper.ESCChar + "dimaligned",
    "1.0000,1.0000",
    "2.0000,1.0000",
    "1.5000,2.5000",
  ]);
});
test("line", () => {
  const paper = new ScriptPaper();
  const line = new Line(vec(0, 0), vec(1, 0));
  paper.visitLine(line, vec(1, 1));
  expect(paper.scriptList).toEqual([
    ScriptPaper.ESCChar + "-layer",
    "S",
    "细线",
    "",
    ScriptPaper.ESCChar + "line",
    "1.0000,1.0000",
    "2.0000,1.0000",
    "",
  ]);
});
test("mtext", () => {
  const paper = new ScriptPaper();
  const mtext = new MText(["hello", "world"], vec(0, 0), 2.5, 20);
  paper.visitMText(mtext, vec(1, 2));
  expect(paper.scriptList).toEqual([
    ScriptPaper.ESCChar + "-layer",
    "S",
    "细线",
    "",
    ScriptPaper.ESCChar + "-mtext",
    "1.0000,2.0000",
    "s",
    "hz",
    "h",
    "2.5000",
    "l",
    "e",
    "3.7500",
    "w",
    "8.7500",
    "hello",
    "world",
    "",
    "",
  ]);
});
test("text", () => {
  const paper = new ScriptPaper();
  const text = new Text("Hello", vec(1, 0), 2.5);
  paper.visitText(text, vec(1, 1));
  expect(paper.scriptList).toEqual([
    ScriptPaper.ESCChar + "-layer",
    "S",
    "细线",
    "",
    ScriptPaper.ESCChar + "-text",
    "s",
    "hz",
    "j",
    "BL",
    "2.0000,1.0000",
    "2.5000",
    "0.0000",
    "Hello",
  ]);
});
