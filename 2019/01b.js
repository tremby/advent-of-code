const assert = require('assert').strict

const { fuelRequired, moduleMasses } = require('./01a.js')

function recursiveFuelRequired(mass) {
	const extra = fuelRequired(mass)
	if (extra <= 0) return 0
	return extra + recursiveFuelRequired(extra)
}

function sumFuelRequired(masses) {
	return masses.reduce((acc, mass) => acc + recursiveFuelRequired(mass), 0)
}

if (require.main === module) {
	assert.equal(recursiveFuelRequired(14), 2)
	assert.equal(recursiveFuelRequired(1969), 966)
	assert.equal(recursiveFuelRequired(100756), 50346)
	assert.equal(recursiveFuelRequired(10) + recursiveFuelRequired(200) + recursiveFuelRequired(3000), sumFuelRequired([10, 200, 3000]))

	console.log(sumFuelRequired(moduleMasses))
}
