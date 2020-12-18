import { CompositeItem, HLayoutBuilder, HydroA1Builder, Polyline, ScriptPaper } from "@/draw";
import { LineType, polar, RotateDirection, Side, toDegree } from "@/draw/misc";
import fs from "fs";

export default function runUshellDemo(): void{
  const paper = new ScriptPaper();
  const border = new HydroA1Builder();
  border.company = '湖南省水利水电勘测设计研究总院';
  border.project = '涔天河水库扩建工程';
  border.design = '技施'
  border.section = '水工'
  border.date = '2020.12';

  border.note = [
    '1.图中单位：尺寸为mm',
  ]
  
  // 渡槽槽身参数
  // 内径
  const r0 = 2300;
  // 直段高
  const f = 1500;
  // 壁厚
  const t = 220;
  // 底板加厚
  const t0 = 130;
  // 加厚宽
  const d0 = 800;
  // 外挑长
  const a1 = 500;
  // 外挑直高
  const b1 = 200;
  // 外挑斜高
  const c1 = 200;
  // 内挑长
  const a0 = 500;
  // 内挑直高
  const b0 = 200;
  // 内挑斜高
  const c0 = 200;

  // 钢筋保护层厚度
  const as = 35;

  // 外弧转角
  const angle0 = Math.atan(0.5*d0/(r0+t0+t));
  const l0 = Math.sqrt(0.25*d0**2 + (r0+t+t0)**2);
  const angle1 = Math.acos((r0+t)/l0);
  const angle = toDegree(Math.PI / 2 - angle0 - angle1);
  // 外弧转折点
  const transPt0 = polar(r0+t, angle + 180);
  const transPt1 = polar(r0+t, -angle);

  // 跨中断面轮廓
  const mid = new CompositeItem();
  const pl = new Polyline(-r0+a0, f)
    .lineBy(-(a0+t+a1), 0)
    .lineBy(0, -b1)
    .lineBy(a1, -c1)
    .lineBy(0, -(f-b1-c1))
    .arcTo(transPt0.x, transPt0.y, angle)
    .lineTo(-d0/2, -(r0+t+t0))
    .lineBy(d0, 0)
    .lineTo(transPt1.x, transPt1.y)
    .arcTo(r0+t, 0, angle)
    .lineBy(0, f-b1-c1)
    .lineBy(a1, c1)
    .lineBy(0, b1)
    .lineBy(-(a1+t+a0), 0)
    .lineBy(0, -b0)
    .lineBy(a0, -c0)
    .lineBy(0, -(f-b0-c0))
    .arcBy(-2*r0, 0, 180, RotateDirection.clockwise)
    .lineBy(0, f-b0-c0)
    .lineBy(a0, c0)
    .lineBy(0, b0)
    .close()
    .middleLine();
  mid.push(pl);
  // 跨中断面外弧钢筋
  const rebarOuterBase = new Polyline(-r0, f);
  rebarOuterBase
    .lineBy(-t, 0)
    .lineBy(0, -f)
    .arcTo(transPt0.x, transPt0.y, angle)
    .lineTo(-d0/2, -(r0+t+t0))
    .lineBy(d0, 0)
    .lineTo(transPt1.x, transPt1.y)
    .arcTo(r0+t, 0, angle)
    .lineBy(0, f)
    .lineBy(-t, 0)

  const rebarOuter = rebarOuterBase.offset(as)
  rebarOuter.segments.shift();
  rebarOuter.segments.pop();
  mid.push(rebarOuter.thickLine());

  // 跨中断面内弧钢筋
  const rebarInnerBase = new Polyline(-(r0+t), f);
  rebarInnerBase
    .lineBy(t, 0)
    .lineBy(0, -f)
    .arcBy(2*r0, 0, 180)
    .lineBy(0, f)
    .lineBy(t, 0)

  const rebarInner = rebarInnerBase.offset(as, Side.Right);
  rebarInner.segments.shift();
  rebarInner.segments.pop();
  mid.push(rebarInner.thickLine());

  // 左跨中顶梁钢筋
  const rebarTopLBase = new Polyline(-r0, f);
  rebarTopLBase
    .lineBy(0, -(b1 + (a1+t)*c1/a1))
    .lineTo(-(r0+t+a1), f-b1)
    .lineBy(0, b1)
    .lineBy(a1+t+a0, 0)
    .lineBy(0, -b1)
    .lineBy(-(a0+t), -(a0+t)*c0/a0)
    .lineTo(-(r0+t), f);
  const rebarTopL = rebarTopLBase.offset(as, Side.Right);
  rebarTopL.segments.shift();
  rebarTopL.segments.pop();
  mid.push(rebarTopL.thickLine());

  // 右跨中顶梁钢筋
  const rebarTopRBase = new Polyline(r0, f);
  rebarTopRBase
    .lineBy(0, -(b1 + (a1+t)*c1/a1))
    .lineTo(r0+t+a1, f-b1)
    .lineBy(0, b1)
    .lineBy(-(a1+t+a0), 0)
    .lineBy(0, -b1)
    .lineBy(a0+t, -(a0+t)*c0/a0)
    .lineTo(r0+t, f);
  const rebarTopR = rebarTopRBase.offset(as, Side.Left);
  rebarTopR.segments.shift();
  rebarTopR.segments.pop();
  mid.push(rebarTopR.thickLine());

  border.addItem(mid, 1, 20);

  const layout = new HLayoutBuilder(10);
  layout.push(...border.generate());
  paper.push(layout.generate());

  fs.writeFile('demoUshell.txt', paper.pack(), ()=>{
    console.log('ushell demo finished');
  })
  
}