const assert = require('assert').strict

const {
	readInput,
	intcode,
} = require('./intcode.js')

const {
	permutations,
} = require('./07a.js')

function findHighestSignal(program) {
	let bestSequence = null
	let bestOutput = -Infinity
	for (const phaseSequence of permutations([...Array(5).keys()].map(x => x + 5))) {
		const amps = phaseSequence.map((phase) => {
			const amp = {
				computer: intcode([...program]),
				state: undefined,
			}

			// Start program, run until first input prompt
			amp.state = amp.computer.next()
			assert.equal(amp.state.value.type, 'INPUT')

			// Send phase, run until next input prompt
			amp.state = amp.computer.next(phase)
			assert.equal(amp.state.value.type, 'INPUT')

			return amp
		})

		let signal = 0

		while (!amps[amps.length - 1].state.done) {
			for (const amp of amps) {
				// Send input signal, run until output offered
				amp.state = amp.computer.next(signal)
				assert.equal(amp.state.value.type, 'OUTPUT')
				signal = amp.state.value.value

				// Continue running to next input prompt or
				// finish
				amp.state = amp.computer.next()
				if (!amp.state.done) {
					assert.equal(amp.state.value.type, 'INPUT')
				}
			}
		}

		if (signal > bestOutput) {
			bestOutput = signal
			bestSequence = phaseSequence
		}
	}

	return { phaseSequence: bestSequence, signal: bestOutput }
}

if (require.main === module) {
	assert.deepEqual(findHighestSignal([
		3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,
		27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5
	]), { signal: 139629729, phaseSequence: [9,8,7,6,5] })

	assert.deepEqual(findHighestSignal([
		3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,
		-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,
		53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10
	]), { signal: 18216, phaseSequence: [9,7,8,5,6] })

	const highestSignal = findHighestSignal(readInput('07.in')).signal
	console.log(highestSignal)

	// Now that the correct answer has been confirmed,
	// make sure we don't break something in future
	assert.equal(highestSignal, 22476942)
}
