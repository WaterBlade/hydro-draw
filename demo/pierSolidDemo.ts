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
    ...pier({height: 20500, id: 6}),
    ...pier({height: 37000, id: 7}),
    ...pier({height: 24500, id: 8}),
    ...pier({height: 12500, id: 9}),
    ...pier({height: 25500, id: 19}),
    ...pier({height: 30500, id: 20}),
    ...pier({height: 32500, id: 24}),
    ...pier({height: 17500, id: 25})
  );
  paper.push(layout.generate());

  fs.writeFile('demoPierSolid.dxf', paper.generate(), ()=>{
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
  draw.setSize('A2');
  draw.note = [
    '图中单位：尺寸为mm',
    '砼强度等级为C25，钢筋采用HRB400，保护层厚度为60mm，钢筋连接采用焊接，单面焊不小于10d，双面焊不小于5d'
  ];

  const pier = ctrl.struct;

  pier.h.val = height;
  pier.w.val = 1600;
  pier.l.val = 2400;
  pier.fr.val = 200;
  pier.topBeam.h.val = 1500;
  pier.topBeam.l.val = 3900;
  pier.topBeam.w.val = 3200;
  pier.found.h.val = 2000;
  pier.found.w.val = 4600;
  pier.found.l.val = 5400;

  const rebar = ctrl.rebar;
  
  rebar.lMain.set('HRB400', 25, 150);
  rebar.wMain.set('HRB400', 28, 150);
  rebar.stir.set('HPB300', 10, 150);

  rebar.info.as = 60;

  return ctrl.generate();
}