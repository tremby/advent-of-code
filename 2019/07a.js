const assert = require('assert').strict

const {
	readInput,
	intcode,
} = require('./05a.js')

// Based on https://stackoverflow.com/a/37580979/496046
function * permutations(values) {
	const c = Array(values.length).fill(0)
	let i = 1
	let k

	yield [...values]

	while (i < values.length) {
		if (c[i] < i) {
			k = i % 2 && c[i]; // semicolon required here!
			[values[i], values[k]] = [values[k], values[i]]
			++c[i]
			i = 1
			yield [...values]
		} else {
			c[i] = 0
			++i
		}
	}
}

function findHighestSignal(program) {
	let bestSequence = null
	let bestOutput = -Infinity
	for (const phaseSequence of permutations([...Array(5).keys()])) {
		const output = phaseSequence.reduce((input, phase) => {
			let out = null
			intcode(program, [phase, input][Symbol.iterator](), (x) => out = x)
			return out
		}, 0)
		if (output > bestOutput) {
			bestOutput = output
			bestSequence = phaseSequence
		}
	}
	return { phaseSequence: bestSequence, signal: bestOutput }
}

if (require.main === module) {
	assert.deepEqual(new Set([...permutations([])]), new Set([[]]))
	assert.deepEqual(new Set([...permutations([1])]), new Set([[1]]))
	assert.deepEqual(new Set([...permutations([1, 2])]), new Set([[1, 2], [2, 1]]))
	assert.deepEqual(new Set([...permutations([1, 2, 3])]), new Set([[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]))

	assert.deepEqual(findHighestSignal([3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0]), { signal: 43210, phaseSequence: [4,3,2,1,0] })
	assert.deepEqual(findHighestSignal([
		3,23,3,24,1002,24,10,24,1002,23,-1,23,
		101,5,23,23,1,24,23,23,4,23,99,0,0
	]), { signal: 54321, phaseSequence: [0,1,2,3,4] })
	assert.deepEqual(findHighestSignal([
		3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,
		1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0
	]), { signal: 65210, phaseSequence: [1,0,4,3,2] })

	console.log(findHighestSignal(readInput('07.in')).signal)
}
