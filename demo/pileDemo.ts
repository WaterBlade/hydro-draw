import { PileController } from "@/struct";
import { HLayoutBuilder, ScriptPaper } from "@/draw";
import fs from "fs";

export default function runPileDemo(): void{
  const paper = new ScriptPaper();
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

  const bar = ctrl.rebar;
  bar.main.set('HRB400', 22, 17);
  bar.stir.set('HPB300', 10, 200, 100);
  bar.stirTop.set('HPB300', 10, 200);
  bar.rib.set('HRB400', 16, 2000);
  bar.fix.set('HRB400', 16, 2000);
  bar.info.as = 60;

  ctrl.add('5', 241.035, 230.035, 2);
  ctrl.add('6', 234.728, 223.728, 4);
  ctrl.add('7', 218.213, 209.213, 4);
  ctrl.add('8', 230.698, 220.698, 4);
  ctrl.add('9', 242.683, 231.683, 4);
  ctrl.add('18', 240.415, 229.415, 2);
  ctrl.add('19', 229.608, 219.608, 4);
  ctrl.add('20', 224.593, 214.593, 4);
  ctrl.add('21', 215.878, 205.878, 4);
  ctrl.add('22', 197.863, 187.863, 4);
  ctrl.add('23', 201.848, 191.878, 4);
  ctrl.add('24', 222.533, 210.533, 4);
  ctrl.add('25', 237.518, 225.518, 4);

  


  const layout = new HLayoutBuilder(100);
  layout.push(...ctrl.generate());
  paper.push(layout.generate());

  fs.writeFile('demoPile.txt', paper.pack(), ()=>{
    console.log('pile demo finished');
  })
  
}