const assert = require('assert').strict

const fs = require('fs')

const OPCODES = {
	ADD: 1,
	MULTIPLY: 2,
	INPUT: 3,
	OUTPUT: 4,
	JUMP_IF_TRUE: 5,
	JUMP_IF_FALSE: 6,
	LESS_THAN: 7,
	EQUALS: 8,
	HALT: 99,
}

const MODES = {
	POSITION: 0,
	IMMEDIATE: 1,
}

function readInput(filename) {
	return fs.readFileSync(filename, { encoding: 'utf8' })
		.trim()
		.split(',')
		.map(num => parseInt(num, 10))
}

function* intcode(tape) {
	let cursor = 0

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
			default:
				throw new Error(`Got unexpected parameter mode ${mode} for parameter at position ${cursor}`)
		}
	}

	function getWriteDestinationParameter(mode) {
		if (mode === MODES.IMMEDIATE)
			throw new Error(`Got immediate parameter mode for write destination parameter at position ${cursor}`)
		return getRawParameter()
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
			case OPCODES.HALT:
				return

			default:
				throw new Error(`Unexpected opcode ${readTape(cursor)} at position ${cursor}`)
		}
	}
	throw new Error("Ran out of tape without seeing HALT")
}

if (require.main === module) {
	let tape, outputs, computer

	tape = [1,9,10,3,2,3,11,0,99,30,40,50]
	computer = intcode(tape)
	outputs = [...computer]
	assert.deepEqual(tape, [3500,9,10,70,2,3,11,0,99,30,40,50])
	assert.deepEqual(outputs, [])

	tape = [1,0,0,0,99]
	outputs = [...intcode(tape)]
	assert.deepEqual(tape, [2,0,0,0,99])
	assert.deepEqual(outputs, [])

	tape = [2,3,0,3,99]
	outputs = [...intcode(tape)]
	assert.deepEqual(tape, [2,3,0,6,99])
	assert.deepEqual(outputs, [])

	tape = [2,4,4,5,99,0]
	outputs = [...intcode(tape)]
	assert.deepEqual(tape, [2,4,4,5,99,9801])
	assert.deepEqual(outputs, [])

	tape = [1,1,1,4,99,5,6,0,99]
	outputs = [...intcode(tape)]
	assert.deepEqual(tape, [30,1,1,4,2,5,6,0,99])
	assert.deepEqual(outputs, [])

	tape = [3,0,4,0,099]
	computer = intcode(tape)
	assert.deepEqual(computer.next(), { done: false, value: { type: 'INPUT' } })
	outputs = [computer.next(33), ...computer]
	assert.deepEqual(tape, [33,0,4,0,99])
	assert.deepEqual(outputs, [{ done: false, value: { type: 'OUTPUT', value: 33 } }])

	tape = [1002,4,3,4,33]
	outputs = [...intcode(tape)]
	assert.deepEqual(tape, [1002,4,3,4,99])
	assert.deepEqual(outputs, [])

	computer = intcode(readInput('05.in'))
	computer.next()
	outputs = [computer.next(1).value, ...computer].map(out => out.value)
	const diagnosticCode = outputs.pop()
	if (outputs.some(diff => diff !== 0)) {
		console.warn("Got non-zero outputs before diagnostic code")
		console.warn(outputs)
	}
	console.log(diagnosticCode)
}

module.exports = {
	OPCODES,
	MODES,
	readInput,
	intcode,
}
