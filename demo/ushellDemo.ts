import { UShellController } from "@/struct";
import { CompositeItem, HLayoutBuilder, HydroA1Builder, Polyline, DXFPaper } from "@/draw";
import { LineType, polar, RotateDirection, Side, toDegree } from "@/draw/misc";
import fs from "fs";

export default function runUshellDemo(): void{
  // shellZuoSan();
  // shellXiaoOuJia();
  // shellHuangNiDong();
  shellYeGanTang();
}

function shellZuoSan(): void{
  const paper = new DXFPaper();
  const ctrl = new UShellController();
  const draw = ctrl.drawing;
  draw.company = '湖南省水利水电勘测设计研究总院';
  draw.project = '涔天河水库扩建工程';
  draw.design = '技施';
  draw.drawingTitle = "左三槽身钢筋图";
  draw.drawingNumberPrefix = "HND/s-4-渡槽-";
  draw.note = [
    '图中单位：尺寸为mm',
    '槽身钢筋保护层厚度为35mm，拉杆保护层厚度为25mm'
  ]
  
  // 渡槽槽身参数
  const u = ctrl.struct;
  // 长度
  u.len = 14960;
  u.cantLeft = 0;
  u.cantRight = 0;
  // 内径
  u.shell.r = 1850;
  // 直段高
  u.shell.hd = 1250;
  // 壁厚
  u.shell.t = 200;
  // 底板加厚
  u.shell.hb = 200;
  // 加厚宽
  u.shell.wb = 1600;
  // 外挑长
  u.oBeam.w = 500;
  // 外挑直高
  u.oBeam.hd = 300;
  // 外挑斜高
  u.oBeam.hs = 300;
  // 内挑长
  u.iBeam.w = 0;
  // 内挑直高
  u.iBeam.hd = 0;
  // 内挑斜高
  u.iBeam.hs = 0;
  // 止水槽
  u.waterStop.w = 130;
  u.waterStop.h = 50;
  // 端部
  u.endSect.b = 500;
  u.endSect.w = 500;
  u.endSect.hd = 2250;
  u.endSect.hs = 2050;
  u.lenTrans = 500;
  // 支座 
  u.support.w = 500;
  u.support.h = 200;
  // 拉杆
  u.bar.w = 200;
  u.bar.h = 150;
  u.spaceBar = 1500;

  // 钢筋
  const bar = ctrl.rebar;
  // 钢筋保护层厚度
  bar.as = 35;
  bar.asBar = 25;
  // 加密长度
  bar.denseL = 3740;
  // 槽壳钢筋
  // 主筋
  bar.shell.main.setSpec( 'HRB400', 28).setCount(8).setLayer(2);
  // 内侧纵向钢筋
  bar.shell.lInner.setSpec('HRB400', 12).setSpace(200);
  // 外侧纵向钢筋
  bar.shell.lOuter.setSpec('HRB400', 12).setSpace(200);
  // 内侧横向钢筋
  bar.shell.cInner.setSpec('HRB400', 12).setSpace(200, 100);
  bar.shell.cInnerSub.setSpec('HRB400', 12).setSpace(200, 100);
  // 外侧横向钢筋
  bar.shell.cOuter.setSpec('HRB400', 12).setSpace(200, 100);
  // 顶梁钢筋图
  bar.shell.topBeam.setSpec('HRB400', 12).setSpace(200, 100);

  // 端肋钢筋
  bar.end.cOuter.setSpec('HRB400', 20).setCount(5);
  bar.end.bBot.setSpec('HRB400', 25).setCount(5);
  bar.end.bTop.setSpec('HRB400', 25).setCount(5);
  bar.end.bMid.setSpec('HRB400', 12).setCount(3);
  bar.end.bStir.setSpec('HPB300', 10).setSpace(200);
  bar.end.bStirCant.setSpec('HPB300', 10).setSpace(200);
  bar.end.wStir.setSpec('HPB300', 10).setSpace(200);
  bar.end.wStirCant.setSpec('HPB300', 10).setSpace(200);
  bar.end.topBeam.setSpec('HRB400', 12);
  bar.end.topBeamCant.setSpec('HRB400', 12);

  // 渐变段钢筋
  bar.trans.direct.setSpec('HRB400', 12).setSpace(200);
  bar.trans.arc.setSpec('HRB400', 12).setSpace(200);

  // 拉杆钢筋
  bar.bar.main.setSpec('HRB400', 20);
  bar.bar.stir.setSpec('HPB300', 10).setSpace(200);


  const layout = new HLayoutBuilder(100);
  layout.push(...ctrl.generate());
  paper.push(layout.generate());

  fs.writeFile('左三槽身钢筋图.dxf', paper.generate(), ()=>{
    console.log('完成左三槽身钢筋图');
  })
}

function shellXiaoOuJia(): void{
  const paper = new DXFPaper();
  const ctrl = new UShellController();
  const draw = ctrl.drawing;
  draw.company = '湖南省水利水电勘测设计研究总院';
  draw.project = '涔天河水库扩建工程';
  draw.design = '技施';
  draw.drawingTitle = "西干小欧家槽身钢筋图";
  draw.drawingNumberPrefix = "HND/s-4-渡槽-";
  draw.note = [
    '图中单位：尺寸为mm',
    '槽身钢筋保护层厚度为35mm，拉杆保护层厚度为25mm'
  ]
  
  // 渡槽槽身参数
  const u = ctrl.struct;
  // 长度
  u.len = 14960;
  u.cantLeft = 0;
  u.cantRight = 0;
  // 内径
  u.shell.r = 1750;
  // 直段高
  u.shell.hd = 1300;
  // 壁厚
  u.shell.t = 180;
  // 底板加厚
  u.shell.hb = 180;
  // 加厚宽
  u.shell.wb = 960;
  // 外挑长
  u.oBeam.w = 400;
  // 外挑直高
  u.oBeam.hd = 300;
  // 外挑斜高
  u.oBeam.hs = 300;
  // 内挑长
  u.iBeam.w = 0;
  // 内挑直高
  u.iBeam.hd = 0;
  // 内挑斜高
  u.iBeam.hs = 0;
  // 止水槽
  u.waterStop.w = 130;
  u.waterStop.h = 50;
  // 端部
  u.endSect.b = 500;
  u.endSect.w = 580;
  u.endSect.hd = 2100;
  u.endSect.hs = 1900;
  u.lenTrans = 400;
  // 支座 
  u.support.w = 500;
  u.support.h = 100;
  // 拉杆
  u.bar.w = 200;
  u.bar.h = 150;
  u.spaceBar = 1500;

  // 钢筋
  const bar = ctrl.rebar;
  // 钢筋保护层厚度
  bar.as = 35;
  bar.asBar = 25;
  // 加密长度
  bar.denseL = 3740;
  // 槽壳钢筋
  // 主筋
  bar.shell.main.setSpec( 'HRB400', 28).setCount(8).setLayer(2);
  // 内侧纵向钢筋
  bar.shell.lInner.setSpec('HRB400', 12).setSpace(200);
  // 外侧纵向钢筋
  bar.shell.lOuter.setSpec('HRB400', 12).setSpace(200);
  // 内侧横向钢筋
  bar.shell.cInner.setSpec('HRB400', 12).setSpace(200, 100);
  bar.shell.cInnerSub.setSpec('HRB400', 12).setSpace(200, 100);
  // 外侧横向钢筋
  bar.shell.cOuter.setSpec('HRB400', 12).setSpace(200, 100);
  // 顶梁钢筋图
  bar.shell.topBeam.setSpec('HRB400', 12).setSpace(200, 100);

  // 端肋钢筋
  bar.end.cOuter.setSpec('HRB400', 20).setCount(5);
  bar.end.bBot.setSpec('HRB400', 25).setCount(5);
  bar.end.bTop.setSpec('HRB400', 25).setCount(5);
  bar.end.bMid.setSpec('HRB400', 12).setCount(3);
  bar.end.bStir.setSpec('HPB300', 10).setSpace(200);
  bar.end.bStirCant.setSpec('HPB300', 10).setSpace(200);
  bar.end.wStir.setSpec('HPB300', 10).setSpace(200);
  bar.end.wStirCant.setSpec('HPB300', 10).setSpace(200);
  bar.end.topBeam.setSpec('HRB400', 12);
  bar.end.topBeamCant.setSpec('HRB400', 12);

  // 渐变段钢筋
  bar.trans.direct.setSpec('HRB400', 12).setSpace(200);
  bar.trans.arc.setSpec('HRB400', 12).setSpace(200);

  // 拉杆钢筋
  bar.bar.main.setSpec('HRB400', 20);
  bar.bar.stir.setSpec('HPB300', 10).setSpace(300);


  const layout = new HLayoutBuilder(100);
  layout.push(...ctrl.generate());
  paper.push(layout.generate());

  fs.writeFile('小欧家槽身钢筋图.dxf', paper.generate(), ()=>{
    console.log('完成小欧家槽身钢筋图');
  })
}

function shellYuTouLing(): void{
  const paper = new DXFPaper();
  const ctrl = new UShellController();
  const draw = ctrl.drawing;
  draw.company = '湖南省水利水电勘测设计研究总院';
  draw.project = '涔天河水库扩建工程';
  draw.design = '技施';
  draw.drawingTitle = "西干玉头领槽身钢筋图";
  draw.drawingNumberPrefix = "HND/s-4-渡槽-";
  draw.note = [
    '图中单位：尺寸为mm',
    '槽身钢筋保护层厚度为35mm，拉杆保护层厚度为25mm'
  ]
  
  // 渡槽槽身参数
  const u = ctrl.struct;
  // 长度
  u.len = 14960;
  u.cantLeft = 0;
  u.cantRight = 0;
  // 内径
  u.shell.r = 1500;
  // 直段高
  u.shell.hd = 850;
  // 壁厚
  u.shell.t = 180;
  // 底板加厚
  u.shell.hb = 180;
  // 加厚宽
  u.shell.wb = 960;
  // 外挑长
  u.oBeam.w = 400;
  // 外挑直高
  u.oBeam.hd = 300;
  // 外挑斜高
  u.oBeam.hs = 300;
  // 内挑长
  u.iBeam.w = 0;
  // 内挑直高
  u.iBeam.hd = 0;
  // 内挑斜高
  u.iBeam.hs = 0;
  // 止水槽
  u.waterStop.w = 130;
  u.waterStop.h = 50;
  // 端部
  u.endSect.b = 500;
  u.endSect.w = 580;
  u.endSect.hd = 2100;
  u.endSect.hs = 1900;
  u.lenTrans = 400;
  // 支座 
  u.support.w = 500;
  u.support.h = 100;
  // 拉杆
  u.bar.w = 200;
  u.bar.h = 150;
  u.spaceBar = 1500;

  // 钢筋
  const bar = ctrl.rebar;
  // 钢筋保护层厚度
  bar.as = 35;
  bar.asBar = 25;
  // 加密长度
  bar.denseL = 3740;
  // 槽壳钢筋
  // 主筋
  bar.shell.main.setSpec( 'HRB400', 28).setCount(8).setLayer(2);
  // 内侧纵向钢筋
  bar.shell.lInner.setSpec('HRB400', 12).setSpace(200);
  // 外侧纵向钢筋
  bar.shell.lOuter.setSpec('HRB400', 12).setSpace(200);
  // 内侧横向钢筋
  bar.shell.cInner.setSpec('HRB400', 12).setSpace(200, 100);
  bar.shell.cInnerSub.setSpec('HRB400', 12).setSpace(200, 100);
  // 外侧横向钢筋
  bar.shell.cOuter.setSpec('HRB400', 12).setSpace(200, 100);
  // 顶梁钢筋图
  bar.shell.topBeam.setSpec('HRB400', 12).setSpace(200, 100);

  // 端肋钢筋
  bar.end.cOuter.setSpec('HRB400', 20).setCount(5);
  bar.end.bBot.setSpec('HRB400', 25).setCount(5);
  bar.end.bTop.setSpec('HRB400', 25).setCount(5);
  bar.end.bMid.setSpec('HRB400', 12).setCount(3);
  bar.end.bStir.setSpec('HPB300', 10).setSpace(200);
  bar.end.bStirCant.setSpec('HPB300', 10).setSpace(200);
  bar.end.wStir.setSpec('HPB300', 10).setSpace(200);
  bar.end.wStirCant.setSpec('HPB300', 10).setSpace(200);
  bar.end.topBeam.setSpec('HRB400', 12);
  bar.end.topBeamCant.setSpec('HRB400', 12);

  // 渐变段钢筋
  bar.trans.direct.setSpec('HRB400', 12).setSpace(200);
  bar.trans.arc.setSpec('HRB400', 12).setSpace(200);

  // 拉杆钢筋
  bar.bar.main.setSpec('HRB400', 20);
  bar.bar.stir.setSpec('HPB300', 10).setSpace(300);


  const layout = new HLayoutBuilder(100);
  layout.push(...ctrl.generate());
  paper.push(layout.generate());

  fs.writeFile('小欧家槽身钢筋图.dxf', paper.generate(), ()=>{
    console.log('完成小欧家槽身钢筋图');
  })
}

function shellHuangNiDong(): void{
  const paper = new DXFPaper();
  const ctrl = new UShellController();
  const draw = ctrl.drawing;
  draw.company = '湖南省水利水电勘测设计研究总院';
  draw.project = '涔天河水库扩建工程';
  draw.design = '技施';
  draw.drawingTitle = "西干黄泥洞槽身钢筋图";
  draw.drawingNumberPrefix = "HND/s-4-渡槽-";
  draw.note = [
    '图中单位：尺寸为mm',
    '槽身钢筋保护层厚度为35mm，拉杆保护层厚度为25mm'
  ]
  
  // 渡槽槽身参数
  const u = ctrl.struct;
  // 长度
  u.len = 14960;
  u.cantLeft = 0;
  u.cantRight = 0;
  // 内径
  u.shell.r = 1200;
  // 直段高
  u.shell.hd = 940;
  // 壁厚
  u.shell.t = 160;
  // 底板加厚
  u.shell.hb = 160;
  // 加厚宽
  u.shell.wb = 600;
  // 外挑长
  u.oBeam.w = 400;
  // 外挑直高
  u.oBeam.hd = 200;
  // 外挑斜高
  u.oBeam.hs = 150;
  // 内挑长
  u.iBeam.w = 0;
  // 内挑直高
  u.iBeam.hd = 0;
  // 内挑斜高
  u.iBeam.hs = 0;
  // 止水槽
  u.waterStop.w = 130;
  u.waterStop.h = 50;
  // 端部
  u.endSect.b = 500;
  u.endSect.w = 260;
  u.endSect.hd = 1400;
  u.endSect.hs = 1600;
  u.lenTrans = 400;
  // 支座 
  u.support.w = 500;
  u.support.h = 100;
  // 拉杆
  u.bar.w = 200;
  u.bar.h = 150;
  u.spaceBar = 1500;

  // 钢筋
  const bar = ctrl.rebar;
  // 钢筋保护层厚度
  bar.as = 35;
  bar.asBar = 25;
  // 加密长度
  bar.denseL = 3740;
  // 槽壳钢筋
  // 主筋
  bar.shell.main.setSpec( 'HRB400', 25).setCount(6).setLayer(2);
  // 内侧纵向钢筋
  bar.shell.lInner.setSpec('HRB400', 12).setSpace(200);
  // 外侧纵向钢筋
  bar.shell.lOuter.setSpec('HRB400', 12).setSpace(200);
  // 内侧横向钢筋
  bar.shell.cInner.setSpec('HRB400', 12).setSpace(200, 100);
  bar.shell.cInnerSub.setSpec('HRB400', 12).setSpace(200, 100);
  // 外侧横向钢筋
  bar.shell.cOuter.setSpec('HRB400', 12).setSpace(200, 100);
  // 顶梁钢筋图
  bar.shell.topBeam.setSpec('HRB400', 12).setSpace(200, 100);

  // 端肋钢筋
  bar.end.cOuter.setSpec('HRB400', 20).setCount(5);
  bar.end.bBot.setSpec('HRB400', 22).setCount(5);
  bar.end.bTop.setSpec('HRB400', 22).setCount(5);
  bar.end.bMid.setSpec('HRB400', 12).setCount(3);
  bar.end.bStir.setSpec('HPB300', 10).setSpace(200);
  bar.end.bStirCant.setSpec('HPB300', 10).setSpace(200);
  bar.end.wStir.setSpec('HPB300', 10).setSpace(200);
  bar.end.wStirCant.setSpec('HPB300', 10).setSpace(200);
  bar.end.topBeam.setSpec('HRB400', 12);
  bar.end.topBeamCant.setSpec('HRB400', 12);

  // 渐变段钢筋
  bar.trans.direct.setSpec('HRB400', 12).setSpace(200);
  bar.trans.arc.setSpec('HRB400', 12).setSpace(200);

  // 拉杆钢筋
  bar.bar.main.setSpec('HRB400', 16);
  bar.bar.stir.setSpec('HPB300', 10).setSpace(300);


  const layout = new HLayoutBuilder(100);
  layout.push(...ctrl.generate());
  paper.push(layout.generate());

  fs.writeFile('黄泥洞渡槽钢筋图.dxf', paper.generate(), ()=>{
    console.log('完成黄泥洞渡槽钢筋图');
  })
  

}

function shellYeGanTang(): void{
  const paper = new DXFPaper();
  const ctrl = new UShellController();
  const draw = ctrl.drawing;
  draw.company = '湖南省水利水电勘测设计研究总院';
  draw.project = '涔天河水库扩建工程';
  draw.design = '技施';
  draw.drawingTitle = "西干夜干塘槽身钢筋图";
  draw.drawingNumberPrefix = "HND/s-4-渡槽-";
  draw.note = [
    '图中单位：尺寸为mm',
    '槽身钢筋保护层厚度为35mm，拉杆保护层厚度为25mm'
  ]
  
  // 渡槽槽身参数
  const u = ctrl.struct;
  // 长度
  u.len = 15460;
  u.cantLeft = 0;
  u.cantRight = 0;
  // 内径
  u.shell.r = 1200;
  // 直段高
  u.shell.hd = 940;
  // 壁厚
  u.shell.t = 160;
  // 底板加厚
  u.shell.hb = 160;
  // 加厚宽
  u.shell.wb = 600;
  // 外挑长
  u.oBeam.w = 400;
  // 外挑直高
  u.oBeam.hd = 200;
  // 外挑斜高
  u.oBeam.hs = 150;
  // 内挑长
  u.iBeam.w = 0;
  // 内挑直高
  u.iBeam.hd = 0;
  // 内挑斜高
  u.iBeam.hs = 0;
  // 止水槽
  u.waterStop.w = 130;
  u.waterStop.h = 50;
  // 端部
  u.endSect.b = 500;
  u.endSect.w = 260;
  u.endSect.hd = 1400;
  u.endSect.hs = 1600;
  u.lenTrans = 400;
  // 支座 
  u.support.w = 500;
  u.support.h = 100;
  // 拉杆
  u.bar.w = 200;
  u.bar.h = 150;
  u.spaceBar = 1500;

  // 钢筋
  const bar = ctrl.rebar;
  // 钢筋保护层厚度
  bar.as = 35;
  bar.asBar = 25;
  // 加密长度
  bar.denseL = 3740;
  // 槽壳钢筋
  // 主筋
  bar.shell.main.setSpec( 'HRB400', 25).setCount(6).setLayer(2);
  // 内侧纵向钢筋
  bar.shell.lInner.setSpec('HRB400', 12).setSpace(200);
  // 外侧纵向钢筋
  bar.shell.lOuter.setSpec('HRB400', 12).setSpace(200);
  // 内侧横向钢筋
  bar.shell.cInner.setSpec('HRB400', 12).setSpace(200, 100);
  bar.shell.cInnerSub.setSpec('HRB400', 12).setSpace(200, 100);
  // 外侧横向钢筋
  bar.shell.cOuter.setSpec('HRB400', 12).setSpace(200, 100);
  // 顶梁钢筋图
  bar.shell.topBeam.setSpec('HRB400', 12).setSpace(200, 100);

  // 端肋钢筋
  bar.end.cOuter.setSpec('HRB400', 20).setCount(5);
  bar.end.bBot.setSpec('HRB400', 22).setCount(5);
  bar.end.bTop.setSpec('HRB400', 22).setCount(5);
  bar.end.bMid.setSpec('HRB400', 12).setCount(3);
  bar.end.bStir.setSpec('HPB300', 10).setSpace(200);
  bar.end.bStirCant.setSpec('HPB300', 10).setSpace(200);
  bar.end.wStir.setSpec('HPB300', 10).setSpace(200);
  bar.end.wStirCant.setSpec('HPB300', 10).setSpace(200);
  bar.end.topBeam.setSpec('HRB400', 12);
  bar.end.topBeamCant.setSpec('HRB400', 12);

  // 渐变段钢筋
  bar.trans.direct.setSpec('HRB400', 12).setSpace(200);
  bar.trans.arc.setSpec('HRB400', 12).setSpace(200);

  // 拉杆钢筋
  bar.bar.main.setSpec('HRB400', 16);
  bar.bar.stir.setSpec('HPB300', 10).setSpace(300);


  const layout = new HLayoutBuilder(100);
  layout.push(...ctrl.generate());
  paper.push(layout.generate());

  fs.writeFile('夜干塘渡槽钢筋图.dxf', paper.generate(), ()=>{
    console.log('完成夜干塘渡槽钢筋图');
  })
  

}