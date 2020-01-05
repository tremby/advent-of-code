const assert = require('assert').strict

const {
	readFile,
} = require('./util.js')

const {
	EMPTY,
	ASTEROID,
	reduceFraction,
	hashable,
	getDimensions,
	stringToGrid,
	offset,
	equal,
	cellAt,
	look,
} = require('./10a.js')

function length(vector) {
	return Math.sqrt(vector[0] ** 2 + vector[1] ** 2)
}

function angle(from, to) {
	const delta = offset(from, to)
	return (Math.PI * 2.5 + Math.atan2(delta[1], delta[0])) % (Math.PI * 2)
}

function laser(grid, station) {
	// Look at all asteroids and sort them into an array of angles
	const dimensions = getDimensions(grid)
	let directions = {}
	for (let x = 0; x < dimensions[0]; x++) {
		for (let y = 0; y < dimensions[1]; y++) {
			const pos = [x, y]

			// Skip station cell
			if (equal(station, pos)) continue

			// Skip non-asteroids
			if (cellAt(grid, pos) !== ASTEROID) continue

			// Add it to the list of asteroids
			// in this exact direction
			const directionHash = hashable(reduceFraction(offset(station, pos)))
			if (!directions[directionHash]) {
				directions[directionHash] = []
			}
			directions[directionHash].push(pos)
		}
	}

	// Turn that into an array
	directions = Object.values(directions)

	// Sort by angle, from north clockwise
	directions.sort((a, b) => {
		const aAngle = angle(station, a[0])
		const bAngle = angle(station, b[0])
		return aAngle - bAngle
	})

	// Sort by distance, from closest
	directions = directions.map((asteroids) =>
		asteroids.sort((a, b) =>
			length(offset(station, a)) - length(offset(station, b))
		)
	)

	// Spin the laser
	let directionIndex = 0
	const vaporized = []
	while (true) {
		if (directions[directionIndex].length) {
			vaporized.push(directions[directionIndex].shift())
			if (directions.every(list => list.length === 0)) break
		}
		directionIndex = (directionIndex + 1) % directions.length
	}

	return vaporized
}

if (require.main === module) {
	assert.equal(length([0, 0]), 0)
	assert.equal(length([0, 1]), 1)
	assert.equal(length([0, -1]), 1)
	assert.equal(length([3, 4]), 5)
	assert.equal(length([-4, 3]), 5)

	assert.equal(angle([0, 0], [0, -1]), 0)
	assert.equal(angle([0, 1], [0, 0]), 0)
	assert.equal(angle([-1, -1], [-2, -2]) >= 0, true)

	{
		const north = angle([0, 0], [0, -1])
		const east = angle([0, 0], [1, 0])
		const south = angle([0, 0], [0, 1])
		const west = angle([0, 0], [-1, 0])
		assert.equal(east > north, true)
		assert.equal(south > east, true)
		assert.equal(west > south, true)
	}

	assert.deepEqual(laser(stringToGrid(`
		.#....#####...#..
		##...##.#####..##
		##...#...#.#####.
		..#.....X...###..
		..#.#.....#....##
	`), [8, 3]), [
		[8, 1], [9, 0], [9, 1], [10, 0], [9, 2], [11, 1], [12, 1], [11, 2], [15, 1],
		[12, 2], [13, 2], [14, 2], [15, 2], [12, 3], [16, 4], [15, 4], [10, 4], [4, 4],
		[2, 4], [2, 3], [0, 2], [1, 2], [0, 1], [1, 1], [5, 2], [1, 0], [5, 1],
		[6, 1], [6, 0], [7, 0], [8, 0], [10, 1], [14, 0], [16, 1], [13, 3], [14, 3],
	])

	{
		const vaporized = laser(stringToGrid(`
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
			##...#.####X#####...
			#.##########.#######
			.####.#.###.###.#.##
			....##.##.###..#####
			.#.#.###########.###
			#.#.#.#####.####.###
			###.##.####.##.#..##
		`), [11, 13])
		assert.deepEqual(vaporized[0], [11, 12])
		assert.deepEqual(vaporized[1], [12, 1])
		assert.deepEqual(vaporized[2], [12, 2])
		assert.deepEqual(vaporized[9], [12, 8])
		assert.deepEqual(vaporized[19], [16, 0])
		assert.deepEqual(vaporized[49], [16, 9])
		assert.deepEqual(vaporized[99], [10, 16])
		assert.deepEqual(vaporized[198], [9, 6])
		assert.deepEqual(vaporized[199], [8, 2])
		assert.deepEqual(vaporized[200], [10, 9])
		assert.deepEqual(vaporized[298], [11, 1])
	}

	const vaporized = laser(stringToGrid(readFile('./10.in')), [11, 11])
	console.log("number 200", vaporized[199])
	console.log("code", vaporized[199][0] * 100 + vaporized[199][1])

	// Now that the correct answer has been confirmed,
	// make sure we don't break something in future
	assert.deepEqual(vaporized[199], [8, 6])
}
