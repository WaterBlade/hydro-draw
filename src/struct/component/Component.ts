export class Component<T, U>{
  name = '';
  constructor(public struct: T, public specs: U){}
  setName(name: string): this{
    this.name = name;
    return this;
  }
}
