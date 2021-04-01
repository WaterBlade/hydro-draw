import { Line, RebarForm, RebarFormPreset, vec } from "@/draw";
import { PierHollowSpaceRebar } from "./PierHollowRebar";

export class LMain extends PierHollowSpaceRebar{
  pos(): Line{
    const t = this.struct;
    const as = this.rebars.as;
    return new Line(vec(-t.l/2+t.fr, -t.w/2+as), vec(t.l/2-t.fr, -t.w/2+as)).divide(this.space);
  }
  pos_mirror(): Line{
    const t = this.struct;
    const as = this.rebars.as;
    return new Line(vec(-t.l/2+t.fr, t.w/2-as), vec(t.l/2-t.fr, t.w/2-as)).divide(this.space);
  }
  xs(): number[]{
    return this.pos().points.map(p=> p.x);
  }
  get count(): number{
    return this.pos().points.length * 2;
  }
  get form(): RebarForm{
    const t =this.struct;
    return RebarFormPreset.LShape(this.diameter, 500, t.h + t.topBeam.h + t.found.h-2*this.rebars.as);
  }
}

export class WMain extends LMain{
  pos(): Line{
    const t = this.struct;
    const as = this.rebars.as;
    return new Line(vec(-t.l/2+as, -t.w/2+t.fr), vec(-t.l/2+as, t.w/2-t.fr)).divide(this.space);
  }
  pos_mirror(): Line{
    const t = this.struct;
    const as = this.rebars.as;
    return new Line(vec(t.l/2-as, -t.w/2+t.fr), vec(t.l/2-as, t.w/2-t.fr)).divide(this.space);
  }
  xs(): number[]{
    return this.pos().points.map(p=> p.y);
  }
}