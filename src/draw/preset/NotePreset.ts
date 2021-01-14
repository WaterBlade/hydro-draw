import { Circle, CompositeItem, Content, Line, Text } from "../drawItem";
import { TextAlign, vec, Vector } from "../misc";

export const Note = {
  leader,
  leaderSpec
}

function leader(content: string | Content, start: Vector, end: Vector, textHeight: number): CompositeItem{
  const t = new Text(content, end, textHeight);
  const factor = start.x < end.x ? 1 : -1;
  const angle = end.sub(start).quadrantAngle();
  if(angle > 90 && angle < 270){
    t.textAlign = TextAlign.BottomRight;
  }else{
    t.textAlign = TextAlign.BottomLeft;
  }
  const comp = new CompositeItem();
  comp.push(
    new Line(start, end),
    new Line(end, end.add(vec(factor * t.getBoundingBox().width, 0))),
    t
  )
  return comp;
}

function leaderSpec(content: string | Content, center: Vector, radius: number,  end: Vector, textHeight: number): CompositeItem{
  const start = center.add(end.sub(center).unit().mul(radius));
  const comp = leader(content, start, end, textHeight);
  comp.push(
    new Circle(center, radius)
  );
  return comp;
}