import { create } from "zustand";
import * as R from "ramda";

import type { Card, Token } from "@dobble/shared/types";
import { WIN_SCORE } from "@dobble/shared/constants";
import { allCards } from "@dobble/shared/utils";
import { getRandomItemsSet } from "@/utils";

export type Player = {
  id: number;
  card: Card;
  score: number;
  isHintShowing: boolean;
};

type AnswersMap = Record<Player["id"], Token>;

type GameStore = {
  players: Player[];
  commonCard: Card;
  answers: AnswersMap;
  winScore: number;
  winner: Player["id"] | null;
  reset: () => void;
  setCommonCard: (card: Card) => void;
  getPlayer: (playerID: Player["id"]) => Player;
  drawCard: (playerID: Player["id"], card: Card) => void;
  decrementScore: (playerID: Player["id"]) => void;
  incrementScore: (playerID: Player["id"]) => void;
  toggleHint: (playerID: Player["id"]) => void;
};

const getPlayerIndex = (playerID: Player["id"], players: Player[]) =>
  R.findIndex(R.propEq(playerID, "id"), players);

const computeAnswers = (players: Player[], commonCard: Card): AnswersMap =>
  R.fromPairs(
    players.map(({ card, id }) => [
      id,
      R.intersection(card.tokens, commonCard.tokens)[0], // It's guaranteed by the game rules that the intersection will always have exactly one token
    ])
  );

const getInitialState = (): Pick<
  GameStore,
  "answers" | "commonCard" | "players" | "winScore" | "winner"
> => {
  const [firstCard, secondCard, thirdCard] = getRandomItemsSet(3, allCards);

  const players = [
    { card: firstCard, id: 1, isHintShowing: false, score: 0 },
    { card: secondCard, id: 2, isHintShowing: false, score: 0 },
  ];

  return {
    players,
    commonCard: thirdCard,
    answers: computeAnswers(players, thirdCard),
    winScore: WIN_SCORE,
    winner: null,
  };
};

export const useGame = create<GameStore>((set, get) => ({
  ...getInitialState(),

  reset: () => {
    set(getInitialState());
  },

  setCommonCard: (newCommonCard) => {
    const { players } = get();

    set({
      answers: computeAnswers(players, newCommonCard),
    });
    set({ commonCard: newCommonCard });
  },

  getPlayer: (playerID) => {
    const player = R.find(R.propEq(playerID, "id"), get().players);

    if (!player) {
      throw new Error(`Player with ID [${playerID}] does not exist`);
    }

    return player;
  },

  decrementScore: (playerID) => {
    const { players } = get();
    const scoreLens = R.lensPath<GameStore["players"]>([
      getPlayerIndex(playerID, players),
      "score",
    ]);
    const nextScore = R.dec(
      R.view<Player[], Player["score"]>(scoreLens, players)
    );

    set({ players: R.set(scoreLens, nextScore, players) });
  },

  incrementScore: (playerID) => {
    const { players, winScore } = get();
    const scoreLens = R.lensPath<GameStore["players"]>([
      getPlayerIndex(playerID, players),
      "score",
    ]);
    const nextScore = R.inc(
      R.view<Player[], Player["score"]>(scoreLens, players)
    );

    set({ players: R.set(scoreLens, nextScore, players) });

    if (nextScore === winScore) {
      set({ winner: playerID });
    }
  },

  drawCard: (playerID, card) => {
    const { players } = get();
    const cardLens = R.lensPath<GameStore["players"]>([
      getPlayerIndex(playerID, players),
      "card",
    ]);

    set({ players: R.set(cardLens, card, players) });
  },

  toggleHint: (playerID) => {
    const { players } = get();
    const hintLens = R.lensPath<GameStore["players"]>([
      getPlayerIndex(playerID, players),
      "isHintShowing",
    ]);

    set({ players: R.over(hintLens, R.not, players) });
  },
}));
