import { create } from "zustand";
import * as R from "ramda";

import { getRandomItemsSet } from "@/utils";
import { type ICard, cards, type Token } from "@/cards";
import { WIN_SCORE } from "@/constants";

export interface IPlayer {
  id: number;
  card: ICard;
  score: number;
  isHintShowing: boolean;
}

type AnswersMap = Record<IPlayer["id"], Token>;

interface IGameStore {
  players: IPlayer[];
  commonCard: ICard;
  answers: AnswersMap;
  winScore: number;
  winner: IPlayer["id"] | null;
  reset: () => void;
  setCommonCard: (card: ICard) => void;
  getPlayer: (playerID: IPlayer["id"]) => IPlayer;
  drawCard: (playerID: IPlayer["id"], card: ICard) => void;
  incrementScore: (playerID: IPlayer["id"]) => void;
  toggleHint: (playerID: IPlayer["id"]) => void;
}

const getPlayerIndex = (playerID: IPlayer["id"], players: IPlayer[]) =>
  R.findIndex(R.propEq(playerID, "id"), players);

const computeAnswers = (players: IPlayer[], commonCard: ICard): AnswersMap =>
  R.fromPairs(
    players.map(({ card, id }) => [
      id,
      R.intersection(card.tokens, commonCard.tokens)[0], // It's guaranteed by the game rules that the intersection will always have exactly one token
    ])
  );

const getInitialState = (): Pick<
  IGameStore,
  "answers" | "commonCard" | "players" | "winScore" | "winner"
> => {
  const [firstCard, secondCard, thirdCard] = getRandomItemsSet(3, cards);

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

export const useGame = create<IGameStore>((set, get) => ({
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

  incrementScore: (playerID) => {
    const { players, winScore } = get();
    const scoreLens = R.lensPath<IGameStore["players"]>([
      getPlayerIndex(playerID, players),
      "score",
    ]);
    const nextScore = R.inc(
      R.view<IPlayer[], IPlayer["score"]>(scoreLens, players)
    );

    set({ players: R.set(scoreLens, nextScore, players) });

    if (nextScore === winScore) {
      set({ winner: playerID });
    }
  },

  drawCard: (playerID, card) => {
    const { players } = get();
    const cardLens = R.lensPath<IGameStore["players"]>([
      getPlayerIndex(playerID, players),
      "card",
    ]);

    set({ players: R.set(cardLens, card, players) });
  },

  toggleHint: (playerID) => {
    const { players } = get();
    const hintLens = R.lensPath<IGameStore["players"]>([
      getPlayerIndex(playerID, players),
      "isHintShowing",
    ]);

    set({ players: R.over(hintLens, R.not, players) });
  },
}));
