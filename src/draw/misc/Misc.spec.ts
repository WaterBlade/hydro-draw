import { groupBy, sum } from "./Misc";

test("sum", () => {
  expect(sum(1, 2, 3, 4)).toEqual(10);
});

test("groupBy", () => {
  expect(groupBy([1, 1, 1, 2, 2, 3])).toEqual([[1, 1, 1], [2, 2], [3]]);
});
