import type { GameState, PlayerSlot, Token } from "../entities/index.ts";
import type { GameStateDto } from "../dto/index.ts";
import { WIN_SCORE } from "../constants.ts";
import { getRandomCards, findMatchingToken } from "../utils/index.ts";
import { mapGameStateToDto } from "../gateways/game.mapper.ts";

export class GameService {
  private state: GameState;

  constructor() {
    this.state = this.createInitialState();
  }

  private createInitialState(): GameState {
    const [card1, card2, commonCard] = getRandomCards(3);

    return {
      slots: [
        { id: 1, socketId: null, card: card1, score: 0 },
        { id: 2, socketId: null, card: card2, score: 0 },
      ],
      commonCard,
      winner: null,
      isGameActive: false,
    };
  }

  getSlotBySocketId(socketId: string): PlayerSlot | null {
    return this.state.slots.find((s) => s.socketId === socketId) ?? null;
  }

  addPlayer(socketId: string): number | null {
    const emptySlot = this.state.slots.find((s) => s.socketId === null);
    if (!emptySlot) {
      return null;
    }

    emptySlot.socketId = socketId;

    const allConnected = this.state.slots.every((s) => s.socketId !== null);
    if (allConnected) {
      this.state.isGameActive = true;
    }

    return emptySlot.id;
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

  handleAnswerAttempt(socketId: string, token: Token): number | null {
    const slot = this.getSlotBySocketId(socketId);
    if (!slot || !this.state.isGameActive || this.state.winner) {
      return null;
    }

    const correctAnswer = findMatchingToken(slot.card, this.state.commonCard);
    if (token !== correctAnswer) {
      return null;
    }

    slot.score += 1;

    if (slot.score >= WIN_SCORE) {
      this.state.winner = slot.id;
      return slot.id;
    }

    const usedCardIds = this.state.slots.map((s) => s.card.id);
    usedCardIds.push(this.state.commonCard.id);

    const [newCard] = getRandomCards(1, usedCardIds);
    const oldPlayerCard = slot.card;

    slot.card = newCard;
    this.state.commonCard = oldPlayerCard;

    return slot.id;
  }

  reset(): void {
    const socketIds = this.state.slots.map((s) => s.socketId);

    this.state = this.createInitialState();

    this.state.slots.forEach((slot, index) => {
      slot.socketId = socketIds[index];
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

  // getClientState(socketId: string): GameStateDto | null {
  //   const slot = this.getSlotBySocketId(socketId);
  //   if (!slot) {
  //     return null;
  //   }

  //   return mapGameStateToDto(this.state, slot.id);
  // }

  getHint(socketId: string): Token | null {
    const slot = this.getSlotBySocketId(socketId);
    if (!slot) {
      return null;
    }

    slot.score -= 1;

    return findMatchingToken(slot.card, this.state.commonCard);
  }
}
