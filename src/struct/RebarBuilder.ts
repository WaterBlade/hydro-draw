export class IdGenerator {
  protected _id = 1;
  gen(): number {
    return this._id++;
  }
}

export abstract class RebarBuilder<T, U, P> {
  protected idGen = new IdGenerator();
  protected name = "";
  constructor(
    protected struct: T,
    protected rebars: U,
    protected figures: P,
  ) {}
  abstract buildRebar(): this;
  abstract buildFigure(): this;
  setIdGen(idGen: IdGenerator): this{
    this.idGen = idGen;
    return this;
  }
  setName(name: string): this{
    this.name = name;
    return this;
  }
  id(): string {
    return `${this.idGen.gen()}`;
  }
}

export abstract class CompositeRebarBuilder<T, U, P> 
  extends RebarBuilder< T, U, P > {
  protected builders: RebarBuilder<T, U, P>[] = [];
  constructor( struct: T, rebars: U, figures: P) {
    super(struct, rebars, figures);
    this.init();
  }
  push(...builders: RebarBuilder<T, U, P>[]): void {
    this.builders.push(...builders);
  }
  abstract init(): void;
  setIdGen(idGen: IdGenerator): this{
    this.idGen = idGen;
    this.builders.forEach(b => b.setIdGen(idGen));
    return this;
  }
  setName(name: string): this{
    this.name = name;
    this.builders.forEach(b => b.setName(name));
    return this;
  }
  buildRebar(): this {
    this.builders.forEach((f) => f.buildRebar());
    return this;
  }
  buildFigure(): this {
    this.builders.forEach((f) => f.buildFigure());
    return this;
  }
  build(): this{
    this.buildRebar();
    this.buildFigure();
    return this;
  }
}
