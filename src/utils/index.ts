import * as R from "ramda";
import random from "random";

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

export const getRandomItemsSet = <T extends { id: number | string }>(
  amount: number,
  items: T[]
) => {
  const set: T[] = [];
  const excludeIDs: T["id"][] = [];

  if (amount > items.length) {
    throw new Error("Requested amount exceeds the number of available items");
  }

  for (let i = 0; i < amount; i++) {
    const item = R.reject(R.where({ id: R.includes(R.__, excludeIDs) }), items)[
      random.int(0, items.length - excludeIDs.length - 1)
    ];

    set.push(item);
    excludeIDs.push(item.id);
  }

  return set;
};

export const getRandomRotation = () => `${random.int(1, 360)}deg`;
