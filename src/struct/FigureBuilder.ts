export abstract class FigureBuilder<T, U, P>{
  constructor(
    protected struct: T,
    protected specs: U,
    protected figures: P
  ){}
  abstract initFigure(): this;
  abstract buildOutline(): this;
  abstract buildDim(): this;
  buildNote(): this{
    return this;
  }
}

export abstract class CompositeFigureBuilder<T, U, P> extends FigureBuilder<T, U, P>{
  protected builders: FigureBuilder<T, U, P>[] = [];
  constructor(struct: T, specs: U, figures: P){
    super(struct, specs, figures);
    this.init();
  }
  abstract init(): void;
  push(...builders: (new(t: T, u: U, p: P) => FigureBuilder<T, U, P>)[]): void{
    for(const builder of builders){
      this.builders.push(new builder(this.struct, this.specs, this.figures));
    }
  }
  initFigure(): this{
    this.builders.forEach(b => b.initFigure());
    return this;
  }
  buildOutline(): this{
    this.builders.forEach(b => b.buildOutline());
    return this;
  }
  buildDim(): this{
    this.builders.forEach(b => b.buildDim());
    return this;
  }
  buildNote(): this{
    return this;
  }
}