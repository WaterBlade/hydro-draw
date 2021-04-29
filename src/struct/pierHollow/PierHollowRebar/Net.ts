import { divideBySpace, Line, RebarForm, RebarFormPreset, StrecthSide, vec } from "@/draw";
import { PierHollowSpaceRebar } from "./PierHollowRebar";

export class LNetBar extends PierHollowSpaceRebar{
  get l(): number{
    return this.struct.l;
  }
  get w(): number{
      return this.struct.w;
  }
  get count(): number{
      return (this.v_top_pos().length + this.v_bot_pos().length) * this.h_pos().points.length;
  }
  get form(): RebarForm{
      return RebarFormPreset.Line(this.diameter, this.l - 2* this.rebars.as);
  }
  v_top_pos(): number[]{
      const as = this.rebars.as;
      const t = this.struct;
      return divideBySpace(t.h - t.hTopSolid+as, t.h-as, this.space, StrecthSide.tail);
  }
  v_bot_pos(): number[]{
      const as = this.rebars.as;
      const t = this.struct;
      return divideBySpace(t.hBotSolid - as, as, this.space, StrecthSide.tail);
  }
  h_pos(y=0): Line{
      const t = this.struct;
      return new Line(vec(-this.w/2 + t.t-50, y), vec(this.w/2 - t.t+50, y)).divide(this.space)
  }
}

export class WNetBar extends LNetBar{
  get l(): number{
    return this.struct.w;
  }
  get w(): number{
      return this.struct.l;
  }
}