export interface HandleItem{
  handle: string;
}

export class HandleGenerator{
  protected index = 1;
  
  get handle(): string{
    return (this.index++).toString(16);
  }
}