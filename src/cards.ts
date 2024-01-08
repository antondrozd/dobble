import { TOKENS_PER_CARD } from "./constants";

export type Token = number;

export interface ICard {
  id: number;
  tokens: Token[];
}

export type TokensPerCard = 4 | 8 | 12 | 14 | 18;

const generateTokenMatrix = (rowLenth: TokensPerCard) => {
  const matrix: Token[][] = [];

  const n = rowLenth - 1;

  for (let i = 0; i <= n; i++) {
    const card = [0];

    for (let j = 1; j <= n; j++) {
      card.push(j + i * n);
    }

    matrix.push(card);
  }

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

export const generateCards = (tokensPerCard: TokensPerCard): ICard[] =>
  generateTokenMatrix(tokensPerCard).map((tokens, i) => ({ id: i, tokens }));

export const cards = generateCards(TOKENS_PER_CARD);
