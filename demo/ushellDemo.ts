import { UShellController } from "@/struct";
import { CompositeItem, HLayoutBuilder, HydroA1Builder, Polyline, ScriptPaper } from "@/draw";
import { LineType, polar, RotateDirection, Side, toDegree } from "@/draw/misc";
import fs from "fs";

export default function runUshellDemo(): void{
  const paper = new ScriptPaper();
  const ctrl = new UShellController();
  const draw = ctrl.drawing;
  draw.company = '湖南省水利水电勘测设计研究总院';
  draw.project = '涔天河水库扩建工程';
  draw.design = '技施';
  draw.drawingTitle = "槽身钢筋图";
  draw.drawingNumberPrefix = "HND/s-4-渡槽-";
  draw.note = [
    '图中单位：尺寸为mm',
    '槽身钢筋保护层厚度为35mm，拉杆保护层厚度为25mm'
  ]
  
  // 渡槽槽身参数
  const u = ctrl.struct;
  // 长度
  u.len = 14960;
  // 加密长度
  u.denseL = 3740;
  // 内径
  u.r = 2300;
  // 直段高
  u.hd = 1500;
  // 壁厚
  u.t = 220;
  // 钢筋保护层厚度
  u.as = 35;
  // 底板加厚
  u.butt.h = 130;
  // 加厚宽
  u.butt.w = 800;
  // 外挑长
  u.oBeam.w = 500;
  // 外挑直高
  u.oBeam.hd = 200;
  // 外挑斜高
  u.oBeam.hs = 200;
  // 内挑长
  u.iBeam.w = 500;
  // 内挑直高
  u.iBeam.hd = 200;
  // 内挑斜高
  u.iBeam.hs = 200;
  // 止水槽
  u.waterStop.w = 130;
  u.waterStop.h = 50;
  // 端部
  u.endSect.b = 560;
  u.endSect.w = 770;
  u.endSect.hd = 2600;
  u.endSect.hs = 2300;
  u.trans = 500;
  // 支座 
  u.support.w = 500;
  u.support.h = 100;
  // 拉杆
  u.bar.w = 200;
  u.bar.h = 200;
  u.bar.s = 1500;
  u.bar.as = 25;

  // 钢筋
  const bar = ctrl.rebar;
  // 槽壳钢筋
  // 主筋
  bar.shell.main.set( 'HRB400', 28, 9, 2, 50);
  // 内侧纵向钢筋
  bar.shell.lInner.set('HRB400', 12, 200);
  // 外侧纵向钢筋
  bar.shell.lOuter.set('HRB400', 12, 200);
  // 内侧横向钢筋
  bar.shell.cInner.set('HRB400', 16, 200);
  // 外侧横向钢筋
  bar.shell.cOuter.set('HRB400', 16, 200);
  // 顶梁钢筋图
  bar.shell.topBeam.set('HRB400', 16, 200);

  // 端肋钢筋
  bar.end.cOuter.set('HRB400', 20, 5, 2);
  bar.end.bBot.set('HRB400', 28, 5, 2);
  bar.end.bTop.set('HRB400', 20, 5, 2);
  bar.end.bMid.set('HRB400', 12, 3, 4);
  bar.end.bStir.set('HPB300', 10, 200);
  bar.end.wStir.set('HPB300', 10, 200);

  // 渐变段钢筋
  bar.trans.direct.set('HRB400', 16, 200);
  bar.trans.arc.set('HRB400', 16, 200);

  // 拉杆钢筋
  bar.bar.main.set('HRB400', 16, 4);
  bar.bar.stir.set('HPB300', 10, 300);


  const layout = new HLayoutBuilder(10);
  layout.push(...ctrl.generate());
  paper.push(layout.generate());

  fs.writeFile('demoUshell.txt', paper.pack(), ()=>{
    console.log('ushell demo finished');
  })
  
}