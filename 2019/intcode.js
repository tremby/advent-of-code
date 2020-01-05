const assert = require('assert').strict

const {
	readFile,
} = require('./util.js')

const OPCODES = {
	ADD: 1,
	MULTIPLY: 2,
	INPUT: 3,
	OUTPUT: 4,
	JUMP_IF_TRUE: 5,
	JUMP_IF_FALSE: 6,
	LESS_THAN: 7,
	EQUALS: 8,
	RELATIVE_BASE_OFFSET: 9,
	HALT: 99,
}

const MODES = {
	POSITION: 0,
	IMMEDIATE: 1,
	RELATIVE: 2,
}

function stringToTape(string) {
	return string.split(',').map(num => parseInt(num, 10))
}

function readInput(filename) {
	return stringToTape(readFile(filename))
}

function* intcode(tape) {
	let cursor = 0
	let relativeBase = 0

	function readTape(pos) {
		if (tape[pos] == null) tape[pos] = 0
		return tape[pos]
	}

	function writeTape(pos, value) {
		tape[pos] = value
	}

	function getInstruction() {
		const instruction = readTape(cursor++)
		const opcode = instruction % 100
		const modes = Math.floor(instruction / 100).toString().split('').map(modeString => parseInt(modeString, 10))
		return {
			opcode,
			modes,
		}
	}

	function getRawParameter() {
		return readTape(cursor++)
	}

	function getParameter(mode = MODES.POSITION) {
		switch (mode) {
			case MODES.POSITION:
				return readTape(getRawParameter())
			case MODES.IMMEDIATE:
				return getRawParameter()
			case MODES.RELATIVE:
				return readTape(getRawParameter() + relativeBase)
			default:
				throw new Error(`Got unexpected parameter mode ${mode} for parameter at position ${cursor}`)
		}
	}

	function getWriteDestinationParameter(mode = MODES.POSITION) {
		switch (mode) {
			case MODES.POSITION:
				return getRawParameter()
			case MODES.IMMEDIATE:
				throw new Error(`Got immediate parameter mode for write destination parameter at position ${cursor}`)
			case MODES.RELATIVE:
				return getRawParameter() + relativeBase
			default:
				throw new Error(`Got unexpected parameter mode ${mode} for parameter at position ${cursor}`)
		}
	}

	while (cursor < tape.length) {
		const { opcode, modes } = getInstruction()
		switch (opcode) {
			case OPCODES.ADD: {
				const augend = getParameter(modes.pop())
				const addend = getParameter(modes.pop())
				const writeDest = getWriteDestinationParameter(modes.pop())
				writeTape(writeDest, augend + addend)
				break
			}
			case OPCODES.MULTIPLY: {
				const multiplier = getParameter(modes.pop())
				const multiplacand = getParameter(modes.pop())
				const writeDest = getWriteDestinationParameter(modes.pop())
				writeTape(writeDest, multiplier * multiplacand)
				break
			}
			case OPCODES.INPUT: {
				const writeDest = getWriteDestinationParameter(modes.pop())
				writeTape(writeDest, yield { type: 'INPUT' })
				break
			}
			case OPCODES.OUTPUT: {
				const out = getParameter(modes.pop())
				yield { type: 'OUTPUT', value: out }
				break
			}
			case OPCODES.JUMP_IF_TRUE: {
				const value = getParameter(modes.pop())
				const cursorDest = getParameter(modes.pop())
				if (value !== 0) {
					cursor = cursorDest
				}
				break
			}
			case OPCODES.JUMP_IF_FALSE: {
				const value = getParameter(modes.pop())
				const cursorDest = getParameter(modes.pop())
				if (value === 0) {
					cursor = cursorDest
				}
				break
			}
			case OPCODES.LESS_THAN: {
				const a = getParameter(modes.pop())
				const b = getParameter(modes.pop())
				const writeDest = getWriteDestinationParameter(modes.pop())
				writeTape(writeDest, a < b ? 1 : 0)
				break
			}
			case OPCODES.EQUALS: {
				const a = getParameter(modes.pop())
				const b = getParameter(modes.pop())
				const writeDest = getWriteDestinationParameter(modes.pop())
				writeTape(writeDest, a === b ? 1 : 0)
				break
			}
			case OPCODES.RELATIVE_BASE_OFFSET: {
				const offset = getParameter(modes.pop())
				relativeBase += offset
				break
			}
			case OPCODES.HALT:
				return

			default:
				throw new Error(`Unexpected opcode ${readTape(cursor)} at position ${cursor}`)
		}
	}
	throw new Error("Ran out of tape without seeing HALT")
}

if (require.main === module) {
	// Tests for day 2 features
	{
		function checkEndMemory(input, output) {
			const tape = [...input]
			const computer = intcode(tape)
			const outputs = [...computer]
			assert.deepEqual(tape, output)
		}
		checkEndMemory([1,9,10,3,2,3,11,0,99,30,40,50], [3500,9,10,70,2,3,11,0,99,30,40,50])
		checkEndMemory([1,0,0,0,99], [2,0,0,0,99])
		checkEndMemory([2,3,0,3,99], [2,3,0,6,99])
		checkEndMemory([2,4,4,5,99,0], [2,4,4,5,99,9801])
		checkEndMemory([1,1,1,4,99,5,6,0,99], [30,1,1,4,2,5,6,0,99])
	}

	// Tests for day 5 features
	{
		const tape = [1,9,10,3,2,3,11,0,99,30,40,50]
		const computer = intcode(tape)
		const outputs = [...computer]
		assert.deepEqual(tape, [3500,9,10,70,2,3,11,0,99,30,40,50])
		assert.deepEqual(outputs, [])
	}

	{
		const tape = [1,0,0,0,99]
		const outputs = [...intcode(tape)]
		assert.deepEqual(tape, [2,0,0,0,99])
		assert.deepEqual(outputs, [])
	}

	{
		const tape = [2,3,0,3,99]
		const outputs = [...intcode(tape)]
		assert.deepEqual(tape, [2,3,0,6,99])
		assert.deepEqual(outputs, [])
	}

	{
		const tape = [2,4,4,5,99,0]
		const outputs = [...intcode(tape)]
		assert.deepEqual(tape, [2,4,4,5,99,9801])
		assert.deepEqual(outputs, [])
	}

	{
		const tape = [1,1,1,4,99,5,6,0,99]
		const outputs = [...intcode(tape)]
		assert.deepEqual(tape, [30,1,1,4,2,5,6,0,99])
		assert.deepEqual(outputs, [])
	}

	{
		const tape = [3,0,4,0,099]
		const computer = intcode(tape)
		assert.deepEqual(computer.next(), { done: false, value: { type: 'INPUT' } })
		const outputs = [computer.next(33), ...computer]
		assert.deepEqual(tape, [33,0,4,0,99])
		assert.deepEqual(outputs, [{ done: false, value: { type: 'OUTPUT', value: 33 } }])
	}

	{
		const tape = [1002,4,3,4,33]
		const outputs = [...intcode(tape)]
		assert.deepEqual(tape, [1002,4,3,4,99])
		assert.deepEqual(outputs, [])
	}

	{
		function isEqualTo8Position(input) {
			const computer = intcode([3,9,8,9,10,9,4,9,99,-1,8])
			computer.next()
			return computer.next(input).value.value
		}
		assert.equal(isEqualTo8Position(0), 0)
		assert.equal(isEqualTo8Position(8), 1)
		assert.equal(isEqualTo8Position(16), 0)
		assert.equal(isEqualTo8Position(-8), 0)
	}

	{
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
	}

	{
		function isEqualTo8Immediate(input) {
			const computer = intcode([3,3,1108,-1,8,3,4,3,99])
			computer.next()
			return computer.next(input).value.value
		}
		assert.equal(isEqualTo8Immediate(0), 0)
		assert.equal(isEqualTo8Immediate(8), 1)
		assert.equal(isEqualTo8Immediate(16), 0)
		assert.equal(isEqualTo8Immediate(-8), 0)
	}

	{
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
	}

	{
		function isNonZeroPosition(input) {
			const computer = intcode([3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9])
			computer.next()
			return computer.next(input).value.value
		}
		assert.equal(isNonZeroPosition(-1), 1)
		assert.equal(isNonZeroPosition(0), 0)
		assert.equal(isNonZeroPosition(1), 1)
	}

	{
		function isNonZeroImmediate(input) {
			const computer = intcode([3,3,1105,-1,9,1101,0,0,12,4,12,99,1])
			computer.next()
			return computer.next(input).value.value
		}
		assert.equal(isNonZeroImmediate(-1), 1)
		assert.equal(isNonZeroImmediate(0), 0)
		assert.equal(isNonZeroImmediate(1), 1)
	}

	{
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
	}

	// Tests for day 9 features
	{
		const tape = [109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99]
		const computer = intcode([...tape])
		const outputs = [...computer].map(out => out.value)
		assert.deepEqual(outputs, tape)
	}

	{
		const tape = [1102,34915192,34915192,7,4,7,99,0]
		const computer = intcode(tape)
		const output = computer.next().value.value
		assert.equal(output.toString().length, 16)
	}

	{
		const tape = [104,1125899906842624,99]
		const computer = intcode(tape)
		const output = computer.next().value.value
		assert.equal(output.toString(), '1125899906842624')
	}
}

module.exports = {
	OPCODES,
	MODES,
	stringToTape,
	readInput,
	intcode,
}
