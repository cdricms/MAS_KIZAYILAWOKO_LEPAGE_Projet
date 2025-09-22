import Engine, { Player } from ".";

const engine = new Engine();

for (let i = 0; i < 4; i++) {
	console.table(engine.board);
	let cell = engine.setPiece(2, Player.Red);
	if (cell) {
		console.log(engine.checkWin(cell));
	}
}

console.table(engine.board);
