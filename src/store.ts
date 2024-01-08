import { create } from "zustand";
import * as R from "ramda";

import { type ICard } from "./utils";

export interface IPlayer {
  id: number;
  card: ICard | null;
  score: number;
  isHintShowing: boolean;
}

interface IGameStore {
  players: IPlayer[];
  commonCard: ICard | null;
  setCommonCard: (card: ICard) => void;
  answers: Record<IPlayer["id"], number>;
  getPlayer: (playerID: IPlayer["id"]) => IPlayer;
  drawCard: (playerID: IPlayer["id"], card: ICard) => void;
  incrementScore: (playerID: IPlayer["id"]) => void;
  toggleHint: (playerID: IPlayer["id"]) => void;
}

const getPlayerIndex = (playerID: IPlayer["id"], players: IPlayer[]) =>
  R.findIndex(R.propEq(playerID, "id"), players);

export const useGame = create<IGameStore>((set, get) => ({
  players: [
    { card: null, id: 1, isHintShowing: false, score: 0 },
    { card: null, id: 2, isHintShowing: false, score: 0 },
  ],
  commonCard: null,
  answers: {},

  setCommonCard: (newCommonCard) => {
    const { players } = get();

    set({
      answers: R.fromPairs(
        players.map(({ card, id }) => [
          id,
          R.intersection(card?.tokens ?? [], newCommonCard?.tokens ?? [])[0],
        ])
      ),
    });
    set({ commonCard: newCommonCard });
  },

  getPlayer: (playerID) => R.find(R.propEq(playerID, "id"), get().players)!, // TODO

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
