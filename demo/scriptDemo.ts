import {Arc, Arrow, Circle, CompositeItem, DimAligned, Line, ScriptPaper, TableBuilder, Text } from "../src/draw";
import { vec } from "../src/draw/Vector";
import fs from "fs";
import { TextAlign } from "../src/draw/TextAlign";

export default function runScriptDemo():void{
  const paper = new ScriptPaper();
  // paper.push(
  //   new Arc(vec(0, 0), 2, 0, 180),
  //   new Arrow(vec(2, 0), vec(3, 0), 1),
  //   new Circle(vec(4,0), 1),
  //   new DimAligned(vec(0, 10), vec(10, 10), vec(5, 12), 1000, 500),
  //   new Line(vec(6, 0), vec(16, 0)),
  //   new Text('Hello World', vec(16, 0), 1.75, TextAlign.MiddleCenter),
  // )
  // const comp = new CompositeItem(vec(20, 20));
  // comp.push(
  //   new Arc(vec(0, 0), 2, 0, 180),
  //   new Arrow(vec(2, 0), vec(3, 0), 1),
  //   new Circle(vec(4,0), 1),
  //   new DimAligned(vec(0, 10), vec(10, 10), vec(5, 12), 1000, 500),
  //   new Line(vec(6, 0), vec(16, 0)),
  //   new Text('Hello World', vec(16, 0), 1.75, TextAlign.MiddleCenter),
  // )
  // comp.scale(2);
  // paper.push(comp);
  const table = new TableBuilder(3.5);
  table.cell(0, 0).text('hello');
  table.cell(0, 1).text('world');
  table.cell(1, 0, 1, 2).text('first meet');
  table.title = 'new table';
  paper.push(table.generate());
  fs.writeFile('scriptDemo.txt', paper.pack(), ()=>{
    console.log('script demo finished');
  })
}