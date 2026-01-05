import type { Card, Token, TokensPerCard } from "../types/card";
import { TOKENS_PER_CARD } from "../constants";

const generateTokenMatrix = (tokensPerCard: TokensPerCard): Token[][] => {
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

  return matrix;
};

export const generateCards = (tokensPerCard: TokensPerCard): Card[] =>
  generateTokenMatrix(tokensPerCard).map((tokens, id) => ({
    id,
    tokens,
  }));

export const allCards: Card[] = generateCards(TOKENS_PER_CARD);
