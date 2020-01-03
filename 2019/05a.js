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

function intcode(inputTape, inputIterator, putOutput) {
	const tape = [...inputTape]
	let cursor = 0

	function getInstruction() {
		const instruction = tape[cursor++]
		const opcode = instruction % 100
		const modes = Math.floor(instruction / 100).toString().split('').map(modeString => parseInt(modeString, 10))
		return {
			opcode,
			modes,
		}
	}

	function getRawParameter() {
		return tape[cursor++]
	}

	function getParameter(mode = MODES.POSITION) {
		switch (mode) {
			case MODES.POSITION:
				return tape[getRawParameter()]
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
				tape[writeDest] = augend + addend
				break
			}
			case OPCODES.MULTIPLY: {
				const multiplier = getParameter(modes.pop())
				const multiplacand = getParameter(modes.pop())
				const writeDest = getWriteDestinationParameter(modes.pop())
				tape[writeDest] = multiplier * multiplacand
				break
			}
			case OPCODES.INPUT: {
				const writeDest = getWriteDestinationParameter(modes.pop())
				tape[writeDest] = inputIterator.next().value
				break
			}
			case OPCODES.OUTPUT: {
				const data = getParameter(modes.pop())
				putOutput(data)
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
				tape[writeDest] = a < b ? 1 : 0
				break
			}
			case OPCODES.EQUALS: {
				const a = getParameter(modes.pop())
				const b = getParameter(modes.pop())
				const writeDest = getWriteDestinationParameter(modes.pop())
				tape[writeDest] = a === b ? 1 : 0
				break
			}
			case OPCODES.HALT:
				return tape

			default:
				throw new Error(`Unexpected opcode ${tape[cursor]} at position ${cursor}`)
		}
	}
	throw new Error("Ran out of tape without seeing HALT")
}

if (require.main === module) {
	assert.deepEqual(intcode([1,9,10,3,2,3,11,0,99,30,40,50]), [3500,9,10,70,2,3,11,0,99,30,40,50])
	assert.deepEqual(intcode([1,0,0,0,99]), [2,0,0,0,99])
	assert.deepEqual(intcode([2,3,0,3,99]), [2,3,0,6,99])
	assert.deepEqual(intcode([2,4,4,5,99,0]), [2,4,4,5,99,9801])
	assert.deepEqual(intcode([1,1,1,4,99,5,6,0,99]), [30,1,1,4,2,5,6,0,99])

	let out1 = null
	assert.deepEqual(intcode([3,0,4,0,099], [33][Symbol.iterator](), (x => out1 = x)), [33,0,4,0,99])
	assert.equal(out1, 33)

	assert.deepEqual(intcode([1002,4,3,4,33]), [1002,4,3,4,99])

	const outputs = []
	intcode(readInput('05.in'), [1][Symbol.iterator](), (x) => outputs.push(x))
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
