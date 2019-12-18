const assert = require('assert').strict

const {
	readInput,
	intcode,
} = require('./05a.js')

if (require.main === module) {
	function isEqualTo8Position(input) {
		let out = null
		intcode([3,9,8,9,10,9,4,9,99,-1,8], () => input, (x) => out = x)
		return out
	}
	assert.equal(isEqualTo8Position(0), 0)
	assert.equal(isEqualTo8Position(8), 1)
	assert.equal(isEqualTo8Position(16), 0)
	assert.equal(isEqualTo8Position(-8), 0)

	function isLessThan8Position(input) {
		let out = null
		intcode([3,9,7,9,10,9,4,9,99,-1,8], () => input, (x) => out = x)
		return out
	}
	assert.equal(isLessThan8Position(0), 1)
	assert.equal(isLessThan8Position(7), 1)
	assert.equal(isLessThan8Position(8), 0)
	assert.equal(isLessThan8Position(9), 0)
	assert.equal(isLessThan8Position(-8), 1)

	function isEqualTo8Immediate(input) {
		let out = null
		intcode([3,3,1108,-1,8,3,4,3,99], () => input, (x) => out = x)
		return out
	}
	assert.equal(isEqualTo8Immediate(0), 0)
	assert.equal(isEqualTo8Immediate(8), 1)
	assert.equal(isEqualTo8Immediate(16), 0)
	assert.equal(isEqualTo8Immediate(-8), 0)

	function isLessThan8Immediate(input) {
		let out = null
		intcode([3,3,1107,-1,8,3,4,3,99], () => input, (x) => out = x)
		return out
	}
	assert.equal(isLessThan8Immediate(0), 1)
	assert.equal(isLessThan8Immediate(7), 1)
	assert.equal(isLessThan8Immediate(8), 0)
	assert.equal(isLessThan8Immediate(9), 0)
	assert.equal(isLessThan8Immediate(-8), 1)

	function isNonZeroPosition(input) {
		let out = null
		intcode([3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9], () => input, (x) => out = x)
		return out
	}
	assert.equal(isNonZeroPosition(-1), 1)
	assert.equal(isNonZeroPosition(0), 0)
	assert.equal(isNonZeroPosition(1), 1)

	function isNonZeroImmediate(input) {
		let out = null
		intcode([3,3,1105,-1,9,1101,0,0,12,4,12,99,1], () => input, (x) => out = x)
		return out
	}
	assert.equal(isNonZeroImmediate(-1), 1)
	assert.equal(isNonZeroImmediate(0), 0)
	assert.equal(isNonZeroImmediate(1), 1)

	function testRange(input) {
		let out = null
		intcode([
			3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,
			1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,
			1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99
		], () => input, (x) => out = x)
		return out
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

	const outputs = []
	intcode(readInput(), () => 5, (x) => outputs.push(x))
	const diagnosticCode = outputs.pop()
	if (outputs.some(diff => diff !== 0)) {
		console.warn("Got non-zero outputs before diagnostic code")
		console.warn(outputs)
	}
	console.log(diagnosticCode)
}
