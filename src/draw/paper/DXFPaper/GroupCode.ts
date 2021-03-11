export class GroupCode {
  protected content: string[] = [];
  constructor(...kvs: (string | number)[]) {
    this.push(...kvs);
  }
  push(...kvs: (string | number)[]): void {
    if (kvs.length % 2 !== 0) throw Error("key and value not match");

    const content = this.content;
    let i = 0;
    while (i < kvs.length) {
      const key = kvs[i++];
      const val = kvs[i++];
      content.push(
        key.toString(),
        typeof val === "string" ? val : val.toFixed(4)
      );
    }
  }
  extend(code: GroupCode): void {
    this.content.push(...code.content);
  }
  toString(): string {
    return this.content.join("\n");
  }
}

export interface CodeItem {
  toCode(root: GroupCode): void;
}

export abstract class CompositeCodeItem implements CodeItem {
  protected items: CodeItem[] = [];
  toCode(root: GroupCode): void {
    this.items.forEach((item) => item.toCode(root));
  }
  push(...items: CodeItem[]): void {
    this.items.push(...items);
  }
}

export function code(...kvs: (string | number)[]): GroupCode {
  return new GroupCode(...kvs);
}
