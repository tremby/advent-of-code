const assert = require('assert').strict

const {
	readInput,
	intcode,
} = require('./intcode.js')

function withNounAndVerb(tape, noun, verb) {
	const copy = [...tape]
	copy[1] = noun
	copy[2] = verb
	return copy
}

if (require.main === module) {
	// Instructions say to make some replacements before running the program
	const tape = withNounAndVerb(readInput('./02.in'), 12, 2)

	// The prompt asks for the final position 0
	const computer = intcode(tape)
	computer.next()
	console.log(tape[0])

	// Now that the correct answer has been confirmed,
	// make sure we don't break something in future
	assert.equal(tape[0], 5534943)
}

module.exports = {
	withNounAndVerb,
}
