import { useState } from "react";
import Engine, { Player } from "./engine";
import { Button } from "./components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "./components/ui/alert";

function App() {
	// Game engine and state management
	const [engine, setEngine] = useState(new Engine());
	const [gameState, setGameState] = useState<{
		winner: Player | null;
		isDraw: boolean;
	}>({ winner: null, isDraw: false });
	const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);

	// Handles column click to place a piece
	const handleColumnClick = (col: number) => {
		if (gameState.winner !== null || gameState.isDraw) return; // Ignore if game is over

		const cell = engine.setPiece(col, engine.currentPlayer);
		if (cell) {
			const hasWon = engine.checkWin(cell);
			const isDraw = engine.turn >= Engine.maxRows * Engine.maxCols - 1;

			setGameState({
				winner: hasWon ? engine.currentPlayer : null,
				isDraw: !hasWon && isDraw,
			});

			if (!hasWon && !isDraw) {
				// Switch player and increment turn
				engine.currentPlayer =
					engine.currentPlayer === Player.Red
						? Player.Yellow
						: Player.Red;
				engine.turn++;
			}

			// Update engine with new state
			setEngine(
				new Engine(engine.board, engine.currentPlayer, engine.turn),
			);
		}
	};

	// Resets game to initial state
	const handleReset = () => {
		setEngine(new Engine());
		setGameState({ winner: null, isDraw: false });
		setHoveredColumn(null);
	};

	// Tracks column hover for preview
	const handleMouseEnter = (col: number) => {
		if (!gameState.winner && !gameState.isDraw) {
			setHoveredColumn(col);
		}
	};

	const handleMouseLeave = () => {
		setHoveredColumn(null);
	};

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
			<Card className="w-full max-w-3xl">
				<CardHeader>
					<CardTitle className="text-3xl text-center">
						Connect Four
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="mb-4 text-center">
						{/* Display current player */}
						<p className="text-lg">
							Current Player:{" "}
							<span
								className={`font-bold ${
									engine.currentPlayer === Player.Red
										? "text-red-500"
										: "text-yellow-500"
								}`}
							>
								{engine.currentPlayer === Player.Red
									? "Red"
									: "Yellow"}
							</span>
						</p>
						{/* Display game result */}
						{gameState.winner !== null && (
							<Alert className="mt-4">
								<AlertTitle>Game Over!</AlertTitle>
								<AlertDescription>
									{gameState.winner === Player.Red
										? "Red"
										: "Yellow"}{" "}
									wins!
								</AlertDescription>
							</Alert>
						)}
						{gameState.isDraw && (
							<Alert className="mt-4">
								<AlertTitle>Game Over!</AlertTitle>
								<AlertDescription>
									It's a draw!
								</AlertDescription>
							</Alert>
						)}
					</div>
					<div className="relative">
						<div className="grid grid-cols-7 gap-2">
							{/* Column headers with hover preview */}
							{Array.from(
								{ length: Engine.maxCols },
								(_, col) => (
									<div
										key={col}
										className="relative"
										data-testid={`header-${col}`}
										onMouseEnter={() =>
											handleMouseEnter(col)
										}
										onMouseLeave={handleMouseLeave}
										onClick={() => handleColumnClick(col)}
									>
										{hoveredColumn === col &&
											!(
												gameState.winner ||
												gameState.isDraw
											) && (
												<div
													className={`absolute top-[-2.5rem] left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full border border-gray-300 ${
														engine.currentPlayer ===
														Player.Red
															? "bg-red-500"
															: "bg-yellow-500"
													}`}
												></div>
											)}
									</div>
								),
							)}
							{/* Board grid */}
							{engine.board.map((row, rowIndex) =>
								row.map((cell, colIndex) => (
									<div
										key={`${rowIndex}-${colIndex}`}
										data-testid={`cell-${rowIndex}-${colIndex}`}
										className={`w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center ${
											cell.color === Player.Red
												? "bg-red-500"
												: cell.color === Player.Yellow
													? "bg-yellow-500"
													: "bg-white"
										}`}
										onMouseEnter={() =>
											handleMouseEnter(colIndex)
										}
										onMouseLeave={handleMouseLeave}
										onClick={() =>
											handleColumnClick(colIndex)
										}
									></div>
								)),
							)}
						</div>
					</div>
					<div className="mt-4 text-center">
						<Button onClick={handleReset} variant="outline">
							Reset Game
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default App;
