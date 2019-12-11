const assert = require('assert').strict

const {
	readInput,
	parseInput,
	cellsCoveredByPath,
	getIntersections,
} = require('./03a.js')

function getFewestSteps(paths) {
	const coveredCells = paths.map(cellsCoveredByPath)
	const intersections = getIntersections(paths)

	return intersections.reduce((best, cell) => {
		return Math.min(best, coveredCells[0].indexOf(cell) + coveredCells[1].indexOf(cell))
	}, Infinity)
}

if (require.main === module) {
	assert.equal(getFewestSteps(parseInput(`
		R8,U5,L5,D3
		U7,R6,D4,L7
	`)), 30)
	assert.equal(getFewestSteps(parseInput(`
		R75,D30,R83,U83,L12,D49,R71,U7,L72
		U62,R66,U55,R34,D71,R55,D58,R83
	`)), 610)
	assert.equal(getFewestSteps(parseInput(`
		R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
		U98,R91,D20,R16,D67,R40,U7,R15,U6,R7
	`)), 410)

	console.log(getFewestSteps(parseInput(readInput())))
}
