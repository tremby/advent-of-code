const assert = require('assert').strict

const fs = require('fs')

const ADD = 1
const MULTIPLY = 2
const HALT = 99

const STEP = 4

function readOpcodes() {
	return fs.readFileSync('02.in', { encoding: 'utf8' })
		.trim()
		.split(',')
		.map(num => parseInt(num, 10))
}

function intcode(input) {
	const tape = [...input]
	for (let cursor = 0; cursor < tape.length; cursor += STEP) {
		switch (tape[cursor]) {
			case ADD:
				tape[tape[cursor + 3]] = tape[tape[cursor + 1]] + tape[tape[cursor + 2]]
				continue
			case MULTIPLY:
				tape[tape[cursor + 3]] = tape[tape[cursor + 1]] * tape[tape[cursor + 2]]
				continue
			case HALT:
				return tape
			default:
				throw new Error(`Unexpected opcode ${tape[cursor]} at position ${cursor}`)
		}
	}
	throw new Error("Ran out of tape without seeing HALT")
}

if (require.main === module) {
	assert.deepEqual(intcode([1,9,10,3,2,3,11,0,99,30,40,50]), [3500,9,10,70,2,3,11,0,99,30,40,50])
	assert.deepEqual(intcode([1,0,0,0,99]), [2,0,0,0,99])
	assert.deepEqual(intcode([2,3,0,3,99]), [2,3,0,6,99])
	assert.deepEqual(intcode([2,4,4,5,99,0]), [2,4,4,5,99,9801])
	assert.deepEqual(intcode([1,1,1,4,99,5,6,0,99]), [30,1,1,4,2,5,6,0,99])

	// Instructions say to make some replacements before running the program
	const input = readOpcodes()
	input[1] = 12
	input[2] = 2

	// The prompt asks for the final position 0
	console.log(intcode(input)[0])
}
