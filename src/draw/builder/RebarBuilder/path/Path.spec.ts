import { vec } from "../../../misc";
import { RotateDirection } from "../../../RotateDirection";
import { LineSegment, ArcSegment} from "./Path";

describe('line segment', ()=>{
  test('offset', ()=>{
    const l = new LineSegment(vec(0, 0), vec(10, 0));
    l.offset(10);
    expect(l.start).toEqual(vec(0, -10));
    expect(l.end).toEqual(vec(10, -10));
  });
  test('intersect', ()=>{
    const l = new LineSegment(vec(0, 0), vec(10, 0));
    const r = new LineSegment(vec(5, -5), vec(5, 10));
    const a = new ArcSegment(vec(5, 0), 4, 0, 180, RotateDirection.counterclockwise);
    expect(l.intersect(r)).toEqual([vec(5, 0)]);
    const inter = l.intersect(a);
    expect(inter.length).toEqual(2);
    expect(inter[0].x).toEqual(9);
    expect(inter[0].y).toEqual(0);
    expect(inter[1].x).toBeCloseTo(1, 2);
    expect(inter[1].y).toEqual(0);
  })
});

describe('arc segment', ()=>{
  test('offset', ()=>{
    const a = new ArcSegment(
      vec(0, 0),
      10,
      0,
      180,
      RotateDirection.counterclockwise
    );
    a.offset(2);
    expect(a.radius).toEqual(8);
  });
  test('intersect', ()=>{
    const a = new ArcSegment(
      vec(0, 0),
      5,
      0,
      180,
      RotateDirection.counterclockwise
    );
    const b = new ArcSegment(
      vec(10, 0),
      5,
      0,
      180,
      RotateDirection.counterclockwise
    );
    const c = new ArcSegment(
      vec(5, 0),
      5,
      0,
      180,
      RotateDirection.counterclockwise
    )
    expect(a.intersect(b)).toEqual([vec(5, 0)])
    const inter = a.intersect(c);
    expect(inter.length).toEqual(2);
    expect(inter[0].x).toBeCloseTo(2.5,2);
    expect(inter[0].y).toBeCloseTo(4.33,2);
    expect(inter[1].x).toBeCloseTo(2.5,2);
    expect(inter[1].y).toBeCloseTo(-4.33,2);

  })
})