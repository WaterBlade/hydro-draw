import { CodeItem, GroupCode } from "../GroupCode";
import { HandleGenerator } from "../Handle";

export class Header implements CodeItem{
  constructor(protected handleGen: HandleGenerator){}
  toCode(root: GroupCode): void{
    root.push(
      0, 'SECTION',
      2, 'HEADER',
      9, '$ACADVER',
      1, 'AC1021',
      9, '$HANDSEED',
      5, this.handleGen.handle,
      0, 'ENDSEC'
    );
  }
}