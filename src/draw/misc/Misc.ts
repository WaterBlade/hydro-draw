import { Side } from "./Enum";

export function toRadian(degree: number): number {
  return (degree * Math.PI) / 180;
}

export function toDegree(radian: number): number {
  return (radian * 180) / Math.PI;
}

export function sum(...variables: number[]): number {
  if (variables.length === 0) {
    return 0;
  }
  return variables.reduce((left, right) => left + right);
}

export function average(...variables: number[]): number {
  if (variables.length === 0) {
    return 0;
  }
  return sum(...variables) / variables.length;
}

export function last<T>(array: T[], index = 1): T {
  return array[array.length - index];
}

export function groupBy<T>(array: T[]): T[][] {
  const res: T[][] = [];
  let group: T[] = [];
  res.push(group);
  let current = array[0];
  for (const ele of array) {
    if (ele === current) {
      group.push(ele);
    } else {
      group = [];
      res.push(group);
      group.push(ele);
      current = ele;
    }
  }
  return res;
}

export function remainIf<T>(func: (item: T) => boolean, array: T[]): T[] {
  return array.reduce((res: T[], cur) => {
    if (func(cur)) res.push(cur);
    return res;
  }, []);
}

export function removeIf<T>(func: (item: T) => boolean, array: T[]): T[] {
  return array.reduce((res: T[], cur) => {
    if (!func(cur)) res.push(cur);
    return res;
  }, []);
}

export function removeDuplicate<T>(
  func: (left: T, right: T) => boolean,
  array: T[]
): T[] {
  const first = array[0];
  const res = [first];
  let prev = first;
  for (let i = 1; i < array.length; i++) {
    const curr = array[i];
    if (func(prev, curr)) continue;
    prev = curr;
    res.push(curr);
  }
  return res;
}

export function flip(side: Side): Side {
  if (side === Side.Left) return Side.Right;
  else return Side.Left;
}

export function angleMirrorByYAxis(angle: number): number {
  if (angle <= 180) return 180 - angle;
  return 540 - angle;
}

export function divide(left: number, right: number, count: number): number[]{
  const d = (right-left)/count;
  const res = [];
  for(let i = 0; i < count+1; i++){
    res.push(left + i * d);
  }
  return res;
}