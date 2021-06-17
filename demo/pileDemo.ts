import { PileController } from "@/struct";
import { HLayoutBuilder, DXFPaper } from "@/draw";
import fs from "fs";

export default function runPileDemo(): void{
  const paper = new DXFPaper();
  const ctrl = new PileController();
  const draw = ctrl.drawing;
  draw.company = '湖南省水利水电勘测设计研究总院';
  draw.project = '涔天河水库扩建工程';
  draw.design = '技施';
  draw.drawingTitle = "桩基础钢筋图";
  draw.drawingNumberPrefix = "HND/s-4-渡槽-";
  draw.note = [
    '图中单位：尺寸为mm',
  ]

  const pile = ctrl.struct;
  pile.d = 800;
  pile.hs = 150;

  const bar = ctrl.rebar;
  bar.main.setSpec('HRB400', 22).setCount(11);
  bar.stir.setSpec('HPB300', 8).setSpace(200, 100);
  bar.stirTop.setSpec('HPB300', 8).setSpace(200);
  bar.rib.setSpec('HRB400', 16).setSpace(2000);
  bar.fix.setSpec('HRB400', 16).setSpace(2000);
  bar.as = 60;

  ctrl.add('1', 296.810, 284.810, 2);
  ctrl.add('2', 292.303, 277.303, 2);
  ctrl.add('3', 292.795, 277.795, 2);
  ctrl.add('4', 293.788, 276.788, 2);
  ctrl.add('5', 294.280, 279.280, 2);
  ctrl.add('6', 296.272, 283.272, 2);

  


  const layout = new HLayoutBuilder(100);
  layout.push(...ctrl.generate());
  paper.push(layout.generate());

  fs.writeFile('白芒营.dxf', paper.generate(), ()=>{
    console.log('pile demo finished');
  })
  
}