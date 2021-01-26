import { Side, StrecthSide } from "./Enum";

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

export function divideByCount(start: number, end: number, count: number): number[]{
  const d = (end-start)/count;
  const res = [];
  for(let i = 0; i < count+1; i++){
    res.push(start + i * d);
  }
  return res;
}

export function divideBySpace(start: number, end: number, space: number, side = StrecthSide.both, minimunRatio = 0.5): number[] {
  const res = [];
  const length = end - start;
  const count = Math.floor(Math.abs(length) / space);
  const minimun = minimunRatio * space;
  const d = end > start ? space : -space;
  res.push(start);
  if (count >= 2) {
    if (Math.abs(length) - count * space < 1e-6) {
      for (let i = 1; i < count; i++) {
        res.push(start + i * d);
      }
    } else if (side === StrecthSide.both) {
      const p1 = start + (length - (count - 1) * d) / 2;
      for (let i = 0; i < count; i++) {
        res.push(p1 + i * d);
      }
    } else {
      const spaceLeft = Math.abs(length) - count * space;
      const n = spaceLeft < minimun ? count : count + 1;
      if (side === StrecthSide.head) {
        const p1 = start + length - (n - 1) * d;
        for (let i = 0; i < n - 1; i++) {
          res.push(p1 + i * d);
        }
      } else {
        for (let i = 1; i < n; i++) {
          res.push(start + i * d);
        }
      }
    }
  }
  res.push(end);
  return res;
}