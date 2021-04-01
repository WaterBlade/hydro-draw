import { FrameSingleControllerTop} from "@/struct";
import { HLayoutBuilder, DXFPaper, DrawItem } from "@/draw";
import fs from "fs";

export default function runFrameSingleTopDemo2(): void{
  const paper = new DXFPaper();
  const frameList2 = [
    frame(4, 5000),
    frame(5, 6000),
    frame(6, 7000),
    frame(7, 8000),
    frame(8, 9000),
    frame(9, 10000),
    frame(10, 11000),
    frame(11, 12000),
    frame(12, 13000),
    frame(13, 14000),
    frame(14, 15000),
    frame(15, 16000),
  ];

  const layout = new HLayoutBuilder(5000);
  for(const f of frameList2){
    layout.push(...genFrame(f));
  }
  paper.push(layout.generate());

  fs.writeFile('左三凤形岭渡槽单排架钢筋图.dxf', paper.generate(), ()=>{
    console.log('frame top demo finished');
  })
  
}

function frame(id: number, height: number){
  return {id, height};
}

function genFrame(frame: {id: number, height: number}): DrawItem[]{
  const {id, height} = frame;
  const ctrl = new FrameSingleControllerTop();
  const draw = ctrl.drawing;
  draw.company = '湖南省水利水电勘测设计研究总院';
  draw.project = '涔天河水库扩建工程';
  draw.design = '技施';
  draw.drawingTitle = `${id}#单排架钢筋图`;
  draw.drawingNumberPrefix = "HND/s-4-渡槽-";
  draw.note = [
    '图中单位：尺寸为mm',
  ]

  const f = ctrl.struct;
  f.h = height;
  f.hs = 3900;
  f.vs = 4000;

  f.col.w = 500;
  f.col.h = 800;

  f.beam.w = 400;
  f.beam.h = 600;
  f.beam.ha = 250;

  f.topBeam.ws = 400;
  f.topBeam.wb = 800;
  f.topBeam.hd = 350;
  f.topBeam.hs = 400;
  f.topBeam.l = 5000;

  f.found.h = 1500;
  f.found.s = 150;

  const bar = ctrl.rebar;
  bar.as = 50;
  if(height <= 12000){
    bar.col.corner.setSpec('HRB400', 25);
    bar.col.along.setSpec('HRB400', 20).setCount(4);
    bar.col.cross.setSpec('HRB400', 22).setCount(4);
  }else{
    bar.col.corner.setSpec('HRB400', 28);
    bar.col.along.setSpec('HRB400', 22).setCount(4);
    bar.col.cross.setSpec('HRB400', 25).setCount(4);
  }

  bar.col.stir.setSpec('HPB300', 8).setSpace(200, 100);
  bar.col.stirAlong.setSpec('HPB300', 8).setSpace(200, 100);
  bar.col.stirCross.setSpec('HPB300', 8).setSpace(200, 100);
  bar.col.tendonAlong.setSpec('HPB300', 8).setSpace(200, 100);
  bar.col.tendonCross.setSpec('HPB300', 8).setSpace(200, 100);

  bar.topBeam.bot.setSpec('HRB400', 22).setCount(4);
  bar.topBeam.top.setSpec('HRB400', 20).setCount(8);
  bar.topBeam.mid.setSpec('HRB400', 12).setCount(4);
  bar.topBeam.stir.setSpec('HPB300', 8).setSpace(125);
  bar.topBeam.stirInner.setSpec('HPB300', 8).setSpace(125);
  bar.topBeam.tendon.setSpec('HPB300', 8).setSpace(250);
  
  bar.beam.bot.setSpec('HRB400', 20).setCount(4);
  bar.beam.top.setSpec('HRB400', 20).setCount(4);
  bar.beam.mid.setSpec('HRB400', 12).setCount(2);
  bar.beam.stir.setSpec('HPB300', 8).setSpace(125);
  bar.beam.tendon.setSpec('HPB300', 8).setSpace(250);
  bar.beam.haunch.setSpec('HRB400', 16).setCount(2);

  return ctrl.generate();
}