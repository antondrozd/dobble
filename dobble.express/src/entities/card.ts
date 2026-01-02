import type { Cortege } from "../ts-utils.ts";
import { TOKENS_PER_CARD } from "../constants.ts";

export type Token = number;

export type Card = {
  id: number;
  tokens: Cortege<Token, typeof TOKENS_PER_CARD>;
};
