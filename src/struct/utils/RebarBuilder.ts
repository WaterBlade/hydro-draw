import { Builder } from "./Builder";

export abstract class RebarBuilder<T, U, P> extends Builder<T, U, P>{
  name = "";
  setName(name: string): this {
    this.name = name;
    return this;
  }
  abstract buildSpec(): this;
  buildFigure(): this{
    return this;
  }
  buildPos(): this {
    return this;
  }
}

export abstract class CompositeRebarBuilder<T, U, P> extends RebarBuilder<
  T,
  U,
  P
> {
  protected builders: RebarBuilder<T, U, P>[] = [];
  constructor(struct: T, rebars: U, figures: P) {
    super(struct, rebars, figures);
    this.init();
  }
  abstract init(): void;
  push(...builders: RebarBuilder<T, U, P>[]): void {
    this.builders.push(...builders);
  }
  build(): this {
    this.buildSpec();
    this.buildPos();
    this.buildFigure();
    return this;
  }
  buildSpec(): this {
    this.builders.forEach((b) => b.buildSpec());
    return this;
  }
  buildPos(): this {
    this.builders.forEach((b) => b.buildPos());
    return this;
  }
  buildFigure(): this {
    this.builders.forEach((b) => b.buildFigure());
    return this;
  }
  setName(name: string): this {
    this.name = name;
    this.builders.forEach((b) => b.setName(name));
    return this;
  }
}
