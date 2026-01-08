import { describe, it, expect, beforeEach } from "vitest";
import { GameService } from "./game.service";
import { findMatchingToken } from "@dobble/shared/utils";
import { WIN_SCORE } from "@dobble/shared/constants";

describe("GameService", () => {
  let service: GameService;

  beforeEach(() => {
    service = new GameService();
  });

  describe("initial state", () => {
    it("creates two player slots", () => {
      const slots = service.getSlots();
      expect(slots).toHaveLength(2);
    });

    it("slots have no connected players initially", () => {
      const slots = service.getSlots();
      expect(slots[0].socketId).toBeNull();
      expect(slots[1].socketId).toBeNull();
    });

    it("game is not active initially", () => {
      const state = service.getState();
      expect(state.isGameActive).toBe(false);
    });

    it("has no winner initially", () => {
      const state = service.getState();
      expect(state.winner).toBeNull();
    });
  });

  describe("addPlayer", () => {
    it("assigns player to first empty slot", () => {
      const slotId = service.addPlayer("socket-1", "Player 1");
      expect(slotId).toBe(1);

      const slot = service.getSlotBySocketId("socket-1");
      expect(slot).not.toBeNull();
      expect(slot?.id).toBe(1);
    });

    it("assigns second player to second slot", () => {
      service.addPlayer("socket-1", "Player 1");
      const slotId = service.addPlayer("socket-2", "Player 2");
      expect(slotId).toBe(2);
    });

    it("activates game when both players connected", () => {
      service.addPlayer("socket-1", "Player 1");
      expect(service.getState().isGameActive).toBe(false);

      service.addPlayer("socket-2", "Player 2");
      expect(service.getState().isGameActive).toBe(true);
    });

    it("returns null when room is full", () => {
      service.addPlayer("socket-1", "Player 1");
      service.addPlayer("socket-2", "Player 2");
      const result = service.addPlayer("socket-3", "Player 3");
      expect(result).toBeNull();
    });

    it("stores player name in slot", () => {
      service.addPlayer("socket-1", "Alice");
      const slot = service.getSlotBySocketId("socket-1");
      expect(slot?.name).toBe("Alice");
    });
  });

  describe("removePlayer", () => {
    it("removes player from slot", () => {
      service.addPlayer("socket-1", "Player 1");
      service.removePlayer("socket-1");

      const slot = service.getSlotBySocketId("socket-1");
      expect(slot).toBeNull();
    });

    it("deactivates game when player leaves", () => {
      service.addPlayer("socket-1", "Player 1");
      service.addPlayer("socket-2", "Player 2");
      expect(service.getState().isGameActive).toBe(true);

      service.removePlayer("socket-1");
      expect(service.getState().isGameActive).toBe(false);
    });

    it("returns slot id when player removed", () => {
      service.addPlayer("socket-1", "Player 1");
      const result = service.removePlayer("socket-1");
      expect(result).toBe(1);
    });

    it("returns null when socket not found", () => {
      const result = service.removePlayer("unknown-socket");
      expect(result).toBeNull();
    });
  });

  describe("handleAnswerAttempt", () => {
    beforeEach(() => {
      service.addPlayer("socket-1", "Player 1");
      service.addPlayer("socket-2", "Player 2");
    });

    it("returns null if game not active", () => {
      service.removePlayer("socket-2");
      const state = service.getState();
      const slot = service.getSlotBySocketId("socket-1")!;
      const correctToken = findMatchingToken(slot.card, state.commonCard);

      const result = service.handleAnswerAttempt("socket-1", correctToken);
      expect(result).toBeNull();
    });

    it("returns correct: false for wrong answer", () => {
      const result = service.handleAnswerAttempt("socket-1", -999);
      expect(result).toEqual({ slotId: 1, correct: false });
    });

    it("does not decrement score on first wrong answer (free mistake)", () => {
      const slot = service.getSlotBySocketId("socket-1")!;
      slot.score = 3;

      service.handleAnswerAttempt("socket-1", -999);
      expect(slot.score).toBe(3);
    });

    it("decrements score on second wrong answer", () => {
      const slot = service.getSlotBySocketId("socket-1")!;
      slot.score = 3;

      service.handleAnswerAttempt("socket-1", -999); // free mistake
      service.handleAnswerAttempt("socket-1", -999); // score decreases
      expect(slot.score).toBe(2);
    });

    it("does not decrement score below zero on wrong answer", () => {
      const slot = service.getSlotBySocketId("socket-1")!;
      expect(slot.score).toBe(0);

      service.handleAnswerAttempt("socket-1", -999); // free mistake
      service.handleAnswerAttempt("socket-1", -999); // would decrement, but already 0
      expect(slot.score).toBe(0);
    });

    it("resets currentCardMistakes after correct answer", () => {
      const slot = service.getSlotBySocketId("socket-1")!;
      const state = service.getState();
      slot.score = 3;

      service.handleAnswerAttempt("socket-1", -999); // first mistake
      expect(slot.currentCardMistakes).toBe(1);

      const correctToken = findMatchingToken(slot.card, state.commonCard);
      service.handleAnswerAttempt("socket-1", correctToken); // correct answer

      expect(slot.currentCardMistakes).toBe(0);
    });

    it("increments score for correct answer", () => {
      const state = service.getState();
      const slot = service.getSlotBySocketId("socket-1")!;
      const correctToken = findMatchingToken(slot.card, state.commonCard);

      expect(slot.score).toBe(0);
      service.handleAnswerAttempt("socket-1", correctToken);
      expect(slot.score).toBe(1);
    });

    it("swaps cards after correct answer", () => {
      const state = service.getState();
      const slot = service.getSlotBySocketId("socket-1")!;
      const oldPlayerCard = slot.card;
      const correctToken = findMatchingToken(slot.card, state.commonCard);

      service.handleAnswerAttempt("socket-1", correctToken);

      expect(state.commonCard).toEqual(oldPlayerCard);
      expect(slot.card).not.toEqual(oldPlayerCard);
    });

    it("sets winner when score reaches WIN_SCORE", () => {
      const slot = service.getSlotBySocketId("socket-1")!;
      slot.score = WIN_SCORE - 1;

      const state = service.getState();
      const correctToken = findMatchingToken(slot.card, state.commonCard);

      service.handleAnswerAttempt("socket-1", correctToken);
      expect(state.winner).toBe(1);
    });
  });

  describe("skip", () => {
    beforeEach(() => {
      service.addPlayer("socket-1", "Player 1");
      service.addPlayer("socket-2", "Player 2");
    });

    it("returns correct matching token", () => {
      const state = service.getState();
      const slot = service.getSlotBySocketId("socket-1")!;
      const expected = findMatchingToken(slot.card, state.commonCard);

      const token = service.skip("socket-1");
      expect(token).toBe(expected);
    });

    it("decrements score when score is positive", () => {
      const slot = service.getSlotBySocketId("socket-1")!;
      slot.score = 3;

      service.skip("socket-1");
      expect(slot.score).toBe(2);
    });

    it("does not decrement score below zero", () => {
      const slot = service.getSlotBySocketId("socket-1")!;
      expect(slot.score).toBe(0);

      service.skip("socket-1");
      expect(slot.score).toBe(0);
    });

    it("assigns a new card to the player", () => {
      const slot = service.getSlotBySocketId("socket-1")!;
      const oldCard = slot.card;

      service.skip("socket-1");
      expect(slot.card).not.toEqual(oldCard);
    });

    it("does not change the common card", () => {
      const state = service.getState();
      const oldCommonCard = state.commonCard;

      service.skip("socket-1");
      expect(state.commonCard).toEqual(oldCommonCard);
    });

    it("returns null for unknown socket", () => {
      const token = service.skip("unknown");
      expect(token).toBeNull();
    });
  });

  describe("reset", () => {
    it("resets scores to zero", () => {
      service.addPlayer("socket-1", "Player 1");
      service.addPlayer("socket-2", "Player 2");

      const slot = service.getSlotBySocketId("socket-1")!;
      slot.score = 10;

      service.reset();
      expect(service.getSlotBySocketId("socket-1")?.score).toBe(0);
    });

    it("preserves connected players", () => {
      service.addPlayer("socket-1", "Player 1");
      service.addPlayer("socket-2", "Player 2");

      service.reset();

      expect(service.getSlotBySocketId("socket-1")).not.toBeNull();
      expect(service.getSlotBySocketId("socket-2")).not.toBeNull();
    });

    it("clears winner", () => {
      service.addPlayer("socket-1", "Player 1");
      service.addPlayer("socket-2", "Player 2");

      const slot = service.getSlotBySocketId("socket-1")!;
      slot.score = WIN_SCORE - 1;
      const state = service.getState();
      const token = findMatchingToken(slot.card, state.commonCard);
      service.handleAnswerAttempt("socket-1", token);

      expect(service.getState().winner).not.toBeNull();

      service.reset();
      expect(service.getState().winner).toBeNull();
    });
  });
});
