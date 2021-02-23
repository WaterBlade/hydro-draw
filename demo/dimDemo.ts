import { HLayoutBuilder, ScriptPaper } from "@/draw";
import { DimensionBuilder } from "@/draw/builder/DimensionBuilder";
import fs from "fs";

export default function runDimDemo():void{
  const d0 = new DimensionBuilder(1, 10).hBottom(0, 0).dim(100).dim(100).dim(100).next().dim(300);

  const d1 = new DimensionBuilder(1, 10).hTop(0, 0).dim(100).dim(100).dim(100).next().dim(300);

  const d2 = new DimensionBuilder(1, 10).vLeft(0, 0).dim(100).dim(100).dim(100).next().dim(300);

  const d3 = new DimensionBuilder(1, 10).vRight(0, 0).dim(100).dim(100).dim(100).next().dim(300);


  const paper = new ScriptPaper();
  const layout = new HLayoutBuilder(10);
  layout.push(
    d0.generate(),
    d1.generate(),
    d2.generate(),
    d3.generate()
  )
  paper.push(layout.generate());
  fs.writeFile('demoDim.txt', paper.generate(), ()=>{
    console.log('dim demo finished');
  })
}