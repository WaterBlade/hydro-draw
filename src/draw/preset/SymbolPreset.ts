import { CompositeItem, Content, Line, Polyline, TextDraw } from "../drawItem";
import { TextAlign, Vector } from "../misc";

export const SymbolPreset = {
  breakline,
  sectSymbol,
};

function breakline(start: Vector, end: Vector, textHeight: number): Polyline {
  const h = textHeight;
  const dir = end.sub(start).unit();
  const n = dir.norm().unit();
  const mid = start.add(end).mul(0.5);
  const midS = mid.add(dir.mul(-h / 2));
  const midE = mid.add(dir.mul(h / 2));
  const normS = mid
    .add(midS)
    .mul(0.5)
    .add(n.mul(h / 2));
  const normE = mid
    .add(midE)
    .mul(0.5)
    .add(n.mul(-h / 2));
  const extS = start.add(dir.mul(-0.75 * h));
  const extE = end.add(dir.mul(0.75 * h));
  return new Polyline(extS.x, extS.y)
    .lineTo(midS.x, midS.y)
    .lineTo(normS.x, normS.y)
    .lineTo(normE.x, normE.y)
    .lineTo(midE.x, midE.y)
    .lineTo(extE.x, extE.y);
}

function sectSymbol(
  content: string | Content,
  start: Vector,
  end: Vector,
  textHeight: number
): CompositeItem {
  const comp = new CompositeItem();
  const h = textHeight;
  const dir = end.sub(start).unit();
  const extStart = start.add(dir.mul(-2 * h));
  const extEnd = end.add(dir.mul(2 * h));
  const ptStart = start.add(dir.mul(-h));
  const ptEnd = end.add(dir.mul(h));

  const angle = dir.quadrantAngle();
  const align = TextAlign.BottomCenter;

  const n = dir.norm().mul(textHeight * 0.25);

  const propAngle = TextDraw.properAngle(angle);
  const propAlign = TextDraw.properAlign(angle, align);

  comp.push(
    new Line(extStart, start),
    new Line(extEnd, end),
    new TextDraw(content, ptStart.add(n), textHeight, propAlign, propAngle),
    new TextDraw(content, ptEnd.add(n), textHeight, propAlign, propAngle)
  );

  return comp;
}
