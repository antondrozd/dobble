import { describe, it, expect } from "vitest";
import { generateCards, allCards } from "./card-generator";
import { TOKENS_PER_CARD } from "../constants";

describe("generateCards", () => {
  it("generates correct number of cards for tokensPerCard=8", () => {
    const cards = generateCards(8);
    // Formula: n² + n + 1 where n = tokensPerCard - 1
    // For 8: 7² + 7 + 1 = 57
    expect(cards).toHaveLength(57);
  });

  it("generates correct number of cards for tokensPerCard=4", () => {
    const cards = generateCards(4);
    // For 4: 3² + 3 + 1 = 13
    expect(cards).toHaveLength(13);
  });

  it("each card has correct number of tokens", () => {
    const cards = generateCards(8);
    for (const card of cards) {
      expect(card.tokens).toHaveLength(8);
    }
  });

  it("each card has unique id", () => {
    const cards = generateCards(8);
    const ids = cards.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each card has unique tokens (no duplicates within a card)", () => {
    const cards = generateCards(8);
    for (const card of cards) {
      expect(new Set(card.tokens).size).toBe(card.tokens.length);
    }
  });

  it("any two cards share exactly one token (Dobble property)", () => {
    const cards = generateCards(8);
    for (let i = 0; i < cards.length; i++) {
      for (let j = i + 1; j < cards.length; j++) {
        const shared = cards[i].tokens.filter((t) =>
          cards[j].tokens.includes(t)
        );
        expect(shared).toHaveLength(1);
      }
    }
  });
});

describe("allCards", () => {
  it("is generated with TOKENS_PER_CARD constant", () => {
    expect(allCards[0].tokens).toHaveLength(TOKENS_PER_CARD);
  });

  it("has correct number of cards", () => {
    const n = TOKENS_PER_CARD - 1;
    expect(allCards).toHaveLength(n * n + n + 1);
  });
});
