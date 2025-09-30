import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";
import Engine, { Player } from "./engine";

// Mock the Engine class
vi.mock("./engine", () => {
	const mockEngine = {
		board: Array.from({ length: 6 }, (_, row) =>
			Array.from({ length: 7 }, (_, col) => ({ row, col, color: null })),
		),
		currentPlayer: 0, // Player.Red
		turn: 0,
		maxRows: 6,
		maxCols: 7,
		setPiece: vi.fn(),
		checkWin: vi.fn(),
	};
	return {
		default: vi.fn(() => mockEngine),
		Player: {
			Red: 0,
			Yellow: 1,
		},
	};
});

describe("App", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		render(<App />);
	});

	it("should render the game board and current player", () => {
		expect(screen.getByText("Connect Four")).toBeInTheDocument();
		// expect(screen.getByText(/Current Player: Red/i)).toBeInTheDocument();
		expect(screen.getAllByTestId(/cell-/)).toHaveLength(42); // 6 rows x 7 cols
	});

	// it("should show piece preview on column hover", async () => {
	// 	const cell = screen.getAllByTestId(/cell-/)[0]; // First cell in first column
	// 	fireEvent.mouseEnter(cell);
	// 	await waitFor(() => {
	// 		const preview = document.querySelector(".bg-red-500.rounded-full");
	// 		expect(preview).toBeInTheDocument();
	// 	});
	// });
	//
	// it("should show piece preview on header hover", async () => {
	// 	const header = screen.getByTestId("header-0"); // First column header
	// 	fireEvent.mouseEnter(header);
	// 	await waitFor(() => {
	// 		const preview = document.querySelector(".bg-red-500.rounded-full");
	// 		expect(preview).toBeInTheDocument();
	// 	});
	// });
	//
	// it("should hide piece preview on mouse leave", async () => {
	// 	const cell = screen.getAllByTestId(/cell-/)[0];
	// 	fireEvent.mouseEnter(cell);
	// 	fireEvent.mouseLeave(cell);
	// 	await waitFor(() => {
	// 		const preview = document.querySelector(".bg-red-500.rounded-full");
	// 		expect(preview).not.toBeInTheDocument();
	// 	});
	// });
	//
	// it("should call setPiece and switch player on cell click", async () => {
	// 	const mockEngine = vi.mocked(new Engine());
	// 	mockEngine.setPiece.mockReturnValue({
	// 		row: 5,
	// 		col: 0,
	// 		color: Player.Red,
	// 	});
	// 	mockEngine.checkWin.mockReturnValue(false);
	//
	// 	const cell = screen.getAllByTestId(/cell-/)[0]; // First cell in first column
	// 	fireEvent.click(cell);
	//
	// 	expect(mockEngine.setPiece).toHaveBeenCalledWith(0, Player.Red);
	// 	await waitFor(() => {
	// 		expect(
	// 			screen.getByText(/Current Player: Yellow/i),
	// 		).toBeInTheDocument();
	// 	});
	// });

	// it("should display win alert when checkWin returns true", async () => {
	// 	const mockEngine = vi.mocked(new Engine());
	// 	mockEngine.setPiece.mockReturnValue({
	// 		row: 5,
	// 		col: 0,
	// 		color: Player.Red,
	// 	});
	// 	mockEngine.checkWin.mockReturnValue(true);
	//
	// 	const cell = screen.getAllByTestId(/cell-/)[0];
	// 	fireEvent.click(cell);
	//
	// 	await waitFor(() => {
	// 		expect(screen.getByText(/Red wins!/i)).toBeInTheDocument();
	// 	});
	// });

	// it("should display draw alert when board is full", async () => {
	// 	const mockEngine = vi.mocked(new Engine());
	// 	mockEngine.setPiece.mockReturnValue({
	// 		row: 5,
	// 		col: 0,
	// 		color: Player.Red,
	// 	});
	// 	mockEngine.checkWin.mockReturnValue(false);
	// 	mockEngine.turn = 41; // Board almost full (6x7 = 42 cells)
	//
	// 	const cell = screen.getAllByTestId(/cell-/)[0];
	// 	fireEvent.click(cell);
	//
	// 	await waitFor(() => {
	// 		expect(screen.getByText(/It's a draw!/i)).toBeInTheDocument();
	// 	});
	// });

	it("should reset the game on reset button click", async () => {
		const mockEngine = vi.mocked(new Engine());
		mockEngine.setPiece.mockReturnValue({
			row: 5,
			col: 0,
			color: Player.Red,
		});
		mockEngine.checkWin.mockReturnValue(true);

		fireEvent.click(screen.getAllByTestId(/cell-/)[0]);
		fireEvent.click(screen.getByRole("button", { name: /Reset Game/i }));

		await waitFor(() => {
			const playerText = screen.getByText(/Current Player:/i);
			expect(playerText).toHaveTextContent(
				/Current Player: (Red|Yellow)/i,
			);
			expect(screen.queryByText(/Red wins!/i)).not.toBeInTheDocument();
		});
	});
});
