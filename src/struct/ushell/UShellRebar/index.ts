import { RebarContainer } from "@/struct/utils";
import { UShellStruct } from "../UShellStruct";
import { BarContainer } from "./Bar";
import { EndContainer } from "./End";
import { UShellRebarInfo } from "./Info";
import { ShellContainer } from "./Shell";
import { TransContainer } from "./Trans";

export class UShellRebar extends RebarContainer{
  info = new UShellRebarInfo();

  bar = new BarContainer(this, this.info);
  end = new EndContainer(this, this.info);
  shell = new ShellContainer(this, this.info);
  trans = new TransContainer(this, this.info);

  build(u: UShellStruct): void{
    this.shell.build(u, '槽壳', this.end.cOuter);
    this.end.build(u, '端肋');
    this.trans.build(u, '渐变段');
    this.bar.build(u, '拉杆');
  }
}