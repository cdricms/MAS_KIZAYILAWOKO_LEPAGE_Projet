// Enum for player colors
export enum Player {
	Red,
	Yellow,
}

// Interface for a cell on the board
export interface Cell {
	color: Player | null;
	row: number;
	col: number;
}

// Enum for directions to check connections
enum Direction {
	Top,
	TopRight,
	Right,
	BottomRight,
	Bottom,
	BottomLeft,
	Left,
	TopLeft,
}

// Type alias for 2D board array
export type Board = Cell[][];

export default class Engine {
	// Board dimensions
	static readonly maxRows = 6;
	static readonly maxCols = 7;

	board: Board;
	currentPlayer: Player;
	turn: number = 0;

	// Maps directions to row/col offsets for win checking
	static directionsMap = new Map<Direction, [number, number]>([
		[Direction.Top, [-1, 0]],
		[Direction.TopRight, [-1, 1]],
		[Direction.Right, [0, 1]],
		[Direction.BottomRight, [1, 1]],
		[Direction.Bottom, [1, 0]],
		[Direction.BottomLeft, [1, -1]],
		[Direction.Left, [0, -1]],
		[Direction.TopLeft, [-1, -1]],
	]);

	// Constructor: Initializes new game or restores from given state
	constructor();
	constructor(board: Board, player: Player, turn: number);
	constructor(board?: Board, player?: Player, turn?: number) {
		if (board == null && player == null) {
			this.currentPlayer = Math.round(Math.random()); // Randomly select starting player
			this.board = this.generateBoard();
		} else {
			this.currentPlayer = player!;
			this.board = board!;
			this.turn = turn ?? 0;
		}
	}

	// Creates an empty board with null cells
	private generateBoard(): Board {
		const board = Array.from({ length: Engine.maxRows }, () =>
			Array(Engine.maxCols).fill(null),
		);
		for (let i = 0; i < Engine.maxRows; i++) {
			for (let j = 0; j < Engine.maxCols; j++) {
				board[i][j] = {
					col: j,
					row: i,
					color: null,
				};
			}
		}
		return board;
	}

	// Places a piece in the specified column, returning the placed cell or null if invalid
	setPiece(column: number, player: Player): Cell | null {
		if (column < 0 || column >= Engine.maxCols) {
			return null; // Invalid column
		}

		// Start from bottom row, find first empty cell
		for (let row = Engine.maxRows - 1; row >= 0; row--) {
			const currentCell = this.board[row][column];
			if (currentCell.color === null) {
				currentCell.color = player;
				return currentCell;
			}
		}
		return null; // Column is full
	}

	// Checks if the placed cell results in a win (4 connected pieces)
	checkWin(cell: Cell): boolean {
		if (cell.color === null) return false;

		// Pairs of opposite directions to check for connections
		const directionsToCheck: [Direction, Direction][] = [
			[Direction.Left, Direction.Right],
			[Direction.Top, Direction.Bottom],
			[Direction.TopLeft, Direction.BottomRight],
			[Direction.TopRight, Direction.BottomLeft],
		];

		for (const [dir1, dir2] of directionsToCheck) {
			let counter = 1; // Count the starting cell

			// Check in first direction
			let nextRow = cell.row;
			let nextCol = cell.col;
			let direction = Engine.directionsMap.get(dir1);
			if (direction) {
				nextRow += direction[0];
				nextCol += direction[1];
				while (
					this.checkBounds(nextRow, nextCol) &&
					this.board[nextRow][nextCol].color === cell.color &&
					counter < 4
				) {
					counter++;
					nextRow += direction[0];
					nextCol += direction[1];
				}
			}

			// Check in opposite direction
			nextRow = cell.row;
			nextCol = cell.col;
			direction = Engine.directionsMap.get(dir2);
			if (direction) {
				nextRow += direction[0];
				nextCol += direction[1];
				while (
					this.checkBounds(nextRow, nextCol) &&
					this.board[nextRow][nextCol].color === cell.color &&
					counter < 4
				) {
					counter++;
					nextRow += direction[0];
					nextCol += direction[1];
				}
			}

			if (counter >= 4) {
				return true; // Found 4 connected pieces
			}
		}
		return false;
	}

	// Validates if coordinates are within board bounds
	private checkBounds(row: number, col: number) {
		return (
			row >= 0 && row < Engine.maxRows && col >= 0 && col < Engine.maxCols
		);
	}
}
