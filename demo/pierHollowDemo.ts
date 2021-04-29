import { PierHollowController} from "@/struct";
import { HLayoutBuilder, DXFPaper, DrawItem } from "@/draw";
import fs from "fs";

export default function runPierHollowDemo(): void{
  const note = [
    '图中单位：尺寸为mm',
    '砼强度等级为C25，钢筋采用HRB400，保护层厚度为60mm，钢筋连接采用焊接，单面焊不小于10d，双面焊不小于5d'
  ];
  const paper = new DXFPaper();
  const layout = new HLayoutBuilder(2000);
  layout.push(
    ...pier({height: 40000, id: 21}),
    ...pier({height: 58000, id: 22}),
    ...pier({height: 54000, id: 23}),
  );
  paper.push(layout.generate());

  fs.writeFile('西干弄石渡槽空心墩钢筋图.dxf', paper.generate(), ()=>{
    console.log('空心墩钢筋图完成');
  })
  
}

function pier(config: {height: number, id: number}): DrawItem[]{
  const { height, id} = config;

  const ctrl = new PierHollowController();

  const draw = ctrl.drawing;
  draw.company = '湖南省水利水电勘测设计研究总院';
  draw.project = '涔天河水库扩建工程';
  draw.design = '技施';
  draw.drawingTitle = `${id}#实心墩钢筋图`;
  draw.drawingNumberPrefix = "HND/s-4-西干-渡槽-弄石";
  draw.size = 'A1';
  draw.note = [
    '图中单位：尺寸为mm',
    '砼强度等级为C25，钢筋采用HRB400，保护层厚度为60mm，钢筋连接采用焊接，单面焊不小于10d，双面焊不小于5d'
  ];

  const pier = ctrl.struct;

  pier.h = height - 1500;
  pier.w = 2500;
  pier.l = 4500;
  pier.fr = 200;
  pier.t = 500;
  pier.sectHa = 400;
  pier.topBotHa = 1500;
  pier.vSpace = 9500;
  pier.hTopSolid = 2000;
  pier.hBotSolid = 2000;
  pier.topBeam.h = 1500;
  pier.topBeam.l = 3900;
  pier.topBeam.w = 3200;
  pier.found.h = 2500;
  pier.found.w = 4600;
  pier.found.l = 5200;
  pier.plate.t = 500;
  pier.plate.lHole = 1400;
  pier.plate.wHole = 700;
  pier.plate.vHa = 400;

  const rebar = ctrl.rebar;

  rebar.lMain.setSpec('HRB400', 28).setMultiple(2).setSpace(100);
  rebar.wMain.setSpec('HRB400', 28).setMultiple(2).setSpace(100);
  rebar.inner.setSpec('HRB400', 25).setSpace(100);
  rebar.stir.setSpec('HPB300', 12).setSpace(100);
  rebar.lStir.setSpec('HPB300', 12).setSpace(200, 100);
  rebar.wStir.setSpec('HPB300', 12).setSpace(200, 100);
  rebar.sectHa.setSpec('HPB300', 12).setSpace(200);
  rebar.vHa.setSpec('HRB400', 16).setSpace(200);
  rebar.plateLHa.setSpec('HRB400', 16).setSpace(150);
  rebar.plateWHa.setSpec('HRB400', 16).setSpace(150);
  rebar.plateLMain.setSpec('HRB400', 20).setSpace(150);
  rebar.plateWMain.setSpec('HRB400', 20).setSpace(150);
  rebar.plateLDist.setSpec('HRB400', 14).setSpace(150);
  rebar.plateWDist.setSpec('HRB400', 14).setSpace(150);
  rebar.lNet.setSpec('HRB400', 16).setSpace(200);
  rebar.wNet.setSpec('HRB400', 16).setSpace(200);

  

  rebar.as = 60;

  return ctrl.generate();
}