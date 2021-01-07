import {Circle, CompositeItem, Line, ScriptPaper } from "@/draw";
import { RotateDirection, vec } from "@/draw/misc";
import fs from "fs";
import { HLayoutBuilder, RebarCircleForm, RebarSpec, PlaneRebar, PolylinePointRebar, CirclePointRebar, SparsePointRebar, LayerPointRebar } from "@/draw/builder";
import { Polyline } from "@/draw/drawItem/Geometry/Polyline";

export default function runNoteDemo():void{
  const paper = new ScriptPaper();

  const r1 = new RebarSpec('HPB300', 8, 10, new RebarCircleForm(8).circle(900));
  r1.setId('1').setStructure('槽身');

  // simple
  const a0 = new PlaneRebar().rebar(
    new Line(vec(0, 0), vec(100, 0))
  ).spec(r1, 10, 200).leaderNote(vec(50, 30), vec(0, 1), vec(1, 0));

  const a1 = new PlaneRebar().rebar(
    new Line(vec(0, 0), vec(0, 100)),
    new Line(vec(10, 0), vec(10, 100)),
    new Line(vec(100, 0), vec(100, 100)),
    new Line(vec(110, 0), vec(110, 100))
  ).spec(r1, 10, 200).onlineNote(vec(50, 20), vec(1, 0));

  const a2 = new PlaneRebar().rebar(
    new Line(vec(0, 0), vec(0, 100)),
    new Line(vec(10, 0), vec(10, 100)),
    new Line(vec(100, 0), vec(100, 100)),
    new Line(vec(110, 0), vec(110, 100))
  ).spec(r1, 20, 100).onlineNote(vec(50, 20), vec(1, 0.25));


  const a3 = new PlaneRebar().rebar(
    new Line(vec(0, 0), vec(0, 100)),
    new Line(vec(10, 0), vec(10, 100)),
    new Line(vec(100, 0), vec(100, 100)),
    new Line(vec(110, 0), vec(110, 100))
  ).cross(
    new Polyline(-10, 20).lineTo(120, 20)
  ).spec(r1, 20, 100).leaderNote(vec(50, 100), vec(0, 1));


  const a4 = new PlaneRebar().rebar(
    new Line(vec(0, 0), vec(0, 100)),
    new Line(vec(10, 0), vec(10, 100)),
    new Line(vec(100, 0), vec(100, 100)),
    new Line(vec(110, 0), vec(110, 100))
  ).cross(
    new Polyline(-10, 20).lineTo(50, 20).lineTo(90, 30).lineTo(120, 50)
  ).spec(r1, 20, 100).note(vec(1, 0));


  const a5 = new PolylinePointRebar(35, 2.5).polyline(
    new Polyline().lineBy(1000, 0).lineBy(0, 500).divide(50)
  ).offset(50).spec(r1, 10, 50).onlineNote(vec(200, 0))


  const a6 = new PolylinePointRebar(35, 2.5).polyline(
    new Polyline().lineBy(1000, 0).arcBy(250, 250, 90).divide(50)
  ).offset(50).spec(r1, 10, 50).onlineNote(vec(200, 20));


  const a7 = new PolylinePointRebar(35, 2.5).polyline(
    new Polyline().arcBy(1000, 0, 180).divide(50)
  ).offset(50).spec(r1, 10, 50).onlineNote(vec(500, -500));


  const a8 = new PolylinePointRebar(35, 2.5).polyline(
    new Polyline().arcBy(1000, 0, 180).divide(50)
  ).offset(50).spec(r1, 10, 50).leaderNote(vec(500, 200), vec(0, 1));


  const a9 = new CirclePointRebar(35, 2.5).circle(new Circle(vec(0, 0), 300).divideByCount(20)).offset(50).spec(r1, 10, 50).onlineNote();

  const a10 = new SparsePointRebar().points(vec(0, 0), vec(400, 0), vec(400, 400), vec(0, 400)).spec(r1, 10, 50).jointLeader(vec(200, 200), vec(200, 600));

  const a11 = new SparsePointRebar().points(vec(0, 0), vec(400, 0), vec(400, 400), vec(0, 400)).spec(r1, 10, 50).parallelLeader(vec(1200, 600), vec(1, 0));

  const a12 = new SparsePointRebar().points(vec(0, 0), vec(400, 0), vec(400, 400), vec(0, 400)).spec(r1, 10, 50).parallelLeader(vec(600, 200), vec(1, 0));

  const a13 = new SparsePointRebar().points(vec(0, 0), vec(400, 0), vec(400, 400), vec(0, 400)).spec(r1, 10, 50).parrallelOnline(vec(200, 500), vec(1, 0));

  const a14 = new LayerPointRebar().layers(vec(0, 0), vec(100, 0), 9, 20, 5).spec(r1, 10, 30).leaderNote(vec(-20, -20), vec(1, 0));

  const a15 = new LayerPointRebar().layers(vec(0, 0), vec(100, 0), 9, 20, 5).spec(r1, 10, 30).onlineNote(vec(50, -20), vec(1, 0));

  const a16 = new LayerPointRebar().layers(vec(0, 0), vec(100, 0), 9, 20, 5).spec(r1, 10, 30).onlineNote(vec(50, 120), vec(1, 0));

  const layout = new HLayoutBuilder(10);
  layout.push(
    a0.generate(),
    a1.generate(),
    a2.generate(),
    a3.generate(),
    a4.generate(),
    a5.generate(),
    a6.generate(),
    a7.generate(),
    a8.generate(),
    a9.generate(),
    a10.generate(),
    a11.generate(),
    a12.generate(),
    a13.generate(),
    a14.generate(),
    a15.generate(),
    a16.generate()
  );
  paper.push(layout.generate());
  fs.writeFile('demoNote.txt', paper.pack(), ()=>{
    console.log('note demo finished');
  })
}