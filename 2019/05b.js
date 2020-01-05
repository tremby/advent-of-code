const assert = require('assert').strict

const {
	readInput,
	intcode,
} = require('./intcode.js')

if (require.main === module) {
	const computer = intcode(readInput('05.in'))
	computer.next()
	const outputs = [computer.next(5).value, ...computer]
	const diagnosticCode = outputs.pop().value
	if (outputs.some(diff => diff !== 0)) {
		console.warn("Got non-zero outputs before diagnostic code")
		console.warn(outputs)
	}
	console.log(diagnosticCode)

	// Now that the correct answer has been confirmed,
	// make sure we don't break something in future
	assert.equal(diagnosticCode, 12077198)
}
