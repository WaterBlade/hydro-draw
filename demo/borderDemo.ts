import {Circle, ScriptPaper, Text } from "../src/draw";
import { TextAlign, vec } from "../src/draw/misc";
import fs from "fs";
import { HLayoutBuilder } from "../src/draw/builder";
import { HydroA1Builder } from "@/draw/builder/BorderBuilder/HydroBorder";

export default function runBorderDemo():void{
  const paper = new ScriptPaper();
  const border = new HydroA1Builder();
  border.company = '湖南省水利水电勘测设计研究总院';
  border.project = '涔天河水库扩建工程';
  border.drawingTitle = '图框绘图测试';
  border.design = '技施'
  border.section = '水工'
  border.date = '2020.10'
  border.drawingNumberPrefix = '';
  border.drawingNumberStart = 1;

  border.note = [
    '1.图中单位：尺寸为mm',
  ]
  for(let i = 0; i < 250; i++){
    border.addItem(new Circle(vec(0, 0), 100*Math.random()), 1, 1, new Text('标题', vec(0, 0), 5, TextAlign.MiddleCenter));
  }

  const layout = new HLayoutBuilder(10);
  layout.push(...border.generate());
  paper.push(layout.generate());
  fs.writeFile('demoBorder.txt', paper.pack(), ()=>{
    console.log('border demo finished');
  })
}