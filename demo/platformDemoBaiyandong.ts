import { PlatformController } from "@/struct";
import { HLayoutBuilder, DXFPaper, DrawItem } from "@/draw";
import fs from "fs";

export default function runPlatformDemoBaiyandong(): void{
  const note = [
    '图中单位：尺寸为mm',
    '砼强度等级为C25，钢筋采用HRB400，保护层厚度为60mm，钢筋连接采用焊接，单面焊不小于10d，双面焊不小于5d'
  ];
  const paper = new DXFPaper();
  const layout = new HLayoutBuilder(2000);
  layout.push(
    ...Baiyandong(note),
  );
  paper.push(layout.generate());

  fs.writeFile('白眼洞渡槽承台钢筋图.dxf', paper.generate(), ()=>{
    console.log('platform demo finished');
  })
  
}

function Baiyandong(note: string[]): DrawItem[]{
  const ctrl = new PlatformController();

  const draw = ctrl.drawing;
  draw.company = '湖南省水利水电勘测设计研究总院';
  draw.project = '涔天河水库扩建工程';
  draw.design = '技施';
  draw.drawingTitle = "单排架承台钢筋图";
  draw.drawingNumberPrefix = "HND/s-4-左二-渡槽-白眼洞";
  draw.size = 'A2';
  draw.note = [...note ];

  const plat = ctrl.struct;
  plat.d = 800;
  plat.h = 1000;
  plat.l = 4600;
  plat.w = 1600;
  plat.nl = 2;
  plat.sl = 3000;
  plat.nw = 1;
  plat.sw = 0;
  plat.hs = 150;

  const bar = ctrl.rebar;
  bar.lMain.setSpec('HRB400', 25).setSpace(200);
  bar.wMain.setSpec('HRB400', 25).setSpace(200);
  bar.lTop.setSpec('HRB400', 14).setSpace(200);
  bar.lBot.setSpec('HRB400', 14).setSpace(200);
  bar.wTop.setSpec('HRB400', 14).setSpace(200);
  bar.wBot.setSpec('HRB400', 14).setSpace(200);
  bar.round.setSpec('HRB400', 14).setSpace(200);
  bar.as = 60;

  return ctrl.generate();
}
