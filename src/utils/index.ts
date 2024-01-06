export interface ICard {
  id: number;
  tokens: number[];
}

export type TokensPerCardAmount = 4 | 8 | 12 | 14;

const generateTokenMatrix = (rowLenth: TokensPerCardAmount) => {
  const matrix: number[][] = [];

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

export const generateCards = (tokensPerCard: TokensPerCardAmount): ICard[] =>
  generateTokenMatrix(tokensPerCard).map((tokens, i) => ({ id: i, tokens }));
