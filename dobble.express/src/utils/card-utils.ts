import type { Card, Token } from "../entities/index.ts";
import type { Cortege } from "../ts-utils.ts";
import { allCards } from "./card-generator.ts";

// Pick N random cards, excluding specific card IDs
export const getRandomCards = <L extends number>(
  count: L,
  excludeIds: number[] = []
) => {
  const available = allCards.filter((card) => !excludeIds.includes(card.id));

  if (available.length < count) {
    throw new Error("Not enough cards available");
  }

  const selected: Card[] = [];
  const usedIndexes = new Set<number>();

  while (selected.length < count) {
    const randomIndex = Math.floor(Math.random() * available.length);
    if (!usedIndexes.has(randomIndex)) {
      usedIndexes.add(randomIndex);
      selected.push(available[randomIndex]);
    }
  }

  return selected as Cortege<Card, L>;
};

// Find the one matching token between two cards
// (guaranteed to exist by projective plane property)
export const findMatchingToken = (card1: Card, card2: Card): Token => {
  for (const token of card1.tokens) {
    if (card2.tokens.includes(token)) {
      return token;
    }
  }

  throw new Error("No matching token found - invalid cards");
};
