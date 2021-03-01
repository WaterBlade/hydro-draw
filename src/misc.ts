export class Required<T>{
  constructor(private name: string){}
  private value?: T;
  get val(): T{
    if(this.value === undefined) throw Error(`${this.name} not init`);
    return this.value;
  }
  set val(value: T){
    this.value = value;
  }
}

export class SafeArray<T> extends Array<T>{
  get(index: number): T{
    if(index > this.length - 1){
      throw Error(`array index overflow! index is ${index}, array length is ${this.length}`);
    } 
    return this[index];
  }
}

export function getSafe<T>(index: number, array: Array<T>): T{
    if(index > array.length - 1){
      throw Error(`array index overflow! index is ${index}, array length is ${array.length}`);
    } 
    return array[index];
}