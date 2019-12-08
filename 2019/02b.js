const {
	opcodes,
	STEP,
	readInput,
	withNounAndVerb,
	intcode,
} = require('./02a.js')

const TARGET = 19690720

if (require.main === module) {
	const input = readInput()

	// Counting to 100 for each is somewhat arbitrary. The puzzle gave no
	// solid clue as to how big each number would be, but given that one
	// should be multiplied by 100 and then added to the other, 100 seems a
	// reasonable upper bound.
	for (let noun = 0; noun < 100; noun++) {
		for (let verb = 0; verb < 100; verb++) {
			if (intcode(withNounAndVerb(input, noun, verb))[0] === TARGET) {
				console.log("Noun:", noun, "Verb:", verb)
				console.log("Answer:", 100 * noun + verb)
			}
		}
	}
}
