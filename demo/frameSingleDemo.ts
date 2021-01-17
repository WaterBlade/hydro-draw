import { FrameSingleController} from "@/struct";
import { HLayoutBuilder, ScriptPaper } from "@/draw";
import fs from "fs";

export default function runFrameSingleDemo(): void{
  const paper = new ScriptPaper();
  const ctrl = new FrameSingleController();
  const draw = ctrl.drawing;
  draw.company = '湖南省水利水电勘测设计研究总院';
  draw.project = '涔天河水库扩建工程';
  draw.design = '技施';
  draw.drawingTitle = "单排架钢筋图";
  draw.drawingNumberPrefix = "HND/s-4-渡槽-";
  draw.note = [
    '图中单位：尺寸为mm',
  ]

  const f = ctrl.struct;
  f.h = 15000;
  f.hs = 4000;
  f.vs = 4000;

  f.col.w = 500;
  f.col.h = 800;

  f.beam.w = 400;
  f.beam.h = 600;
  f.beam.ha = 200;

  f.topBeam.w = 700;
  f.topBeam.h = 600;
  f.topBeam.ha = 200;

  f.corbel.w = 550;
  f.corbel.hd = 400;
  f.corbel.hs = 450;

  f.found.h = 1500;
  f.found.s = 150;

  const bar = ctrl.rebar;
  bar.column.corner.set('HRB400', 22);
  bar.column.along.set('HRB400', 22, 3);
  bar.column.cross.set('HRB400', 22, 3);
  bar.column.stir.set('HPB300', 10, 200, 100);

  bar.topBeam.bot.set('HRB400', 20, 4);
  bar.topBeam.top.set('HRB400', 20, 4);
  bar.topBeam.mid.set('HRB400', 12, 2);
  bar.topBeam.stir.set('HPB300', 10, 125);
  
  bar.beam.bot.set('HRB400', 20, 4);
  bar.beam.top.set('HRB400', 20, 4);
  bar.beam.mid.set('HRB400', 12, 2);
  bar.beam.stir.set('HPB300', 10, 125);

  bar.corbel.main.set('HRB400', 20, 4);
  bar.corbel.hStir.set('HPB300', 10, 100);
  bar.corbel.vStir.set('HPB300', 10, 100);

  const layout = new HLayoutBuilder(100);
  layout.push(...ctrl.generate());
  paper.push(layout.generate());

  fs.writeFile('demoFrameSingle.txt', paper.pack(), ()=>{
    console.log('frame demo finished');
  })
  
}