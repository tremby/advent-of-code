const assert = require('assert').strict

const {
	readInput,
	intcode,
} = require('./05a.js')

if (require.main === module) {
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

	const computer = intcode(readInput('./09.in'))
	computer.next()
	const outputs = [computer.next(1).value, ...computer].filter(out => out.type === 'OUTPUT').map(out => out.value)
	assert.equal(outputs.length, 1)
	console.log(outputs[0])
}
