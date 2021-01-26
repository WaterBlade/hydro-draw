import { Line, polar, vec } from "@/draw";
import { Pile } from "./PileStruct";
import { PileRebar } from "./PileRebar";

export const PileRebarShape = {
  stirTop(struct: Pile, rebars: PileRebar): Line[]{
    const t = struct;
    const as = rebars.as;
    const bar = rebars.topStir;
    const mainBar = rebars.main;
    const left = new Line(vec(-t.d/2+as, t.hs), polar(mainBar.diameter * rebars.anchorFactor, t.topAngle + 90).add(vec(-t.d/2+as, t.hs)));
    const right = left.mirrorByVAxis();
    const y = left.end.y;
    return new Line(vec(0, t.hs), vec(0, y)).divide(bar.space).removeBothPt().points.map(
      p => new Line(left.rayIntersect(p, vec(1, 0))[0], right.rayIntersect(p, vec(1, 0))[0])
    );
  }
}