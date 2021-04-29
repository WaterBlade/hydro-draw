import { PileController } from "@/struct";
import { HLayoutBuilder, DXFPaper } from "@/draw";
import fs from "fs";

export default function runPileDemoFengXingLing(): void{
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
  pile.d = 1200;
  pile.hs = 150;

  const bar = ctrl.rebar;
  bar.main.setSpec('HRB400', 25).setCount(17);
  bar.stir.setSpec('HPB300', 10).setSpace(200, 100);
  bar.stirTop.setSpec('HPB300', 10).setSpace(200);
  bar.rib.setSpec('HRB400', 16).setSpace(2000);
  bar.fix.setSpec('HRB400', 16).setSpace(2000);
  bar.as = 60;

  ctrl.add('17-1', 218.737, 212.737, 1);
  ctrl.add('17-2', 218.737, 210.737, 1);
  ctrl.add('17-3', 218.737, 211.737, 1);
  ctrl.add('17-4', 218.737, 209.737, 1);

  


  const layout = new HLayoutBuilder(100);
  layout.push(...ctrl.generate());
  paper.push(layout.generate());

  fs.writeFile('左三凤形岭桩基础钢筋图.dxf', paper.generate(), ()=>{
    console.log('pile demo finished');
  })
  
}