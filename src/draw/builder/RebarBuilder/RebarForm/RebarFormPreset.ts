import { average, RebarDiameter, Side } from "@/draw/misc";
import { RebarCircleForm } from "./RebarCircleForm";
import { RebarPathForm } from "./RebarPathForm";

export const RebarFormPreset = {
  Circle(barDia: RebarDiameter, circleDia: number | number[]): RebarCircleForm {
    return new RebarCircleForm(barDia).circle(circleDia);
  },
  Line(dia: RebarDiameter, length: number | number[]): RebarPathForm {
    return new RebarPathForm(dia).lineBy(8, 0).dimLength(length);
  },
  HookLine(
    dia: RebarDiameter,
    length: number | number[],
    drawLen = 8
  ): RebarPathForm {
    return new RebarPathForm(dia)
      .lineBy(drawLen, 0)
      .dimLength(length)
      .hook({ start: Side.Left, end: Side.Left });
  },
  LShape(
    dia: RebarDiameter,
    vLen: number,
    hLen: number,
    drawLen = 8
  ): RebarPathForm {
    return new RebarPathForm(dia)
      .lineBy(0, -1)
      .dimLength(vLen)
      .lineBy(drawLen, 0)
      .dimLength(hLen);
  },
  SShape(
    dia: RebarDiameter,
    v0Len: number,
    hLen: number,
    v1Len: number,
    drawLen = 8
  ): RebarPathForm {
    return new RebarPathForm(dia)
      .lineBy(0, -1.2)
      .dimLength(v0Len)
      .lineBy(drawLen, 0)
      .dimLength(hLen)
      .lineBy(0, -1.2)
      .dimLength(v1Len);
  },
  UShape(
    dia: RebarDiameter,
    vLen: number,
    hLen: number,
    drawLen = 8
  ): RebarPathForm {
    return new RebarPathForm(dia)
      .lineBy(0, -1)
      .dimLength(vLen)
      .lineBy(drawLen, 0)
      .dimLength(hLen)
      .lineBy(0, 1)
      .dimLength(vLen);
  },
  CShape(
    dia: RebarDiameter,
    vLen: number,
    hLen: number,
    drawLen = 8
  ): RebarPathForm {
    return new RebarPathForm(dia)
      .lineBy(-drawLen, 0)
      .dimLength(hLen)
      .lineBy(0, -1.6)
      .dimLength(vLen)
      .lineBy(drawLen, 0)
      .dimLength(hLen);
  },
  CorbelDouble(
    dia: RebarDiameter,
    sLen: number,
    vLen: number,
    hLen: number,
    angle = 45
  ): RebarPathForm {
    return new RebarPathForm(dia)
      .lineBy(-1.5, 1)
      .dimLength(sLen)
      .lineBy(0, 1.2)
      .dimAngle(angle)
      .dimLength(vLen)
      .lineBy(3.2, 0)
      .dimLength(hLen)
      .lineBy(0, -1.2)
      .dimLength(vLen)
      .lineBy(-1.5, -1)
      .dimLength(sLen);
  },
  RectStir(
    dia: RebarDiameter,
    vLen: number,
    hLen: number | number[]
  ): RebarPathForm {
    let len = 2 * vLen + 15 * dia;
    if (typeof hLen === "number") {
      len += 2 * hLen;
    } else {
      len += 2 * average(...hLen);
    }
    const hookRadius = 0.15;
    return new RebarPathForm(dia)
      .lineBy(-4 + hookRadius, 0)
      .lineBy(0, -1.6)
      .dimLength(vLen, Side.Right)
      .lineBy(4, 0)
      .dimLength(hLen)
      .lineBy(0, 1.6 - hookRadius)
      .hook({ start: Side.Left, end: Side.Left })
      .setLength(len);
  },
  Rect(
    dia: RebarDiameter,
    vLen: number,
    hLen: number | number[]
  ): RebarPathForm {
    let len = 2 * vLen;
    if (typeof hLen === "number") {
      len += 2 * hLen;
    } else {
      len += 2 * average(...hLen);
    }
    return new RebarPathForm(dia)
      .lineBy(0, -1.6)
      .dimLength(vLen, Side.Right)
      .lineBy(4, 0)
      .dimLength(hLen)
      .lineBy(0, 1.6)
      .lineBy(-4, 0)
      .setLength(len);
  },
};
