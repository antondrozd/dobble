import { describe, it, expect } from "vitest";
import { getRandomCards, findMatchingToken } from "./card-utils";
import { allCards } from "./card-generator";
import type { Card } from "../types/card";

describe("getRandomCards", () => {
  it("returns requested number of cards", () => {
    const cards = getRandomCards(5);
    expect(cards).toHaveLength(5);
  });

  it("returns unique cards", () => {
    const cards = getRandomCards(10);
    const ids = cards.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("excludes specified card ids", () => {
    const excludeIds = [0, 1, 2, 3, 4];
    const cards = getRandomCards(5, excludeIds);

    for (const card of cards) {
      expect(excludeIds).not.toContain(card.id);
    }
  });

  it("throws when requesting more cards than available", () => {
    expect(() => getRandomCards(100)).toThrow("Not enough cards available");
  });

  it("throws when excluding too many cards", () => {
    const excludeIds = allCards.map((c) => c.id).slice(0, -2); // exclude all but 2
    expect(() => getRandomCards(5, excludeIds)).toThrow(
      "Not enough cards available"
    );
  });

  it("returns cards from allCards", () => {
    const cards = getRandomCards(5);
    const allCardIds = allCards.map((c) => c.id);

    for (const card of cards) {
      expect(allCardIds).toContain(card.id);
    }
  });
});

describe("findMatchingToken", () => {
  it("finds matching token between two cards", () => {
    const card1 = allCards[0];
    const card2 = allCards[1];

    const match = findMatchingToken(card1, card2);

    expect(card1.tokens).toContain(match);
    expect(card2.tokens).toContain(match);
  });

  it("works for any pair of cards", () => {
    // Test several random pairs
    for (let i = 0; i < 10; i++) {
      const [card1, card2] = getRandomCards(2);
      const match = findMatchingToken(card1, card2);

      expect(card1.tokens).toContain(match);
      expect(card2.tokens).toContain(match);
    }
  });

  it("throws for cards with no matching token", () => {
    const fakeCard1: Card = { id: 999, tokens: [100, 101, 102] };
    const fakeCard2: Card = { id: 998, tokens: [200, 201, 202] };

    expect(() => findMatchingToken(fakeCard1, fakeCard2)).toThrow(
      "No matching token found"
    );
  });

  it("returns the first matching token when multiple exist", () => {
    const fakeCard1: Card = { id: 999, tokens: [1, 2, 3] };
    const fakeCard2: Card = { id: 998, tokens: [1, 2, 4] };

    // Should return 1 (first match)
    expect(findMatchingToken(fakeCard1, fakeCard2)).toBe(1);
  });
});
