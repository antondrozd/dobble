import type { Card, Token } from "../types/card";
import { allCards } from "./card-generator";

export const getRandomCards = (
  count: number,
  excludeIds: number[] = []
): Card[] => {
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

  return selected;
};

export const findMatchingToken = (card1: Card, card2: Card): Token => {
  for (const token of card1.tokens) {
    if (card2.tokens.includes(token)) {
      return token;
      console.log();
    }
  }

  throw new Error("No matching token found - invalid cards");
};
