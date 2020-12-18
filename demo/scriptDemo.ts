import {Arc, Arrow, Circle, CompositeItem, DimAligned, Line, ScriptPaper, TableBuilder, Text } from "../src/draw";
import { RotateDirection, vec, Vector } from "../src/draw/misc";
import fs from "fs";
import { HydroA1Builder, HLayoutBuilder, RebarPathForm, RebarCircleForm, RebarTable, RebarSpec, MaterialTable, ArrowNote } from "../src/draw/builder";
import { LineType } from "../src/draw/misc/Enum/LineType";
import { Side } from "../src/draw/misc/Enum/Side";
import { Polyline } from "@/draw/drawItem/Geometry/Polyline";

export default function runScriptDemo():void{
  const paper = new ScriptPaper();
  // paper.push(
  //   new Arc(vec(0, 0), 2, 0, 180),
  //   new Arrow(vec(2, 0), vec(3, 0), 1),
  //   new Circle(vec(4,0), 1),
  //   new DimAligned(vec(0, 10), vec(10, 10), vec(5, 12), 1000, 500),
  //   new Line(vec(6, 0), vec(16, 0)),
  //   new Text('Hello World', vec(16, 0), 1.75, TextAlign.MiddleCenter),
  // )
  // const comp = new CompositeItem(vec(20, 20));
  // comp.push(
  //   new Arc(vec(0, 0), 2, 0, 180),
  //   new Arrow(vec(2, 0), vec(3, 0), 1),
  //   new Circle(vec(4,0), 1),
  //   new DimAligned(vec(0, 10), vec(10, 10), vec(5, 12), 1000, 500),
  //   new Line(vec(6, 0), vec(16, 0)),
  //   new Text('Hello World', vec(16, 0), 1.75, TextAlign.MiddleCenter),
  // )
  // comp.scale(2);
  // paper.push(comp);
  // const table = new TableBuilder(3.5);
  // table.cell(0, 0).text('hello');
  // table.cell(0, 1).text('world');
  // table.cell(1, 0, 1, 2).text('first meet');
  // table.title = 'new table';
  // // paper.push(table.generate());
  // const border = new HydroA1Builder();
  // border.company = '湖南省水利水电勘测设计研究总院';
  // border.project = '涔天河水库扩建工程';
  // border.design = '技施'
  // border.section = '水工'
  // border.date = '2020.10'

  // border.note = [
  //   '1.图中单位：尺寸为mm',
  // ]
  // for(let i = 0; i < 1000; i++){
  //   border.addItem(new Circle(vec(0, 0), 100*Math.random()), 1, 1);
  // }

  // const pl = new Polyline(vec(0, 0));
  // pl.lineTo(10, 0);
  // pl.lineTo(10, 10);
  // pl.arcTo(20, 10, 90, RotateDirection.counterclockwise);
  // pl.arcTo(30, 10, 90, RotateDirection.clockwise);
  // pl.lineTo(40, 10);

  // const comp = new CompositeItem()
  // const origin = pl.offset(1, Side.Right);
  // comp.push(pl, origin);
  // origin.divide(1);
  // const originPts = origin.getDividePoints();
  // const oProj = origin.project(0.5, Side.Right);
  // const iProj = origin.project(0.5, Side.Left);
  
  // const oProjPts = oProj.getDividePoints();
  // const iPorjPts = iProj.getDividePoints();
  // for(let i = 0; i < originPts.length; i++){
  //   const pt1 = originPts[i];
  //   const pt2 = oProjPts[i];
  //   const pt3 = iPorjPts[i];
  //   comp.push(new Circle(pt1, 0.1).thickLine());
  //   comp.push(new Line(pt1, pt2).thinLine());
  //   comp.push(new Line(pt1, pt3).thinLine());
  // }
  // comp.push(oProj, iProj);

  // rebar spec
  // const spec = new RebarPathForm(6);
  // spec
  //   .lineBy(0, -1).dimLength(500)
  //   .lineBy(6, 0).dimLength(5000)
  //   .lineBy(0, 1).dimLength(500)
  //   .lineBy(2, 2).dimAngle(45).dimLength(800)
  //   .arcBy(2, 2, 90).dimArc(300, 90).dimLength(900)
  //   .lineBy(2, 0).dimLength(500)
  //   .guideLineBy(1, 0).lineBy(2, 2).dimLength(900)
  //   .dimAngle(40)
  //   .hook({start: Side.Left, end: Side.Right})
  //   .text('顶部', Side.Left, true)
  //   .text('底部', Side.Right, true);

  // const spec1 = new RebarCircleForm(6);
  // spec1.circle([900, 1200]);

  const t = new RebarTable();
  const mt = new MaterialTable();

  const r1 = new RebarSpec('HPB300', 8, 10, new RebarCircleForm(8).circle(900));
  r1.setId('1').setStructure('槽身');
  const r2 = new RebarSpec('HRB400', 12, 30, new RebarCircleForm(8).circle(1200));
  r2.setId('2').setStructure('槽身');

  t.push(r1, r2);
  mt.push(r1, r2);

  const rebar = new Polyline(20, 0);
  rebar.lineBy(0, -50).lineBy(400, 0).lineBy(0, 50).thickLine();
  
  const arrow = new ArrowNote();
  arrow.rebar(rebar).spec(r1, 20, 200).leaderNote(vec(0, -20), vec(1, -1), vec(-1, 0));

  const c = new CompositeItem();
  c.push(arrow.generate(), rebar);

  const layout = new HLayoutBuilder(10);
  layout.push(t.generate(), mt.generate(), c);
  paper.push(layout.generate());
  fs.writeFile('demoScript.txt', paper.pack(), ()=>{
    console.log('script demo finished');
  })
}