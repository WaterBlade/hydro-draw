export class IdGenerator {
  protected _id = 1;
  gen(): number {
    return this._id++;
  }
}

export abstract class RebarBuilder<T, U, P> {
  idGen = new IdGenerator();
  name = "";
  constructor(
    protected struct: T,
    protected specs: U,
    protected figures: P,
  ) {}
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
  abstract buildSpec(): this;
  abstract buildFigure(): this;
  buildPos(): this{
    return this;
  }
}

export abstract class CompositeRebarBuilder<T, U, P> 
  extends RebarBuilder< T, U, P > {
  protected builders: RebarBuilder<T, U, P>[] = [];
  constructor( struct: T, rebars: U, figures: P) {
    super(struct, rebars, figures);
    this.init();
  }
  abstract init(): void;
  push(...builders: (new(t: T, u: U, p: P) => RebarBuilder<T, U, P>)[]): void{
    for(const builder of builders){
      this.builders.push(new builder(this.struct, this.specs, this.figures));
    }
  }
  build(): this {
    this.buildSpec();
    this.buildPos();
    this.buildFigure();
    return this;
  }
  buildSpec(): this{
    this.builders.forEach(b => b.buildSpec());
    return this;
  }
  buildPos(): this{
    this.builders.forEach(b => b.buildPos());
    return this;
  }
  buildFigure(): this{
    this.builders.forEach(b => b.buildFigure());
    return this;
  }
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
}
