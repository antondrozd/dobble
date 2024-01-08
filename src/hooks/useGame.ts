import { create } from "zustand";
import * as R from "ramda";

import { type Token, type ICard, getRandomCardsSet } from "../utils";
import { cards } from "../cards";

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
  setCommonCard: (card: ICard) => void;
  answers: AnswersMap;
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
  "answers" | "commonCard" | "players"
> => {
  const [firstCard, secondCard, thirdCard] = getRandomCardsSet(3, cards);

  const players = [
    { card: firstCard, id: 1, isHintShowing: false, score: 0 },
    { card: secondCard, id: 2, isHintShowing: false, score: 0 },
  ];

  return {
    players,
    commonCard: thirdCard,
    answers: computeAnswers(players, thirdCard),
  };
};

export const useGame = create<IGameStore>((set, get) => ({
  ...getInitialState(),

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
    const { players } = get();
    const scoreLens = R.lensPath<IGameStore["players"]>([
      getPlayerIndex(playerID, players),
      "score",
    ]);

    set({ players: R.over(scoreLens, R.inc, players) });
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
