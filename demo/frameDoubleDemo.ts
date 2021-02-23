import { FrameDoubleController} from "@/struct";
import { HLayoutBuilder, ScriptPaper } from "@/draw";
import fs from "fs";

export default function runFrameDoubleDemo(): void{
  const paper = new ScriptPaper();
  const ctrl = new FrameDoubleController();
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
  f.hsCross = 4000;
  f.hsAlong = 2500;
  f.vs = 4000;

  f.col.w = 500;
  f.col.h = 600;

  f.beamCross.w = 400;
  f.beamCross.h = 600;
  f.beamCross.ha = 200;

  f.beamAlong.w = 400;
  f.beamAlong.h = 600;
  f.beamAlong.ha = 200;

  f.topCross.w = 700;
  f.topCross.h = 600;
  f.topCross.ha = 200;

  f.topAlong.w = 700;
  f.topAlong.h = 600;
  f.topAlong.ha = 200;

  f.found.h = 1500;
  f.found.s = 150;

  const bar = ctrl.rebar;
  bar.info.as = 50;
  bar.col.corner.set('HRB400', 22);
  bar.col.along.set('HRB400', 22, 3);
  bar.col.cross.set('HRB400', 22, 3);
  bar.col.stir.set('HPB300', 10, 200, 100);

  bar.topCross.bot.set('HRB400', 20, 4);
  bar.topCross.top.set('HRB400', 20, 4);
  bar.topCross.mid.set('HRB400', 12, 2);
  bar.topCross.stir.set('HPB300', 10, 125);
  bar.topCross.tendon.set('HPB300', 8, 400);

  bar.topAlong.bot.set('HRB400', 20, 4);
  bar.topAlong.top.set('HRB400', 20, 4);
  bar.topAlong.mid.set('HRB400', 12, 2);
  bar.topAlong.stir.set('HPB300', 10, 125);
  bar.topAlong.tendon.set('HPB300', 8, 400);
  
  bar.beamCross.bot.set('HRB400', 20, 4);
  bar.beamCross.top.set('HRB400', 20, 4);
  bar.beamCross.mid.set('HRB400', 12, 2);
  bar.beamCross.stir.set('HPB300', 10, 125);
  bar.beamCross.tendon.set('HPB300', 8, 400);

  bar.beamAlong.bot.set('HRB400', 20, 4);
  bar.beamAlong.top.set('HRB400', 20, 4);
  bar.beamAlong.mid.set('HRB400', 12, 2);
  bar.beamAlong.stir.set('HPB300', 10, 125);
  bar.beamAlong.tendon.set('HPB300', 8, 400);


  const layout = new HLayoutBuilder(100);
  layout.push(...ctrl.generate());
  paper.push(layout.generate());

  fs.writeFile('demoFrameDouble.txt', paper.generate(), ()=>{
    console.log('frame double demo finished');
  })
  
}