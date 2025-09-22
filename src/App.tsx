import { useState } from "react";
import Engine, { Player } from "./engine";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";

function App() {
	const [engine, setEngine] = useState(new Engine());
	const [gameState, setGameState] = useState<{
		winner: Player | null;
		isDraw: boolean;
	}>({ winner: null, isDraw: false });

	const handleColumnClick = (col: number) => {
		if (gameState.winner || gameState.isDraw) return;

		const cell = engine.setPiece(col, engine.currentPlayer);
		if (cell) {
			const hasWon = engine.checkWin(cell);
			const isDraw = engine.turn >= Engine.maxRows * Engine.maxCols - 1;

			setGameState({
				winner: hasWon ? engine.currentPlayer : null,
				isDraw: !hasWon && isDraw,
			});

			if (!hasWon && !isDraw) {
				engine.currentPlayer =
					engine.currentPlayer === Player.Red
						? Player.Yellow
						: Player.Red;
				engine.turn++;
			}

			setEngine(
				new Engine(engine.board, engine.currentPlayer, engine.turn),
			);
		}
	};

	const handleReset = () => {
		setEngine(new Engine());
		setGameState({ winner: null, isDraw: false });
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
					<div className="grid grid-cols-7 gap-2">
						{Array.from({ length: Engine.maxCols }, (_, col) => (
							<Button
								key={col}
								onClick={() => handleColumnClick(col)}
								disabled={
									gameState.winner !== null ||
									gameState.isDraw
								}
								className="w-full h-10 bg-blue-500 hover:bg-blue-600"
							>
								Drop
							</Button>
						))}
						{engine.board.map((row, rowIndex) =>
							row.map((cell, colIndex) => (
								<div
									key={`${rowIndex}-${colIndex}`}
									className={`w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center ${
										cell.color === Player.Red
											? "bg-red-500"
											: cell.color === Player.Yellow
												? "bg-yellow-500"
												: "bg-white"
									}`}
								></div>
							)),
						)}
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
