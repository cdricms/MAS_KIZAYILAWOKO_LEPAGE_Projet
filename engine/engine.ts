export enum Player {
	Red,
	Yellow,
}

export interface Cell {
	color: Player | null;

	row: number;
	col: number;
}

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

const DirectionSize = Object.keys(Direction).length / 2;

export default class Engine {
	private static maxRows = 6;
	private static maxCols = 7;

	board: Cell[][];
	currentPlayer: Player;
	turn: number = 0;

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

	constructor() {
		this.currentPlayer = Math.round(Math.random());
		this.generateBoard();
	}

	private generateBoard(): void {
		this.board = Array.from({ length: Engine.maxRows }, () =>
			Array(Engine.maxCols).fill(null),
		);
		for (let i = 0; i < Engine.maxRows; i++) {
			for (let j = 0; j < Engine.maxCols; j++) {
				this.board[i][j] = {
					col: j,
					row: i,
					color: null,
				};
			}
		}
	}

	setPiece(column: number, player: Player): Cell | null {
		if (column < 0 || column >= Engine.maxCols) {
			return null;
		}

		for (let row = Engine.maxRows - 1; row >= 0; row--) {
			const currentCell = this.board[row][column];
			if (currentCell.color === null) {
				currentCell.color = player;
				return currentCell;
			}
		}

		return null;
	}

	checkWin(cell: Cell): boolean {
		if (cell.color === null) return false;

		const directionsToCheck: [Direction, Direction][] = [
			[Direction.Left, Direction.Right],
			[Direction.Top, Direction.Bottom],
			[Direction.TopLeft, Direction.BottomRight],
			[Direction.TopRight, Direction.BottomLeft],
		];

		for (const [dir1, dir2] of directionsToCheck) {
			let counter = 1;

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
				return true;
			}
		}

		return false;
	}

	private checkBounds(row: number, col: number) {
		return (
			row >= 0 && row < Engine.maxRows && col >= 0 && col < Engine.maxCols
		);
	}
}
