import { Builder } from "./Builder";

export abstract class FigureBuilder<T, U, P> extends Builder<T, U, P> {
  initFigure(): this {
    return this;
  }
  buildPos(): this {
    return this;
  }
  buildOutline(): this {
    return this;
  }
  buildDim(): this {
    return this;
  }
  buildNote(): this {
    return this;
  }
}

export abstract class CompositeFigureBuilder<T, U, P> extends FigureBuilder<
  T,
  U,
  P
> {
  protected builders: FigureBuilder<T, U, P>[] = [];
  constructor(struct: T, specs: U, figures: P) {
    super(struct, specs, figures);
    this.init();
  }
  abstract init(): void;
  push(...builders: FigureBuilder<T, U, P>[]): void {
    this.builders.push(...builders);
  }
  initFigure(): this {
    this.builders.forEach((b) => b.initFigure());
    return this;
  }
  buildPos(): this {
    this.builders.forEach((b) => b.buildPos());
    return this;
  }
  buildOutline(): this {
    this.builders.forEach((b) => b.buildOutline());
    return this;
  }
  buildDim(): this {
    this.builders.forEach((b) => b.buildDim());
    return this;
  }
  buildNote(): this {
    this.builders.forEach((b) => b.buildNote());
    return this;
  }
}
