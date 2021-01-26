import { Figure } from "@/struct/utils";
import { Beam, BeamRebar } from "./Beam";
import { Bottom } from "./Bottom";
import { Mid } from "./Mid";
import { Stir } from "./Stir";
import { Top } from "./Top";
import { Component } from "../Component";


export class BeamRebarBuilder extends Component<Beam, BeamRebar>{
  top = new Top(this.struct, this.specs);
  bot = new Bottom(this.struct, this.specs);
  mid = new Mid(this.struct, this.specs);
  stir = new Stir(this.struct, this.specs);

  setName(name: string): this{
    this.top.setName(name);
    this.bot.setName(name);
    this.mid.setName(name);
    this.stir.setName(name);
    return this;
  }
  buildSpec(beamCount: number): void{
    this.top.buildSpec(beamCount);
    this.bot.buildSpec(beamCount);
    this.mid.buildSpec(beamCount);
    this.stir.buildSpec(beamCount);
  }
  buildPos(sectFig: Figure): void{
    this.mid.buildPos(sectFig);
    this.stir.buildPos();
  }
  drawView(fig: Figure, y0: number, x0=0): void{
    this.top.drawView(fig, y0, x0);
    this.bot.drawView(fig, y0, x0);
    this.mid.drawView(fig, y0, x0);
    this.stir.drawView(fig, y0, x0);
  }
  drawSect(fig: Figure): void{
    this.top.drawSect(fig);
    this.bot.drawSect(fig);
    this.mid.drawSect(fig);
    this.stir.drawSect(fig);
  }
}
