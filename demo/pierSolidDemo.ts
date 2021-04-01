import { PierSolidController} from "@/struct";
import { HLayoutBuilder, DXFPaper, DrawItem } from "@/draw";
import fs from "fs";

export default function runPierSolidDemo(): void{
  const note = [
    '图中单位：尺寸为mm',
    '砼强度等级为C25，钢筋采用HRB400，保护层厚度为60mm，钢筋连接采用焊接，单面焊不小于10d，双面焊不小于5d'
  ];
  const paper = new DXFPaper();
  const layout = new HLayoutBuilder(2000);
  layout.push(
    ...pier({height: 22000, id: 6}),
    ...pier({height: 38500, id: 7}),
    ...pier({height: 26000, id: 8}),
    ...pier({height: 14000, id: 9}),
    ...pier({height: 27000, id: 19}),
    ...pier({height: 32000, id: 20}),
    ...pier({height: 34000, id: 24}),
    ...pier({height: 19000, id: 25})
  );
  paper.push(layout.generate());

  fs.writeFile('西干弄石渡槽实心墩钢筋图.dxf', paper.generate(), ()=>{
    console.log('pier solid demo finished');
  })
  
}

function pier(config: {height: number, id: number}): DrawItem[]{
  const { height, id} = config;

  const ctrl = new PierSolidController();

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
  pier.w = 1600;
  pier.l = 2800;
  pier.fr = 200;
  pier.topBeam.h = 1500;
  pier.topBeam.l = 3900;
  pier.topBeam.w = 3200;
  pier.found.h = 1800;
  pier.found.w = 4600;
  pier.found.l = 5200;

  const rebar = ctrl.rebar;

  if(height > 30000){
    rebar.lMain.setSpec('HRB400', 28).setSpace(120).setMultiple(2);
    rebar.wMain.setSpec('HRB400', 28).setSpace(100).setMultiple(2);
    rebar.stir.setSpec('HPB300', 10).setSpace(200, 100);
    rebar.lStir.setSpec('HPB300', 10).setSpace(200, 100);
    rebar.wStir.setSpec('HPB300', 10).setSpace(200, 100);
  }else{
    rebar.lMain.setSpec('HRB400', 28).setSpace(150).setMultiple(2);
    rebar.wMain.setSpec('HRB400', 28).setSpace(150).setMultiple(2);
    rebar.stir.setSpec('HPB300', 10).setSpace(200, 100);
    rebar.lStir.setSpec('HPB300', 10).setSpace(200, 100);
    rebar.wStir.setSpec('HPB300', 10).setSpace(200, 100);
  }
  

  rebar.as = 60;

  return ctrl.generate();
}