import { Circle, CompositeItem, DrawItem } from "@/draw/drawItem";
import { NoteBuilder } from "./NoteBuilder";

export abstract class PointNote extends NoteBuilder {
  constructor(textHeight = 3.5, public drawRadius = 0.3) {
    super(textHeight);
  }
  rebars: Circle[] = [];
  notes: DrawItem[] = [];
  generate(): CompositeItem {
    const c = new CompositeItem();
    c.push(...this.notes, ...this.rebars);
    return c;
  }
}
