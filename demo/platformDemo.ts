import { PlatformController } from "@/struct";
import { HLayoutBuilder, ScriptPaper } from "@/draw";
import fs from "fs";

export default function runPlatformDemo(): void{
  const paper = new ScriptPaper();
  const ctrl = new PlatformController();
  const draw = ctrl.drawing;
  draw.company = '湖南省水利水电勘测设计研究总院';
  draw.project = '涔天河水库扩建工程';
  draw.design = '技施';
  draw.drawingTitle = "钢筋图";
  draw.drawingNumberPrefix = "HND/s-4-渡槽-";
  draw.setSize('A2');
  draw.note = [
    '图中单位：尺寸为mm',
  ];

  const plat = ctrl.struct;
  plat.d = 1200;
  plat.h = 1500;
  plat.l = 8000;
  plat.w = 4000;
  plat.nl = 2;
  plat.nw = 1;
  plat.hs = 150;

  const bar = ctrl.rebar;
  bar.lMain.set('HRB400', 28, 200, 100, 2);
  bar.wMain.set('HRB400', 28, 200, 100, 2);
  bar.dist.set('HRB400', 16, 200);
  bar.info.as = 60;


  const layout = new HLayoutBuilder(100);
  layout.push(...ctrl.generate());
  paper.push(layout.generate());

  fs.writeFile('demoPlatform.txt', paper.generate(), ()=>{
    console.log('platform demo finished');
  })
  
}