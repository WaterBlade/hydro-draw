import { CompositeCodeItem, GroupCode } from "../../GroupCode";

export * from "./Arc";
export * from "./Arrow";
export * from "./Circle";
export * from "./DimAligned";
export * from "./Line";
export * from "./MText";
export * from "./Text";

export class Entities extends CompositeCodeItem {
  toCode(root: GroupCode): void {
    root.push(0, "SECTION", 2, "ENTITIES");
    super.toCode(root);
    root.push(0, "ENDSEC");
  }
}
