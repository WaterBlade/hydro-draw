import { average, RebarDiameter, Side } from "@/draw/misc";
import { RebarPathForm } from "./RebarForm";

export const RebarFormPreset = {
  Line(dia: RebarDiameter, length: number | number[]): RebarPathForm {
    return new RebarPathForm(dia).lineBy(8, 0).dimLength(length);
  },
  LShape(dia: RebarDiameter, vLen: number, hLen: number): RebarPathForm {
    return new RebarPathForm(dia)
      .lineBy(0, -1)
      .dimLength(vLen)
      .lineBy(8, 0)
      .dimLength(hLen);
  },
  SShape(dia: RebarDiameter, v0Len: number, hLen: number, v1Len: number): RebarPathForm{
    return new RebarPathForm(dia)
      .lineBy(0, -1.2)
      .dimLength(v0Len)
      .lineBy(7, 0)
      .dimLength(hLen)
      .lineBy(0, -1.2)
      .dimLength(v1Len)
  },
  UShape(dia: RebarDiameter, vLen: number, hLen: number): RebarPathForm {
    return new RebarPathForm(dia)
      .lineBy(0, -1)
      .dimLength(vLen)
      .lineBy(8, 0)
      .dimLength(hLen)
      .lineBy(0, 1)
      .dimLength(vLen);
  },
  CorbelDouble(dia: RebarDiameter, sLen: number, vLen: number, hLen: number, angle=45): RebarPathForm{
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
      .dimLength(sLen)
  },
  RectStir(
    dia: RebarDiameter,
    vLen: number,
    hLen: number | number[]
  ): RebarPathForm {
    let len = 2 * vLen + 12.5 * dia;
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
};
