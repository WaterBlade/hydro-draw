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
