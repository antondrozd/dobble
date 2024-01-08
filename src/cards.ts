import { TOKENS_PER_CARD } from "./constants";
import { createRandomCardSelector, generateCards } from "./utils";

export const cards = generateCards(TOKENS_PER_CARD);
export const getRandomCard = createRandomCardSelector(cards);
