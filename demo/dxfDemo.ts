import { Arc, Arrow, Circle, DimAligned, DXFPaper, Line, MText, Text, TextAlign, vec } from "@/draw";
import fs from "fs";

export default function runDXFDemo():void{

  const paper = new DXFPaper();
  paper.push(
    new Arc(vec(0, 0), 50, 0, 180),
    new Circle(vec(0, 0), 100),
    new Text('hello world', vec(0, 0), 25, TextAlign.MiddleCenter),
    new Line(vec(0, 0), vec(100, 100)),
    new Arrow(vec(0, 0), vec(20, 0), 10),
    new MText(['hello', 'world'], vec(0, 100), 25, 500),
    new DimAligned(vec(0, 0), vec(100, 100), vec(30, 50), 1, 20),
    new DimAligned(vec(200, 100), vec(100, 0), vec(30, 50), 1, 20),
    new DimAligned(vec(300, 100), vec(200, 0), vec(30, 50), 1, 20, 'h')
  );
  fs.writeFile('demoDXF.dxf', paper.generate(), ()=>{
    console.log('dxf dim demo finished');
  })
}