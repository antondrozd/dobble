import { describe, it, expect, beforeEach } from "vitest";
import random from "random";
import { getTotalTokensAmount, getRandomItemsSet, getRandomRotation } from ".";

describe("getTotalTokensAmount", () => {
  it("calculates correct amount for 8 tokens per card", () => {
    // Formula: n^2 - n + 1 = 8^2 - 8 + 1 = 57
    expect(getTotalTokensAmount(8)).toBe(57);
  });

  it("calculates correct amount for 3 tokens per card", () => {
    // Formula: 3^2 - 3 + 1 = 7
    expect(getTotalTokensAmount(3)).toBe(7);
  });

  it("calculates correct amount for 4 tokens per card", () => {
    // Formula: 4^2 - 4 + 1 = 13
    expect(getTotalTokensAmount(4)).toBe(13);
  });
});

describe("getRandomItemsSet", () => {
  const items = [
    { id: 1, name: "a" },
    { id: 2, name: "b" },
    { id: 3, name: "c" },
    { id: 4, name: "d" },
    { id: 5, name: "e" },
  ];

  beforeEach(() => {
    random.use("test-seed" as unknown as random.Engine);
  });

  it("returns requested number of items", () => {
    const result = getRandomItemsSet(3, items);
    expect(result).toHaveLength(3);
  });

  it("returns unique items", () => {
    const result = getRandomItemsSet(4, items);
    const ids = result.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("throws when requesting more items than available", () => {
    expect(() => getRandomItemsSet(10, items)).toThrow(
      "Requested amount exceeds the number of available items"
    );
  });

  it("returns all items when requesting exact count", () => {
    const result = getRandomItemsSet(5, items);
    expect(result).toHaveLength(5);
    const ids = result.map((item) => item.id);
    expect(ids.sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it("works with string ids", () => {
    const stringItems = [
      { id: "a", value: 1 },
      { id: "b", value: 2 },
      { id: "c", value: 3 },
    ];
    const result = getRandomItemsSet(2, stringItems);
    expect(result).toHaveLength(2);
  });
});

describe("getRandomRotation", () => {
  it("returns a string ending with deg", () => {
    const rotation = getRandomRotation();
    expect(rotation).toMatch(/^\d+deg$/);
  });

  it("returns rotation between 1 and 360", () => {
    for (let i = 0; i < 20; i++) {
      const rotation = getRandomRotation();
      const degrees = parseInt(rotation.replace("deg", ""));
      expect(degrees).toBeGreaterThanOrEqual(1);
      expect(degrees).toBeLessThanOrEqual(360);
    }
  });
});
