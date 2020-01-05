const assert = require('assert').strict

const {
	readFile,
} = require('./util.js')

const EMPTY = '.'
const ASTEROID = '#'

function stringToGrid(string) {
	return string.split('\n').map(row => row.trim().split('')).filter(row => row.length)
}

// Euclid's algorithm
// https://en.wikipedia.org/wiki/Greatest_common_divisor#Euclid's_algorithm
function greatestCommonDivisor(a, b) {
	if (a === 0) return b
	if (b === 0) return a
	return greatestCommonDivisor(b, a % b)
}

function reduceFraction([numerator, denominator]) {
	const gcd = Math.abs(greatestCommonDivisor(numerator, denominator))
	return [numerator / gcd, denominator / gcd]
}

function offset(from, to) {
	return [to[0] - from[0], to[1] - from[1]]
}

function add(a, b) {
	return [a[0] + b[0], a[1] + b[1]]
}

function scale(coords, multiplicand) {
	return [coords[0] * multiplicand, coords[1] * multiplicand]
}

function equal(a, b) {
	return a[0] === b[0] && a[1] === b[1]
}

function cellAt(grid, coords) {
	const row = grid[coords[1]]
	return row == null ? row : row[coords[0]]
}

function look(grid, from, to) {
	if (equal(from, to)) return null

	const step = reduceFraction(offset(from, to))

	let i = 1
	while (true) {
		const pos = add(from, scale(step, i))
		const cell = cellAt(grid, pos)
		if (cell == null) {
			// Off the grid
			return null
		}
		if (cell === ASTEROID) {
			return pos
		}
		i++
	}

	throw new Error("Got to inaccessible position in code")
}

function hashable(coords) {
	return coords.map(x => x.toString()).join(',')
}

function getDimensions(grid) {
	return [grid[0].length, grid.length]
}

function getVisible(grid, from) {
	const dimensions = getDimensions(grid)

	const seen = new Set()
	for (let x = 0; x < dimensions[0]; x++) {
		for (let y = 0; y < dimensions[1]; y++) {
			const to = look(grid, from, [x, y])
			if (to != null) {
				seen.add(hashable(to))
			}
		}
	}

	return seen
}

function bestAsteroid(grid) {
	const dimensions = getDimensions(grid)

	let bestPos = null
	let bestSeen = -Infinity
	for (let x = 0; x < dimensions[0]; x++) {
		for (let y = 0; y < dimensions[1]; y++) {
			const pos = [x, y]
			if (cellAt(grid, pos) !== ASTEROID) continue
			const seen = getVisible(grid, pos)
			if (seen.size > bestSeen) {
				bestPos = pos
				bestSeen = seen.size
			}
		}
	}

	return {
		coords: bestPos,
		seenCount: bestSeen,
	}
}

function gridToString(grid) {
	return grid.map(row => row.join('')).join('\n')
}

if (require.main === module) {
	assert.equal(greatestCommonDivisor(1, 1), 1)
	assert.equal(greatestCommonDivisor(1, -2), 1)
	assert.equal(greatestCommonDivisor(-1, 2), -1)
	assert.equal(greatestCommonDivisor(2, 4), 2)
	assert.equal(greatestCommonDivisor(1, 3), 1)
	assert.equal(greatestCommonDivisor(5, 500), 5)
	assert.equal(greatestCommonDivisor(6, 8), 2)

	assert.deepEqual(reduceFraction([1, 4]), [1, 4])
	assert.deepEqual(reduceFraction([4, 1]), [4, 1])
	assert.deepEqual(reduceFraction([2, 4]), [1, 2])
	assert.deepEqual(reduceFraction([8, 16]), [1, 2])
	assert.deepEqual(reduceFraction([20, 20]), [1, 1])
	assert.deepEqual(reduceFraction([-1, 4]), [-1, 4])
	assert.deepEqual(reduceFraction([1, -4]), [1, -4])
	assert.deepEqual(reduceFraction([-1, -4]), [-1, -4])

	assert.deepEqual(offset([0, 0], [0, 0]), [0, 0])
	assert.deepEqual(offset([0, 0], [1, 1]), [1, 1])
	assert.deepEqual(offset([0, 0], [2, 1]), [2, 1])
	assert.deepEqual(offset([0, 0], [-2, 1]), [-2, 1])
	assert.deepEqual(offset([2, 3], [-2, 1]), [-4, -2])

	assert.deepEqual(add([0, 0], [0, 0]), [0, 0])
	assert.deepEqual(add([0, 2], [1, 3]), [1, 5])
	assert.deepEqual(add([0, 2], [-1, -4]), [-1, -2])

	assert.deepEqual(scale([0, 0], 0), [0, 0])
	assert.deepEqual(scale([0, 2], 0), [0, 0])
	assert.deepEqual(scale([0, 2], 1), [0, 2])
	assert.deepEqual(scale([0, 2], 3), [0, 6])
	assert.deepEqual(scale([3, 2], 4), [12, 8])

	assert.equal(equal([0, 0], [0, 0]), true)
	assert.equal(equal([1, -1], [1, -1]), true)
	assert.equal(equal([0, 0], [0, 1]), false)
	assert.equal(equal([0, 0], [1, 0]), false)
	assert.equal(equal([0, 0], [1, 1]), false)

	assert.equal(hashable([0, 0]), '0,0')
	assert.equal(hashable([0, 1]), '0,1')
	assert.equal(hashable([1, 0]), '1,0')
	assert.equal(hashable([-1, -2]), '-1,-2')

	{
		const grid = [
			[EMPTY, ASTEROID, EMPTY, EMPTY],
			[EMPTY, ASTEROID, ASTEROID, ASTEROID],
			[ASTEROID, EMPTY, ASTEROID, ASTEROID],
		]

		assert.deepEqual(getDimensions(grid), [4, 3])

		assert.equal(gridToString(grid), '.#..\n.###\n#.##')
		assert.deepEqual(stringToGrid(gridToString(grid)), grid)

		assert.equal(cellAt(grid, [0, 0]), EMPTY)
		assert.equal(cellAt(grid, [0, 1]), EMPTY)
		assert.equal(cellAt(grid, [0, 2]), ASTEROID)
		assert.equal(cellAt(grid, [1, 0]), ASTEROID)
		assert.equal(cellAt(grid, [1, 1]), ASTEROID)
		assert.equal(cellAt(grid, [1, 1]), ASTEROID)

		assert.deepEqual(look(grid, [0, 0], [0, 0]), null)
		assert.deepEqual(look(grid, [1, 0], [1, 0]), null)
		assert.deepEqual(look(grid, [1, 0], [1, 2]), [1, 1])
		assert.deepEqual(look(grid, [1, 0], [2, 0]), null)
		assert.deepEqual(look(grid, [1, 0], [0, 0]), null)
		assert.deepEqual(look(grid, [3, 2], [0, 0]), null)
		assert.deepEqual(look(grid, [3, 2], [1, 0]), [2, 1])
		assert.deepEqual(look(grid, [3, 2], [2, 0]), null)
		assert.deepEqual(look(grid, [3, 2], [3, 0]), [3, 1])

		assert.deepEqual(getVisible(grid, [3, 2]), new Set(['1,1', '2,1', '3,1', '2,2']))
		assert.deepEqual(getVisible(grid, [0, 0]), new Set(['0,2', '1,0', '1,1', '3,1', '2,1', '3,2']))
	}

	{
		const grid = stringToGrid(`
			.#..#
			.....
			#####
			....#
			...##
		`)

		assert.deepEqual(getDimensions(grid), [5, 5])

		assert.deepEqual(grid, [
			[EMPTY, ASTEROID, EMPTY, EMPTY, ASTEROID],
			[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
			[ASTEROID, ASTEROID, ASTEROID, ASTEROID, ASTEROID],
			[EMPTY, EMPTY, EMPTY, EMPTY, ASTEROID],
			[EMPTY, EMPTY, EMPTY, ASTEROID, ASTEROID],
		])

		assert.deepEqual(getVisible(grid, [1, 0]).size, 7)
		assert.deepEqual(getVisible(grid, [4, 0]).size, 7)
		assert.deepEqual(getVisible(grid, [0, 2]).size, 6)
		assert.deepEqual(getVisible(grid, [1, 2]).size, 7)
		assert.deepEqual(getVisible(grid, [2, 2]).size, 7)
		assert.deepEqual(getVisible(grid, [3, 2]).size, 7)
		assert.deepEqual(getVisible(grid, [4, 2]).size, 5)
		assert.deepEqual(getVisible(grid, [4, 3]).size, 7)
		assert.deepEqual(getVisible(grid, [3, 4]).size, 8)
		assert.deepEqual(getVisible(grid, [4, 4]).size, 7)

		assert.deepEqual(bestAsteroid(grid).coords, [3, 4])
	}

	assert.deepEqual(bestAsteroid(stringToGrid(`
		......#.#.
		#..#.#....
		..#######.
		.#.#.###..
		.#..#.....
		..#....#.#
		#..#....#.
		.##.#..###
		##...#..#.
		.#....####
	`)), { coords: [5, 8], seenCount: 33 })

	assert.deepEqual(bestAsteroid(stringToGrid(`
		#.#...#.#.
		.###....#.
		.#....#...
		##.#.#.#.#
		....#.#.#.
		.##..###.#
		..#...##..
		..##....##
		......#...
		.####.###.
	`)), { coords: [1, 2], seenCount: 35 })

	assert.deepEqual(bestAsteroid(stringToGrid(`
		.#..#..###
		####.###.#
		....###.#.
		..###.##.#
		##.##.#.#.
		....###..#
		..#.#..#.#
		#..#.#.###
		.##...##.#
		.....#.#..
	`)), { coords: [6, 3], seenCount: 41 })

	assert.deepEqual(bestAsteroid(stringToGrid(`
		.#..##.###...#######
		##.############..##.
		.#.######.########.#
		.###.#######.####.#.
		#####.##.#.##.###.##
		..#####..#.#########
		####################
		#.####....###.#.#.##
		##.#################
		#####.##.###..####..
		..######..##.#######
		####.##.####...##..#
		.#####..#.######.###
		##...#.##########...
		#.##########.#######
		.####.#.###.###.#.##
		....##.##.###..#####
		.#.#.###########.###
		#.#.#.#####.####.###
		###.##.####.##.#..##
	`)), { coords: [11, 13], seenCount: 210 })

	const result = bestAsteroid(stringToGrid(readFile('./10.in')))
	console.log(result)

	// Now that the correct answer has been confirmed,
	// make sure we don't break something in future
	assert.deepEqual(result, { coords: [11, 11], seenCount: 221 })
}
