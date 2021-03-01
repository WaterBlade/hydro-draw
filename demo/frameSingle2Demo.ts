import { FrameSingleController2} from "@/struct";
import { HLayoutBuilder, DXFPaper, DrawItem } from "@/draw";
import fs from "fs";

export default function runFrameSingle2Demo(): void{
  const paper = new DXFPaper();
  const frameList = [
    frame(1, 7000),
    frame(2, 11000),
    frame(3, 14000),
    frame(4, 17000),
    frame(5, 16000),
    frame(10, 9500),
    frame(11, 4500),
    frame(12, 2000),
    frame(13, 2000),
    frame(14, 3000),
    frame(15, 4000),
    frame(17, 14500),
    frame(18, 16500),
    frame(26, 15000),
    frame(27, 7500)
  ];

  const layout = new HLayoutBuilder(5000);
  for(const f of frameList){
    layout.push(...genFrame(f));
  }
  paper.push(layout.generate());

  fs.writeFile('demoFrameSingle2.dxf', paper.generate(), ()=>{
    console.log('frame 2 demo finished');
  })
  
}

function frame(id: number, height: number){
  return {id, height};
}

function genFrame(frame: {id: number, height: number}): DrawItem[]{
  const {id, height} = frame;
  console.log(`handle ${id}# frame, height ${height}`);
  const ctrl = new FrameSingleController2();
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
  f.hs = 2800;
  f.vs = 4000;

  f.col.w = 500;
  f.col.h = 700;

  f.beam.w = 400;
  f.beam.h = 600;
  f.beam.ha = 250;

  f.topBeam.ws = 400;
  f.topBeam.wb = 700;
  f.topBeam.hd = 350;
  f.topBeam.hs = 400;
  f.topBeam.l = 4100;

  f.found.h = 1500;
  f.found.s = 150;

  const bar = ctrl.rebar;
  bar.info.as = 50;
  bar.col.corner.set('HRB400', 25);
  bar.col.along.set('HRB400', 22, 3);
  bar.col.cross.set('HRB400', 25, 3);
  bar.col.stir.set('HPB300', 8, 200, 100);

  bar.topBeam.bot.set('HRB400', 22, 4);
  bar.topBeam.top.set('HRB400', 20, 8);
  bar.topBeam.mid.set('HRB400', 12, 4);
  bar.topBeam.stir.set('HPB300', 8, 125);
  bar.topBeam.tendon.set('HPB300', 8, 400);
  
  bar.beam.bot.set('HRB400', 20, 4);
  bar.beam.top.set('HRB400', 20, 4);
  bar.beam.mid.set('HRB400', 12, 2);
  bar.beam.stir.set('HPB300', 8, 125);
  bar.beam.tendon.set('HPB300', 8, 400);
  bar.beam.haunch.set('HRB400', 16, 2);

  return ctrl.generate();
}