import { CodeItem, GroupCode } from "../../GroupCode";
import { HandleGenerator } from "../../Handle";
import { AppIDTable } from "./AppID";
import { BlockRecordTable } from "./BlockRecord";
import { DimStyleTable } from "./DimStyle";
import { LayerTable } from "./Layer";
import { LTypeTable } from "./LType";
import { StyleTable } from "./Style";
import { UCSTable } from "./UCS";
import { ViewTable } from "./View";
import { VPortTable } from "./Vport";

export {DimStyle} from "./DimStyle";
export {Layer} from "./Layer";

export class Tables implements CodeItem{
  vport = new VPortTable(this.handleGen);
  ltype = new LTypeTable(this.handleGen);
  layer = new LayerTable(this.handleGen, this.ltype);
  style = new StyleTable(this.handleGen);
  view = new ViewTable(this.handleGen);
  ucs = new UCSTable(this.handleGen);
  appID = new AppIDTable(this.handleGen);
  dimStyle = new DimStyleTable(this.handleGen, this.style);
  blockRecord = new BlockRecordTable(this.handleGen);

  constructor(protected handleGen: HandleGenerator){}
  toCode(root: GroupCode): void{
    root.push(0, 'SECTION', 2, 'TABLES')

    this.vport.toCode(root);
    this.ltype.toCode(root);
    this.layer.toCode(root);
    this.style.toCode(root);
    this.view.toCode(root);
    this.ucs.toCode(root);
    this.appID.toCode(root);
    this.dimStyle.toCode(root);
    this.blockRecord.toCode(root);

    root.push(0, 'ENDSEC');
  }
}