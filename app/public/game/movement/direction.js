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

export const bPawn = [{row: 1, col: 3}, {row: 1, col: 4}, {row: 1, col: 5},
	{row: 1, col: 6}, {row: 1, col: 7}, {row: 1, col: 8}, {row: 1, col: 9}, {row: 1, col: 10}
]

export const gPawn = [{row: 3, col: 12}, {row: 4, col: 12}, {row: 5, col: 12},
	{row: 6, col: 12}, {row: 7, col: 12}, {row: 8, col: 12}, {row: 9, col: 12}, {row: 10, col: 12}
]

export const rPawn = [{row: 12, col: 3}, {row: 12, col: 4}, {row: 12, col: 5},
	{row: 12, col: 6}, {row: 12, col: 7}, {row: 12, col: 8}, {row: 12, col: 9}, {row: 12, col: 10}
]

export const yPawn = [{row: 3, col: 1}, {row: 4, col: 1}, {row: 5, col: 1},
	{row: 6, col: 1}, {row: 7, col: 1}, {row: 8, col: 1}, {row: 9, col: 1}, {row: 10, col: 1}
]
