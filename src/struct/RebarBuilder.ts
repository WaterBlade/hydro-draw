export class IdGenerator {
  protected _id = 1;
  gen(): number {
    return this._id++;
  }
}

export function item<T, U, P, Q extends RebarBuilder<T, U, P>>(builder: {new(t: T, u: U, p: P): Q}, composite: CompositeRebarBuilder<T, U, P>): Q{
  const i = new builder(composite.struct, composite.rebars, composite.figures);
  composite.push(i);
  i.setIdGen(composite.idGen);
  if(composite.name !== '') i.setName(composite.name);
  return i;
}

export abstract class RebarBuilder<T, U, P> {
  idGen = new IdGenerator();
  name = "";
  constructor(
    public struct: T,
    public rebars: U,
    public figures: P,
  ) {}
  abstract build(): this;
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
  }
  push(...builders: RebarBuilder<T, U, P>[]): void {
    this.builders.push(...builders);
  }
  build(): this {
    this.builders.forEach((f) => f.build());
    return this;
  }
  setIdGen(idGen: IdGenerator): this{
    this.builders.forEach(b => b.setIdGen(idGen));
    return this;
  }
  setName(name: string): this{
    this.builders.forEach(b => b.setName(name));
    return this;
  }
}
