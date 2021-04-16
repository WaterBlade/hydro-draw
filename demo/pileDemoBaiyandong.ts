import { PileController } from "@/struct";
import { HLayoutBuilder, DXFPaper } from "@/draw";
import fs from "fs";

export default function runPileDemoBaiyandong(): void{
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
  bar.stir.setSpec('HPB300', 10).setSpace(200, 100);
  bar.stirTop.setSpec('HPB300', 10).setSpace(200);
  bar.rib.setSpec('HRB400', 16).setSpace(2000);
  bar.fix.setSpec('HRB400', 16).setSpace(2000);
  bar.as = 60;

  ctrl.add('1', 247.585, 241.585, 2);
  ctrl.add('7', 242.041, 235.541, 2);
  ctrl.add('8', 242.033, 234.033, 2);
  ctrl.add('11', 242.511, 235.011, 2);
  ctrl.add('14', 242.488, 233.488, 2);
  ctrl.add('15', 242.481, 236.481, 2);
  ctrl.add('16', 242.473, 229.473, 2);

  


  const layout = new HLayoutBuilder(100);
  layout.push(...ctrl.generate());
  paper.push(layout.generate());

  fs.writeFile('白眼洞渡槽桩基础钢筋图.dxf', paper.generate(), ()=>{
    console.log('白眼洞渡槽桩基础钢筋图');
  })
  
}