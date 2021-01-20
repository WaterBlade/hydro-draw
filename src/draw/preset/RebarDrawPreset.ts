import { Polyline } from "../drawItem";
import { polar, RotateDirection, vec } from "../misc";

export const RebarDraw = {
  stir(h: number, w: number, r= 0): Polyline{
    if(h <= 0 || w <= 0 || r < 0) throw Error('negative dimension');
    const d = 25;
    return new Polyline(w/2-d, h/2-2*r-d)
      .lineBy(d, d)
      .lineBy(0, r)
      .arcBy(-r, r, 90)
      .lineBy(-w+2*r, 0)
      .arcBy(-r, -r, 90)
      .lineBy(0, -h + 2*r)
      .arcBy(r, -r, 90)
      .lineBy(w-2*r, 0)
      .arcBy(r, r, 90)
      .lineBy(0, h-2*r)
      .arcBy(-r, r, 90)
      .lineBy(-r, 0)
      .lineBy(-d, -d);
  },
  hLineHook(l: number, r = 0): Polyline{
    if(l <= 0 || r< 0) throw Error('negative dimension');
    const d = 25;
    const left = polar(r, 225).add(vec(-l/2+r, 0));
    const right = left.mirrorByVAxis();
    return new Polyline(left.x+d, left.y-d)
      .lineBy(-d, d)
      .arcTo(-l/2+r, r, 135, RotateDirection.clockwise)
      .lineBy(l-2*r, 0)
      .arcTo(right.x, right.y, 135, RotateDirection.clockwise)
      .lineBy(-d, -d);
  },
  vLineHook(l: number, r = 0): Polyline{
    if(l <= 0 || r < 0) throw Error('negative dimension');
    const d = 25;
    const top = polar(r, 225).add(vec(0, l/2-r));
    const bottom = polar(r, 135).add(vec(0, -l/2+r));
    return new Polyline(bottom.x-d, bottom.y+d)
      .lineBy(d, -d)
      .arcTo(r, -l/2+r, 135)
      .lineBy(0, l-2*r)
      .arcTo(top.x, top.y, 135)
      .lineBy(-d, -d);
  },
}