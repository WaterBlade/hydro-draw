import { FoundController } from "@/struct";
import { HLayoutBuilder, DXFPaper, DrawItem } from "@/draw";
import fs from "fs";

export default function runFoundDemo(): void{
  const note = [
    '图中单位：尺寸为mm',
    '砼强度等级为C25，钢筋采用HRB400，保护层厚度为60mm，钢筋连接采用焊接，单面焊不小于10d，双面焊不小于5d'
  ];
  const paper = new DXFPaper();
  const layout = new HLayoutBuilder(2000);
  layout.push(
    // ...Baiyandong(note),
    // ...FengxinglingFrame(note),
    ...FengxinglingPier(note)
  );
  paper.push(layout.generate());

  fs.writeFile('凤形岭扩展基础钢筋图.dxf', paper.generate(), ()=>{
    console.log('扩展基础钢筋图完成');
  })
  
}

function Baiyandong(note: string[]): DrawItem[]{
  const ctrl = new FoundController();

  const draw = ctrl.drawing;
  draw.company = '湖南省水利水电勘测设计研究总院';
  draw.project = '涔天河水库扩建工程';
  draw.design = '技施';
  draw.drawingTitle = "白眼洞扩展基础钢筋图";
  draw.drawingNumberPrefix = "HND/s-4-左二-渡槽-白眼洞";
  draw.size = 'A2';
  draw.note = [...note ];

  const found = ctrl.struct;
  found.lTop = 4500;
  found.wTop = 1800;
  found.hTop = 500;
  found.lBot = 5700;
  found.wBot = 3000;
  found.hBot = 500;

  const bar = ctrl.rebar;
  bar.lTop.setSpec('HRB400', 25).setSpace(200);
  bar.lBot.setSpec('HRB400', 25).setSpace(200);
  bar.wTop.setSpec('HRB400', 25).setSpace(200);
  bar.wBot.setSpec('HRB400', 25).setSpace(200);
  bar.as = 60;

  return ctrl.generate();
}

function FengxinglingFrame(note: string[]): DrawItem[]{
  const ctrl = new FoundController();

  const draw = ctrl.drawing;
  draw.company = '湖南省水利水电勘测设计研究总院';
  draw.project = '涔天河水库扩建工程';
  draw.design = '技施';
  draw.drawingTitle = "凤形岭单排架扩展基础钢筋图";
  draw.drawingNumberPrefix = "HND/s-4-左三-渡槽-凤形岭";
  draw.size = 'A2';
  draw.note = [...note ];

  const found = ctrl.struct;
  found.lTop = 5500;
  found.wTop = 1800;
  found.hTop = 750;
  found.lBot = 6500;
  found.wBot = 3000;
  found.hBot = 750;

  const bar = ctrl.rebar;
  bar.lTop.setSpec('HRB400', 25).setSpace(200);
  bar.lBot.setSpec('HRB400', 25).setSpace(200);
  bar.wTop.setSpec('HRB400', 25).setSpace(200);
  bar.wBot.setSpec('HRB400', 25).setSpace(200);
  bar.as = 60;

  return ctrl.generate();
}

function FengxinglingPier(note: string[]): DrawItem[]{
  const ctrl = new FoundController();

  const draw = ctrl.drawing;
  draw.company = '湖南省水利水电勘测设计研究总院';
  draw.project = '涔天河水库扩建工程';
  draw.design = '技施';
  draw.drawingTitle = "凤形岭空心墩扩展基础钢筋图";
  draw.drawingNumberPrefix = "HND/s-4-左三-渡槽-凤形岭";
  draw.size = 'A2';
  draw.note = [...note ];

  const found = ctrl.struct;
  found.lTop = 5300;
  found.wTop = 3500;
  found.hTop = 600;
  found.lBot = 9300;
  found.wBot = 7500;
  found.hBot = 2400;

  const bar = ctrl.rebar;
  bar.lTop.setSpec('HRB400', 25).setSpace(200);
  bar.lBot.setSpec('HRB400', 28).setSpace(200);
  bar.wTop.setSpec('HRB400', 25).setSpace(200);
  bar.wBot.setSpec('HRB400', 28).setSpace(200);
  bar.as = 60;

  return ctrl.generate();
}