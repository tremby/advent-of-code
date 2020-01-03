const assert = require('assert').strict

const {
	readInput,
	intcode,
} = require('./05a.js')

if (require.main === module) {
	function isEqualTo8Position(input) {
		const computer = intcode([3,9,8,9,10,9,4,9,99,-1,8])
		computer.next()
		return computer.next(input).value.value
	}
	assert.equal(isEqualTo8Position(0), 0)
	assert.equal(isEqualTo8Position(8), 1)
	assert.equal(isEqualTo8Position(16), 0)
	assert.equal(isEqualTo8Position(-8), 0)

	function isLessThan8Position(input) {
		const computer = intcode([3,9,7,9,10,9,4,9,99,-1,8])
		computer.next()
		return computer.next(input).value.value
	}
	assert.equal(isLessThan8Position(0), 1)
	assert.equal(isLessThan8Position(7), 1)
	assert.equal(isLessThan8Position(8), 0)
	assert.equal(isLessThan8Position(9), 0)
	assert.equal(isLessThan8Position(-8), 1)

	function isEqualTo8Immediate(input) {
		const computer = intcode([3,3,1108,-1,8,3,4,3,99])
		computer.next()
		return computer.next(input).value.value
	}
	assert.equal(isEqualTo8Immediate(0), 0)
	assert.equal(isEqualTo8Immediate(8), 1)
	assert.equal(isEqualTo8Immediate(16), 0)
	assert.equal(isEqualTo8Immediate(-8), 0)

	function isLessThan8Immediate(input) {
		const computer = intcode([3,3,1107,-1,8,3,4,3,99])
		computer.next()
		return computer.next(input).value.value
	}
	assert.equal(isLessThan8Immediate(0), 1)
	assert.equal(isLessThan8Immediate(7), 1)
	assert.equal(isLessThan8Immediate(8), 0)
	assert.equal(isLessThan8Immediate(9), 0)
	assert.equal(isLessThan8Immediate(-8), 1)

	function isNonZeroPosition(input) {
		const computer = intcode([3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9])
		computer.next()
		return computer.next(input).value.value
	}
	assert.equal(isNonZeroPosition(-1), 1)
	assert.equal(isNonZeroPosition(0), 0)
	assert.equal(isNonZeroPosition(1), 1)

	function isNonZeroImmediate(input) {
		const computer = intcode([3,3,1105,-1,9,1101,0,0,12,4,12,99,1])
		computer.next()
		return computer.next(input).value.value
	}
	assert.equal(isNonZeroImmediate(-1), 1)
	assert.equal(isNonZeroImmediate(0), 0)
	assert.equal(isNonZeroImmediate(1), 1)

	function testRange(input) {
		const computer = intcode([
			3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,
			1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,
			1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99
		])
		computer.next()
		return computer.next(input).value.value
	}
	assert.equal(testRange(-10), 999)
	assert.equal(testRange(-9), 999)
	assert.equal(testRange(-8), 999)
	assert.equal(testRange(-7), 999)
	assert.equal(testRange(-6), 999)
	assert.equal(testRange(0), 999)
	assert.equal(testRange(6), 999)
	assert.equal(testRange(7), 999)
	assert.equal(testRange(8), 1000)
	assert.equal(testRange(9), 1001)
	assert.equal(testRange(10), 1001)

	const computer = intcode(readInput('05.in'))
	computer.next()
	const outputs = [computer.next(5).value, ...computer]
	const diagnosticCode = outputs.pop().value
	if (outputs.some(diff => diff !== 0)) {
		console.warn("Got non-zero outputs before diagnostic code")
		console.warn(outputs)
	}
	console.log(diagnosticCode)
}
