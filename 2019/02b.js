const assert = require('assert').strict

const {
	withNounAndVerb,
} = require('./02a.js')

const {
	readInput,
	intcode,
} = require('./intcode.js')

const TARGET = 19690720

if (require.main === module) {
	const input = readInput('./02.in')

	// Counting to 100 for each is somewhat arbitrary. The puzzle gave no
	// solid clue as to how big each number would be, but given that one
	// should be multiplied by 100 and then added to the other, 100 seems a
	// reasonable upper bound.
	for (let noun = 0; noun < 100; noun++) {
		for (let verb = 0; verb < 100; verb++) {
			const tape = withNounAndVerb(input, noun, verb)
			const computer = intcode(tape)
			computer.next()
			if (tape[0] === TARGET) {
				console.log("Noun:", noun, "Verb:", verb)
				console.log("Answer:", 100 * noun + verb)

				// Now that the correct answer has been confirmed,
				// make sure we don't break something in future
				assert.equal(100 * noun + verb, 7603)
			}
		}
	}
}
