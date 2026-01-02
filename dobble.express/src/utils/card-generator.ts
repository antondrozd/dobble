import type { Card, Token } from "../entities/index.ts";
import type { Cortege } from "../ts-utils.ts";
import { TOKENS_PER_CARD } from "../constants.ts";

const generateTokenMatrix = <L extends number>(tokensPerCard: L) => {
  const matrix: Token[][] = [];
  const n = tokensPerCard - 1;

  // First set: n+1 cards
  for (let i = 0; i <= n; i++) {
    const card = [0];
    for (let j = 1; j <= n; j++) {
      card.push(j + i * n);
    }
    matrix.push(card);
  }

  // Second set: n² cards
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const card = [i + 1];
      for (let k = 0; k < n; k++) {
        card.push(n + 1 + n * k + ((i * k + j) % n));
      }
      matrix.push(card);
    }
  }

  return matrix as Cortege<Token, L>[];
};

const generateCards = (): Card[] =>
  generateTokenMatrix(TOKENS_PER_CARD).map((tokens, id) => ({
    id,
    tokens,
  }));

export const allCards: Card[] = generateCards();
