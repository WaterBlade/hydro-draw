import { PileController } from "@/struct";
import { HLayoutBuilder, DXFPaper } from "@/draw";
import fs from "fs";

export default function runPileDemoMaolicao(): void{
  const paper = new DXFPaper();
  const ctrl = new PileController();
  const draw = ctrl.drawing;
  draw.company = '湖南省水利水电勘测设计研究总院';
  draw.project = '涔天河水库扩建工程';
  draw.design = '技施';
  draw.drawingTitle = "毛栗槽渡槽14#-25#排架桩基础钢筋图";
  draw.drawingNumberPrefix = "HND/s-4-渡槽-";
  draw.note = [
    '图中单位：尺寸为mm',
  ]

  const pile = ctrl.struct;
  pile.d = 800;
  pile.hs = 150;

  const bar = ctrl.rebar;
  bar.main.setSpec('HRB400', 25).setCount(11);
  bar.stir.setSpec('HPB300', 8).setSpace(200, 100);
  bar.stirTop.setSpec('HPB300', 8).setSpace(200);
  bar.rib.setSpec('HRB400', 16).setSpace(2000);
  bar.fix.setSpec('HRB400', 16).setSpace(2000);
  bar.as = 60;

  ctrl.add('14', 248.880-1.5, 242.880, 2);
  ctrl.add('15', 247.872-1.5, 237.372, 2);
  ctrl.add('16', 248.865-1.5, 238.365, 2);
  ctrl.add('17-1', 248.857-1.5, 240.857, 1);
  ctrl.add('17-2', 248.857-1.5, 239.357, 1);
  ctrl.add('18-1', 247.850-1.5, 241.350, 1);
  ctrl.add('18-2', 247.850-1.5, 242.350, 1);
  ctrl.add('19', 248.842-1.5, 238.342, 2);
  ctrl.add('20', 246.835-1.5, 241.335, 2);
  ctrl.add('21', 247.827-1.5, 242.327, 2);
  ctrl.add('22-1', 250.820-1.5, 243.320, 1);
  ctrl.add('22-2', 250.820-1.5, 238.320, 1);
  ctrl.add('23', 252.812-1.5, 244.312, 2);
  ctrl.add('24-1', 253.805-1.5, 237.305, 1);
  ctrl.add('24-2', 253.805-1.5, 242.305, 1);
  ctrl.add('25', 254.797-1.5, 245.297, 2);

  


  const layout = new HLayoutBuilder(100);
  layout.push(...ctrl.generate());
  paper.push(layout.generate());

  fs.writeFile('毛栗槽桩基础钢筋图.dxf', paper.generate(), ()=>{
    console.log('pile demo finished');
  })
  
}