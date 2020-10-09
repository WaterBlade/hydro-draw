import {Arc, Arrow, Circle, CompositeItem, DimAligned, Line, ScriptPaper, TableBuilder, Text } from "../src/draw";
import { vec } from "../src/draw/misc";
import fs from "fs";
import { TextAlign } from "../src/draw/TextAlign";
import { HydroA1Builder, HLayoutBuilder } from "../src/draw/builder";

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
  // paper.push(table.generate());
  const border = new HydroA1Builder();
  border.company = '湖南省水利水电勘测设计研究总院';
  border.project = '涔天河水库扩建工程';
  border.design = '技施'
  border.section = '水工'
  border.date = '2020.10'

  border.note = [
    '1.图中单位：尺寸为mm',
  ]
  for(let i = 0; i < 1000; i++){
    border.addItem(new Circle(vec(0, 0), 100*Math.random()), 1, 1);
  }
  const layout = new HLayoutBuilder(10);
  layout.push(...border.generate());
  paper.push(layout.generate());
  fs.writeFile('scriptDemo.txt', paper.pack(), ()=>{
    console.log('script demo finished');
  })
}