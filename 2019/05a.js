const assert = require('assert').strict

const {
	OPCODES,
	MODES,
	readInput,
	intcode,
} = require('./intcode.js')

if (require.main === module) {
	const computer = intcode(readInput('05.in'))
	computer.next()
	const outputs = [computer.next(1).value, ...computer].map(out => out.value)
	const diagnosticCode = outputs.pop()
	if (outputs.some(diff => diff !== 0)) {
		console.warn("Got non-zero outputs before diagnostic code")
		console.warn(outputs)
	}
	console.log(diagnosticCode)

	// Now that the correct answer has been confirmed,
	// make sure we don't break something in future
	assert.equal(diagnosticCode, 5182797)
}
