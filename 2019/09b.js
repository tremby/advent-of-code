const assert = require('assert').strict

const {
	readInput,
	intcode,
} = require('./intcode.js')

if (require.main === module) {
	const computer = intcode(readInput('./09.in'))
	computer.next()

	const outputs = [computer.next(2).value, ...computer].filter(out => out.type === 'OUTPUT').map(out => out.value)
	assert.equal(outputs.length, 1)
	console.log(outputs[0])

	// Now that the correct answer has been confirmed,
	// make sure we don't break something in future
	assert.equal(outputs[0], 83089)
}
