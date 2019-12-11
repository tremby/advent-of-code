const assert = require('assert').strict

const fs = require('fs')

const U = 'U'
const D = 'D'
const L = 'L'
const R = 'R'

function readInput() {
	return fs.readFileSync('03.in', { encoding: 'utf8' })
}

function parseInput(string) {
	return string
		.trim()
		.split('\n')
		.map(line => line
			.trim()
			.split(',')
			.map(edge => ([
				edge.substring(0, 1),
				parseInt(edge.substring(1), 10),
			]))
		)
}

function cellToString([x, y]) {
	return `${x},${y}`
}

function stringToCell(string) {
	return string.split(',').map(x => parseInt(x, 10))
}

function cellsCoveredByPath(path) {
	return path.reduce((cells, [direction, distance]) => {
		if (distance < 1) {
			throw new Error(`Unexpected non-positive distance ${distance}`)
		}
		for (let i = 0; i < distance; i++) {
			const cell = [...cells[cells.length - 1]]
			switch (direction) {
				case U:
					cell[1]++
					break;
				case D:
					cell[1]--
					break;
				case L:
					cell[0]--
					break;
				case R:
					cell[0]++
					break;
				default:
					throw new Error(`Unexpected direction "${direction}"`)
			}
			cells.push(cell)
		}
		return cells
	}, [[0, 0]]).map(cellToString)
}

function getIntersections(paths) {
	// We assume we have exactly two paths
	if (paths.length !== 2) {
		throw new Error("Expected exactly two paths")
	}

	// Get lists of covered cells
	const coveredCells = paths.map(path => new Set(cellsCoveredByPath(path)))

	// Find intersections
	return [...new Set([...coveredCells[0]]
		.filter(cell => {
			if (cell === '0,0') return false // Not considered an intersection
			return coveredCells[1].has(cell)
		}))]
}

function closestDistanceToOrigin(candidates) {
	return candidates.reduce((best, cell) => {
		return Math.min(best, manhattanDistanceToOrigin(stringToCell(cell)))
	}, Infinity)
}

function manhattanDistanceToOrigin(coords) {
	return Math.abs(coords[0]) + Math.abs(coords[1])
}

if (require.main === module) {
	assert.equal(manhattanDistanceToOrigin([0, 0]), 0)
	assert.equal(manhattanDistanceToOrigin([1, 0]), 1)
	assert.equal(manhattanDistanceToOrigin([0, 1]), 1)
	assert.equal(manhattanDistanceToOrigin([1, 1]), 2)
	assert.equal(manhattanDistanceToOrigin([2, -3]), 5)

	assert.deepEqual(parseInput(`
		L1,R1,U100,D1,L2
		R1,U1,R1,U1,R50
	`), [
		[[L, 1], [R, 1], [U, 100], [D, 1], [L, 2]],
		[[R, 1], [U, 1], [R, 1], [U, 1], [R, 50]],
	])

	assert.deepEqual(cellsCoveredByPath([[R, 1]]), ['0,0', '1,0'])
	assert.deepEqual(cellsCoveredByPath([[R, 2]]), ['0,0', '1,0', '2,0'])
	assert.deepEqual(cellsCoveredByPath([[R, 2], [L, 2]]), ['0,0', '1,0', '2,0', '1,0', '0,0'])
	assert.deepEqual(cellsCoveredByPath(
		[[R, 2], [D, 2], [L, 2], [U, 2]]),
		['0,0', '1,0', '2,0', '2,-1', '2,-2', '1,-2', '0,-2', '0,-1', '0,0']
	)

	assert.deepEqual(getIntersections(parseInput(`
		R8,U5,L5,D3
		U7,R6,D4,L7
	`)), ['6,5', '3,3'])

	assert.equal(closestDistanceToOrigin(['0,0']), 0)
	assert.equal(closestDistanceToOrigin(['0,0', '5,5']), 0)
	assert.equal(closestDistanceToOrigin(['5,5', '0,0']), 0)
	assert.equal(closestDistanceToOrigin(['-3,-3', '3,3']), 6)
	assert.equal(closestDistanceToOrigin(['-3,-4', '4,1']), 5)
	assert.equal(closestDistanceToOrigin(['19,3', '1,1', '4,1']), 2)

	assert.deepEqual(stringToCell('0,0'), [0, 0])
	assert.deepEqual(stringToCell('50,-1'), [50, -1])
	assert.deepEqual(stringToCell('-3,-10'), [-3, -10])

	function composed(x) {
		return closestDistanceToOrigin(getIntersections(parseInput(x)))
	}

	assert.equal(composed(`
		R8,U5,L5,D3
		U7,R6,D4,L7
	`), 6)
	assert.equal(composed(`
		R75,D30,R83,U83,L12,D49,R71,U7,L72
		U62,R66,U55,R34,D71,R55,D58,R83
	`), 159)
	assert.equal(composed(`
		R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
		U98,R91,D20,R16,D67,R40,U7,R15,U6,R7
	`), 135)

	console.log(composed(readInput()))
}
