import { CodeItem, GroupCode } from "../GroupCode";
import { HandleGenerator, HandleItem } from "../Handle";

interface DictItem {
  name: string;
  handle: string;
}

class Dictionary implements CodeItem {
  protected items: DictItem[] = [];
  constructor(
    public name: string,
    public handle: string,
    public owner?: HandleItem
  ) {}
  push(...items: DictItem[]): void {
    this.items.push(...items);
  }
  toCode(root: GroupCode): void {
    root.push(
      0,
      "DICTIONARY",
      5,
      this.handle,
      330,
      this.owner ? this.owner.handle : "0",
      100,
      "AcDbDictionary"
    );
    for (const item of this.items) {
      root.push(3, item.name, 350, item.handle);
    }
  }
}

export class Objects implements CodeItem {
  root: Dictionary;
  acadGroup: Dictionary;
  constructor(handleGen: HandleGenerator) {
    this.root = new Dictionary("root", handleGen.handle);
    this.acadGroup = new Dictionary("ACAD_GROUP", handleGen.handle, this.root);

    this.root.push(this.acadGroup);
  }
  toCode(root: GroupCode): void {
    root.push(0, "SECTION", 2, "OBJECTS");
    this.root.toCode(root);
    this.acadGroup.toCode(root);
    root.push(0, "ENDSEC");
  }
}
