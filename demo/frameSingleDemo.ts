import { FrameSingleController} from "@/struct";
import { HLayoutBuilder, DXFPaper, DrawItem } from "@/draw";
import fs from "fs";

export default function runFrameSingleDemo(): void{

  const paper = new DXFPaper();
  const layout = new HLayoutBuilder(100);
  layout.push(...genFrame(4500));
  layout.push(...genFrame(4000));
  layout.push(...genFrame(3000));
  layout.push(...genFrame(2500));
  layout.push(...genFrame(1500));
  paper.push(layout.generate());

  fs.writeFile('白芒营排架.dxf', paper.generate(), ()=>{
    console.log('白芒营');
  })
  
}


function genFrame(height: number): DrawItem[]{
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
  f.h = height;
  f.hs = 2500;
  f.vs = 4000;

  f.col.w = 500;
  f.col.h = 700;

  f.beam.w = 400;
  f.beam.h = 600;
  f.beam.ha = 200;
  f.beam.topHa = true;
  f.beam.botHa = true;

  f.topBeam.w = 700;
  f.topBeam.h = 600;
  f.topBeam.ha = 200;
  f.topBeam.botHa = true;

  f.corbel.w = 400;
  f.corbel.hd = 300;
  f.corbel.hs = 300;

  f.found.h = 1000;
  f.found.s = 150;

  const bar = ctrl.rebar;
  bar.as = 50;
  if(height <= 12000){
    bar.col.corner.setSpec('HRB400', 22);
    bar.col.along.setSpec('HRB400', 20).setCount(4);
    bar.col.cross.setSpec('HRB400', 20).setCount(4);
  }else{
    bar.col.corner.setSpec('HRB400', 28);
    bar.col.along.setSpec('HRB400', 25).setCount(4);
    bar.col.cross.setSpec('HRB400', 25).setCount(4);
  }
  bar.col.stir.setSpec('HPB300', 8).setSpace(200, 100);
  bar.col.stirAlong.setSpec('HPB300', 8).setSpace(200, 100);
  bar.col.stirCross.setSpec('HPB300', 8).setSpace(200, 100);
  bar.col.tendonAlong.setSpec('HPB300', 8).setSpace(200, 100);
  bar.col.tendonCross.setSpec('HPB300', 8).setSpace(200, 100);

  bar.topBeam.bot.setSpec('HRB400', 20).setCount(4);
  bar.topBeam.top.setSpec('HRB400', 20).setCount(4);
  bar.topBeam.mid.setSpec('HRB400', 14).setCount(2);
  bar.topBeam.stir.setSpec('HPB300', 8).setSpace(125);
  bar.topBeam.tendon.setSpec('HPB300', 8).setSpace(250);
  bar.topBeam.haunch.setSpec('HRB400', 14).setCount(2);
  
  bar.beam.bot.setSpec('HRB400', 20).setCount(4);
  bar.beam.top.setSpec('HRB400', 20).setCount(4);
  bar.beam.mid.setSpec('HRB400', 14).setCount(2);
  bar.beam.stir.setSpec('HPB300', 8).setSpace(125);
  bar.beam.tendon.setSpec('HPB300', 8).setSpace(250);
  bar.beam.haunch.setSpec('HRB400', 14).setCount(2);

  bar.corbel.main.setSpec('HRB400', 20).setCount(4);
  bar.corbel.hStir.setSpec('HPB300', 8).setSpace(150);
  bar.corbel.vStir.setSpec('HPB300', 8).setSpace(200);

  return ctrl.generate();
}