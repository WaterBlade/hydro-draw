import { CodeItem, GroupCode } from "../GroupCode";

export class Classes implements CodeItem {
  toCode(root: GroupCode): void {
    root.push(0, "SECTION", 2, "CLASSES", 0, "ENDSEC");
  }
}
