import { FrameDoubleController} from "@/struct";
import { HLayoutBuilder, DXFPaper } from "@/draw";
import fs from "fs";

export default function runFrameDoubleDemo(): void{
  const paper = new DXFPaper();
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
  f.beamCross.topHa = true;
  f.beamCross.botHa = true;

  f.beamAlong.w = 400;
  f.beamAlong.h = 600;
  f.beamAlong.ha = 200;
  f.beamAlong.topHa = true;
  f.beamAlong.botHa = true;

  f.topCross.w = 700;
  f.topCross.h = 600;
  f.topCross.ha = 200;
  f.topCross.botHa = true;

  f.topAlong.w = 700;
  f.topAlong.h = 600;
  f.topAlong.ha = 200;
  f.topAlong.botHa = true;

  f.found.h = 1500;
  f.found.s = 150;

  const bar = ctrl.rebar;
  bar.as = 50;
  bar.col.corner.setSpec('HRB400', 25);
  bar.col.along.setSpec('HRB400', 20).setCount(3);
  bar.col.cross.setSpec('HRB400', 22).setCount(3);
  bar.col.stir.setSpec('HPB300', 8).setSpace(200, 100);
  bar.col.stirAlong.setSpec('HPB300', 8).setSpace(200, 100);
  bar.col.stirCross.setSpec('HPB300', 8).setSpace(200, 100);
  bar.col.tendonAlong.setSpec('HPB300', 8).setSpace(200, 100);
  bar.col.tendonCross.setSpec('HPB300', 8).setSpace(200, 100);

  bar.topCross.bot.setSpec('HRB400', 20).setCount(4);
  bar.topCross.top.setSpec('HRB400', 20).setCount(4);
  bar.topCross.mid.setSpec('HRB400', 12).setCount(2);
  bar.topCross.stir.setSpec('HPB300', 8).setSpace(125);
  bar.topCross.tendon.setSpec('HPB300', 8).setSpace(250);
  bar.topCross.haunch.setSpec('HRB400', 16).setCount(2);

  bar.topAlong.bot.setSpec('HRB400', 20).setCount(4);
  bar.topAlong.top.setSpec('HRB400', 20).setCount(4);
  bar.topAlong.mid.setSpec('HRB400', 12).setCount(2);
  bar.topAlong.stir.setSpec('HPB300', 8).setSpace(125);
  bar.topAlong.tendon.setSpec('HPB300', 8).setSpace(250);
  bar.topAlong.haunch.setSpec('HRB400', 16).setCount(2);
  
  bar.beamCross.bot.setSpec('HRB400', 20).setCount(4);
  bar.beamCross.top.setSpec('HRB400', 20).setCount(4);
  bar.beamCross.mid.setSpec('HRB400', 12).setCount(2);
  bar.beamCross.stir.setSpec('HPB300', 8).setSpace(125);
  bar.beamCross.tendon.setSpec('HPB300', 8).setSpace(250);
  bar.beamCross.haunch.setSpec('HRB400', 16).setCount(2);

  bar.beamAlong.bot.setSpec('HRB400', 20).setCount(4);
  bar.beamAlong.top.setSpec('HRB400', 20).setCount(4);
  bar.beamAlong.mid.setSpec('HRB400', 12).setCount(2);
  bar.beamAlong.stir.setSpec('HPB300', 8).setSpace(125);
  bar.beamAlong.tendon.setSpec('HPB300', 8).setSpace(250);
  bar.beamAlong.haunch.setSpec('HRB400', 16).setCount(2);


  const layout = new HLayoutBuilder(100);
  layout.push(...ctrl.generate());
  paper.push(layout.generate());

  fs.writeFile('demoFrameDouble.dxf', paper.generate(), ()=>{
    console.log('frame double demo finished');
  })
  
}