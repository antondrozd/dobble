import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import type { Token } from "@dobble/shared/types";
import { WIN_SCORE, MAX_INT32 } from "@dobble/shared/constants";
import { getRandomCards, findMatchingToken } from "@dobble/shared/utils";
import type { GameState, PlayerSlot } from "./entities";

@Injectable()
export class GameService {
  private state: GameState;

  constructor() {
    this.state = this.createInitialState();
  }

  private createInitialState(): GameState {
    const [card1, card2, commonCard] = getRandomCards(3);

    return {
      slots: [
        {
          id: 1,
          playerId: null,
          name: null,
          socketId: null,
          card: card1,
          score: 0,
          currentCardMistakes: 0,
        },
        {
          id: 2,
          playerId: null,
          name: null,
          socketId: null,
          card: card2,
          score: 0,
          currentCardMistakes: 0,
        },
      ],
      commonCard,
      winner: null,
      isGameActive: false,
      seed: Math.floor(Math.random() * MAX_INT32),
    };
  }

  getSlotBySocketId(socketId: string): PlayerSlot | null {
    return this.state.slots.find((s) => s.socketId === socketId) ?? null;
  }

  getSlotByPlayerId(playerId: string): PlayerSlot | null {
    return this.state.slots.find((s) => s.playerId === playerId) ?? null;
  }

  joinPlayer(
    socketId: string,
    data: { name: string; playerId?: string },
  ): { slotId: number; playerId: string } | null {
    // Try to rejoin by playerId first
    if (data.playerId) {
      const existingSlot = this.state.slots.find(
        (s) => s.playerId === data.playerId,
      );
      if (existingSlot) {
        existingSlot.socketId = socketId;
        this.updateGameActive();
        return { slotId: existingSlot.id, playerId: existingSlot.playerId };
      }
    }

    // Join as new player
    const emptySlot = this.state.slots.find((s) => s.playerId === null);
    if (!emptySlot) {
      return null;
    }

    const newPlayerId = randomUUID();
    emptySlot.playerId = newPlayerId;
    emptySlot.name = data.name;
    emptySlot.socketId = socketId;

    this.updateGameActive();
    return { slotId: emptySlot.id, playerId: newPlayerId };
  }

  private updateGameActive(): void {
    const allConnected = this.state.slots.every((s) => s.socketId !== null);
    if (allConnected) {
      this.state.isGameActive = true;
    }
  }

  removePlayer(socketId: string): number | null {
    const slot = this.getSlotBySocketId(socketId);
    if (!slot) {
      return null;
    }

    slot.socketId = null;
    this.state.isGameActive = false;

    return slot.id;
  }

  handleAnswerAttempt(
    socketId: string,
    token: Token,
  ): { slotId: number; correct: boolean } | null {
    const slot = this.getSlotBySocketId(socketId);
    if (!slot || !this.state.isGameActive || this.state.winner) {
      return null;
    }

    const correctAnswer = findMatchingToken(slot.card, this.state.commonCard);
    if (token !== correctAnswer) {
      slot.currentCardMistakes += 1;
      if (slot.currentCardMistakes > 1 && slot.score > 0) {
        slot.score -= 1;
      }
      return { slotId: slot.id, correct: false };
    }

    slot.currentCardMistakes = 0;

    slot.score += 1;

    if (slot.score >= WIN_SCORE) {
      this.state.winner = slot.id;
      return { slotId: slot.id, correct: true };
    }

    const usedCardIds = this.state.slots.map((s) => s.card.id);
    usedCardIds.push(this.state.commonCard.id);

    const [newCard] = getRandomCards(1, usedCardIds);
    const oldPlayerCard = slot.card;

    slot.card = newCard;
    this.state.commonCard = oldPlayerCard;

    return { slotId: slot.id, correct: true };
  }

  reset(): void {
    const players = this.state.slots.map((s) => ({
      playerId: s.playerId,
      socketId: s.socketId,
      name: s.name,
    }));

    this.state = this.createInitialState();

    this.state.slots.forEach((slot, index) => {
      slot.playerId = players[index].playerId;
      slot.socketId = players[index].socketId;
      slot.name = players[index].name;
    });

    const allConnected = this.state.slots.every((s) => s.socketId !== null);
    this.state.isGameActive = allConnected;
  }

  getSlots(): PlayerSlot[] {
    return this.state.slots;
  }

  getState(): Readonly<GameState> {
    return this.state;
  }

  skip(socketId: string): Token {
    const slot = this.getSlotBySocketId(socketId);
    if (!slot) {
      return null;
    }

    if (slot.score > 0) {
      slot.score -= 1;
    }

    const matchingToken = findMatchingToken(slot.card, this.state.commonCard);
    const usedCardIds = this.state.slots.map((s) => s.card.id);
    usedCardIds.push(this.state.commonCard.id);

    const [newCard] = getRandomCards(1, usedCardIds);
    slot.card = newCard;
    slot.currentCardMistakes = 0;

    return matchingToken;
  }
}
