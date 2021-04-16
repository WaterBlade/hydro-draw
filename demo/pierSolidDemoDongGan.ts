import { PierSolidController} from "@/struct";
import { HLayoutBuilder, DXFPaper, DrawItem } from "@/draw";
import fs from "fs";

export default function runPierSolidDemoDongGan(): void{
  const note = [
    '图中单位：尺寸为mm',
    '砼强度等级为C25，钢筋采用HRB400，保护层厚度为60mm，钢筋连接采用焊接，单面焊不小于10d，双面焊不小于5d'
  ];
  const paper = new DXFPaper();
  const layout = new HLayoutBuilder(2000);
  for(let i = 11; i <= 30; i++){
    layout.push(...pier(i*1000));

  }
  paper.push(layout.generate());

  fs.writeFile('东干渡槽实心墩标准钢筋图.dxf', paper.generate(), ()=>{
    console.log('东干渡槽实心墩标准钢筋图');
  })
  
}

function pier(height: number): DrawItem[]{

  const ctrl = new PierSolidController();

  const draw = ctrl.drawing;
  draw.company = '湖南省水利水电勘测设计研究总院';
  draw.project = '涔天河水库扩建工程';
  draw.design = '技施';
  draw.drawingTitle = `H=${height}#实心墩钢筋图`;
  draw.drawingNumberPrefix = "HND/s-4-东干-渡槽-";
  draw.size = 'A1';
  draw.note = [
    '图中单位：尺寸为mm',
    '砼强度等级为C25，钢筋采用HRB400，保护层厚度为60mm，钢筋连接采用焊接，单面焊不小于10d，双面焊不小于5d'
  ];

  const pier = ctrl.struct;

  pier.h = height;
  pier.w = 1600;
  pier.l = 2400;
  pier.fr = 200;
  pier.topBeam.h = 1500;
  pier.topBeam.l = 4100;
  pier.topBeam.w = 3200;
  pier.found.h = 1500;
  pier.found.w = 4600;
  pier.found.l = 5200;

  const rebar = ctrl.rebar;

  if(height > 20000){
    rebar.lMain.setSpec('HRB400', 28).setSpace(150);
    rebar.wMain.setSpec('HRB400', 28).setSpace(150).setMultiple(2);
    rebar.stir.setSpec('HPB300', 12).setSpace(150, 100);
    rebar.lStir.setSpec('HPB300', 12).setSpace(150, 100);
    rebar.wStir.setSpec('HPB300', 12).setSpace(150, 100);
    pier.hTopDense = 5000;
    pier.hBotDense = 10000;
  }else{
    rebar.lMain.setSpec('HRB400', 28).setSpace(150);
    rebar.wMain.setSpec('HRB400', 25).setSpace(150).setMultiple(2);
    rebar.stir.setSpec('HPB300', 12).setSpace(150, 100);
    rebar.lStir.setSpec('HPB300', 12).setSpace(150, 100);
    rebar.wStir.setSpec('HPB300', 12).setSpace(150, 100);
    pier.hTopDense = 4000;
    pier.hBotDense = 7000;
  }
  

  rebar.as = 60;

  return ctrl.generate(height);
}