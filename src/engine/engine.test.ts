import { describe, it, expect, beforeEach } from "vitest";
import Engine, { Player, type Cell } from ".";

describe("Engine", () => {
	let engine: Engine;

	beforeEach(() => {
		engine = new Engine();
	});

	describe("setPiece", () => {
		it("should place a piece in the bottom-most empty cell of a column", () => {
			const cell = engine.setPiece(0, Player.Red);
			expect(cell).toEqual({ row: 5, col: 0, color: Player.Red });
			expect(engine.board[5][0].color).toBe(Player.Red);
		});

		it("should place a piece above an existing piece in the same column", () => {
			engine.setPiece(0, Player.Red);
			const cell = engine.setPiece(0, Player.Yellow);
			expect(cell).toEqual({ row: 4, col: 0, color: Player.Yellow });
			expect(engine.board[4][0].color).toBe(Player.Yellow);
		});

		it("should return null for a full column", () => {
			for (let i = 0; i < 6; i++) {
				engine.setPiece(0, Player.Red);
			}
			const cell = engine.setPiece(0, Player.Yellow);
			expect(cell).toBeNull();
		});

		it("should return null for an invalid column", () => {
			const cell = engine.setPiece(7, Player.Red);
			expect(cell).toBeNull();
		});
	});

	describe("checkWin", () => {
		it("should return false for an empty cell", () => {
			const cell: Cell = { row: 0, col: 0, color: null };
			expect(engine.checkWin(cell)).toBe(false);
		});

		it("should detect a horizontal win", () => {
			engine.board[5][0].color = Player.Red;
			engine.board[5][1].color = Player.Red;
			engine.board[5][2].color = Player.Red;
			engine.board[5][3].color = Player.Red;
			const cell: Cell = { row: 5, col: 3, color: Player.Red };
			expect(engine.checkWin(cell)).toBe(true);
		});

		it("should detect a vertical win", () => {
			engine.board[5][0].color = Player.Yellow;
			engine.board[4][0].color = Player.Yellow;
			engine.board[3][0].color = Player.Yellow;
			engine.board[2][0].color = Player.Yellow;
			const cell: Cell = { row: 2, col: 0, color: Player.Yellow };
			expect(engine.checkWin(cell)).toBe(true);
		});

		it("should detect a diagonal win (top-left to bottom-right)", () => {
			engine.board[5][0].color = Player.Red;
			engine.board[4][1].color = Player.Red;
			engine.board[3][2].color = Player.Red;
			engine.board[2][3].color = Player.Red;
			const cell: Cell = { row: 2, col: 3, color: Player.Red };
			expect(engine.checkWin(cell)).toBe(true);
		});

		it("should detect an anti-diagonal win (top-right to bottom-left)", () => {
			engine.board[5][3].color = Player.Yellow;
			engine.board[4][2].color = Player.Yellow;
			engine.board[3][1].color = Player.Yellow;
			engine.board[2][0].color = Player.Yellow;
			const cell: Cell = { row: 2, col: 0, color: Player.Yellow };
			expect(engine.checkWin(cell)).toBe(true);
		});

		it("should return false for less than four in a row", () => {
			engine.board[5][0].color = Player.Red;
			engine.board[5][1].color = Player.Red;
			engine.board[5][2].color = Player.Red;
			const cell: Cell = { row: 5, col: 2, color: Player.Red };
			expect(engine.checkWin(cell)).toBe(false);
		});
	});
});
