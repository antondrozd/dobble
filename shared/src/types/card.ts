export type Token = number;

export type TokensPerCard = 4 | 8 | 12 | 14 | 18;

export type Card = {
  id: number;
  tokens: Token[];
};
