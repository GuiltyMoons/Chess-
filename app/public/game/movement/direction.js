export const bishopDirections = [
	{ row: 1, col: 1 }, { row: -1, col: -1 },
	{ row: 1, col: -1 }, { row: -1, col: 1 }
];

export const knightDirections = [
	{ row: 2, col: 1 }, { row: 2, col: -1 },
	{ row: -2, col: 1 }, { row: -2, col: -1 },
	{ row: 1, col: 2 }, { row: 1, col: -2 },
	{ row: -1, col: 2 }, { row: -1, col: -2 },
];

export const rookDirections = [
	{ row: 1, col: 0 }, { row: -1, col: 0 },
	{ row: 0, col: 1 }, { row: 0, col: -1 },
];
