import { HydroA1Builder } from "./HydroBorderBuilder";

describe("A1", () => {
  test("get boundary", () => {
    const a1 = new HydroA1Builder();
    const b = a1.getBoundary();
    expect(b.hEdges.length).toEqual(3);
    expect(b.vEdges.length).toEqual(3);

    expect(b.start.x).toEqual(25);
    expect(b.start.y).toEqual(10);

    expect(b.hEdges[0].y).toEqual(10);
    expect(b.hEdges[1].y).toEqual(24);
    expect(b.hEdges[2].y).toEqual(81);

    expect(b.hEdges[0].xLeft).toEqual(25);
    expect(b.hEdges[1].xLeft).toEqual(637.7);
    expect(b.hEdges[2].xLeft).toEqual(651);
  });
});
