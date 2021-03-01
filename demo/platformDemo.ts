import { PlatformController } from "@/struct";
import { HLayoutBuilder, DXFPaper, DrawItem } from "@/draw";
import fs from "fs";

export default function runPlatformDemo(): void{
  const note = [
    '图中单位：尺寸为mm',
    '砼强度等级为C25，钢筋采用HRB400，保护层厚度为60mm，钢筋连接采用焊接，单面焊不小于10d，双面焊不小于5d'
  ];
  const paper = new DXFPaper();
  const layout = new HLayoutBuilder(2000);
  layout.push(
    ...XiGanNongShiDanPaiJia(note),
    ...XiGanNongShiShiXinDun(note)
  );
  paper.push(layout.generate());

  fs.writeFile('demoPlatform.dxf', paper.generate(), ()=>{
    console.log('platform demo finished');
  })
  
}

function XiGanNongShiDanPaiJia(note: string[]): DrawItem[]{
  const ctrl = new PlatformController();

  const draw = ctrl.drawing;
  draw.company = '湖南省水利水电勘测设计研究总院';
  draw.project = '涔天河水库扩建工程';
  draw.design = '技施';
  draw.drawingTitle = "单排架承台钢筋图";
  draw.drawingNumberPrefix = "HND/s-4-西干-渡槽-弄石";
  draw.setSize('A2');
  draw.note = [...note ];

  const plat = ctrl.struct;
  plat.d = 1200;
  plat.h = 1500;
  plat.l = 5000;
  plat.w = 2200;
  plat.nl = 2;
  plat.sl = 2800;
  plat.nw = 1;
  plat.sw = 0;
  plat.hs = 150;

  const bar = ctrl.rebar;
  bar.lMain.set('HRB400', 25, 200);
  bar.wMain.set('HRB400', 25, 200);
  bar.dist.set('HRB400', 14, 200);
  bar.info.as = 60;

  return ctrl.generate();
}

function XiGanNongShiShiXinDun(note: string[]): DrawItem[]{
  const ctrl = new PlatformController();

  const draw = ctrl.drawing;
  draw.company = '湖南省水利水电勘测设计研究总院';
  draw.project = '涔天河水库扩建工程';
  draw.design = '技施';
  draw.drawingTitle = "实心墩承台钢筋图";
  draw.drawingNumberPrefix = "HND/s-4-西干-渡槽-弄石-";
  draw.setSize('A2');
  draw.note = [...note ];

  const plat = ctrl.struct;
  plat.d = 1200;
  plat.h = 1800;
  plat.l = 5200;
  plat.w = 4600;
  plat.nl = 2;
  plat.sl = 3000;
  plat.nw = 2;
  plat.sw = 2400;
  plat.hs = 150;

  const bar = ctrl.rebar;
  bar.lMain.set('HRB400', 25, 200, 100, 2);
  bar.wMain.set('HRB400', 25, 200, 100, 2);
  bar.dist.set('HRB400', 14, 200);
  bar.info.as = 60;

  return ctrl.generate();
}