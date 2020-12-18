import {CompositeItem, Line, ScriptPaper } from "../src/draw";
import { RotateDirection, vec } from "../src/draw/misc";
import fs from "fs";
import { HLayoutBuilder, RebarCircleForm, RebarSpec, ArrowNote, PathPointNote } from "../src/draw/builder";
import { Polyline } from "@/draw/drawItem/Geometry/Polyline";

export default function runNoteDemo():void{
  const paper = new ScriptPaper();

  const r1 = new RebarSpec('HPB300', 8, 10, new RebarCircleForm(8).circle(900));
  r1.setId('1').setStructure('槽身');

  // simple
  const a0 = new ArrowNote().rebar(
    new Line(vec(0, 0), vec(100, 0))
  ).spec(r1, 10, 200).leaderNote(vec(50, 30), vec(0, 1), vec(1, 0));

  const a1 = new ArrowNote().rebar(
    new Line(vec(0, 0), vec(0, 100)),
    new Line(vec(10, 0), vec(10, 100)),
    new Line(vec(100, 0), vec(100, 100)),
    new Line(vec(110, 0), vec(110, 100))
  ).spec(r1, 10, 200).onlineNote(vec(50, 20), vec(1, 0));

  const a2 = new ArrowNote().rebar(
    new Line(vec(0, 0), vec(0, 100)),
    new Line(vec(10, 0), vec(10, 100)),
    new Line(vec(100, 0), vec(100, 100)),
    new Line(vec(110, 0), vec(110, 100))
  ).spec(r1, 20, 100).onlineNote(vec(50, 20), vec(1, 0.25));


  const a3 = new ArrowNote().rebar(
    new Line(vec(0, 0), vec(0, 100)),
    new Line(vec(10, 0), vec(10, 100)),
    new Line(vec(100, 0), vec(100, 100)),
    new Line(vec(110, 0), vec(110, 100))
  ).cross(
    new Polyline(-10, 20).lineTo(120, 20)
  ).spec(r1, 20, 100).leaderNote(vec(50, 100), vec(0, 1));


  const a4 = new ArrowNote().rebar(
    new Line(vec(0, 0), vec(0, 100)),
    new Line(vec(10, 0), vec(10, 100)),
    new Line(vec(100, 0), vec(100, 100)),
    new Line(vec(110, 0), vec(110, 100))
  ).cross(
    new Polyline(-10, 20).lineTo(50, 20).lineTo(90, 30).lineTo(120, 50)
  ).spec(r1, 20, 100).note(vec(1, 0));


  const a5 = new PathPointNote(35, 2.5).path(
    new Polyline().lineBy(1000, 0).lineBy(0, 500).divide(50)
  ).offset(50).spec(r1, 10, 50).onlineNote(vec(200, 0))


  const a6 = new PathPointNote(35, 2.5).path(
    new Polyline().lineBy(1000, 0).arcBy(250, 250, 90).divide(50)
  ).offset(50).spec(r1, 10, 50).onlineNote(vec(200, 20));


  const a7 = new PathPointNote(35, 2.5).path(
    new Polyline().arcBy(1000, 0, 180).divide(50)
  ).offset(50).spec(r1, 10, 50).onlineNote(vec(500, -500));

  const layout = new HLayoutBuilder(10);
  layout.push(
    a0.generate(),
    a1.generate(),
    a2.generate(),
    a3.generate(),
    a4.generate(),
    a5.generate(),
    a6.generate(),
    a7.generate()
  );
  paper.push(layout.generate());
  fs.writeFile('demoNote.txt', paper.pack(), ()=>{
    console.log('note demo finished');
  })
}