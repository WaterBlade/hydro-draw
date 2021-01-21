import {
  Circle,

  DrawItem,
  Line,
  Text
} from "@/draw/drawItem";
import {
  last,




  TextAlign,
  vec
} from "@/draw/misc";
import { RebarForm } from "./RebarForm";


export class RebarCircleForm extends RebarForm {
  get entities(): DrawItem[] {
    if (!this.circleItem) {
      throw Error("rebar spec error: entities is empty");
    }
    return [this.circleItem];
  }

  circleItem?: Circle;
  circle(dia: number | number[]): this {
    const r = 0.9 * this.baseUnit;
    const t = 0.25 * this.numberHeight;
    const h = 0.75 * this.numberHeight;
    this.circleItem = new Circle(vec(0, 0), r).thickLine();

    let len: number;
    if (typeof dia === "number") {
      len = Math.PI * dia;
      this.notes.push(
        new Text(
          this.genNumContent(dia, { prefix: "D" }),
          vec(0, t),
          h,
          TextAlign.BottomCenter
        )
      );
    } else {
      len = (dia.reduce((pre, cur) => pre + cur, 0) * Math.PI) / dia.length;
      this.notes.push(
        new Text(
          this.genNumContent(dia[0], { prefix: "D" }),
          vec(0, t),
          h,
          TextAlign.BottomCenter
        ),
        new Text(
          this.genNumContent(last(dia), { prefix: "~D" }),
          vec(0, -t),
          h,
          TextAlign.TopCenter
        )
      );
    }

    this.addUp(len);
    this.notes.push(
      new Text(
        this.genNumContent(len),
        vec(r + t, 0),
        this.numberHeight,
        TextAlign.MiddleLeft
      ),
      new Line(vec(-r, 0), vec(r, 0)),
      this.genArrow(vec(-r, 0), vec(0, 0)),
      this.genArrow(vec(r, 0), vec(0, 0))
    );

    return this;
  }
}
