const assert = require('assert').strict

const fs = require('fs')

const moduleMasses = fs.readFileSync('01.in', { encoding: 'utf8' })
	.trim()
	.split('\n')
	.map(num => parseInt(num, 10))

function fuelRequired(mass) {
	return Math.floor(mass / 3) - 2
}

function sumFuelRequired(masses) {
	return masses.reduce((acc, mass) => acc + fuelRequired(mass), 0)
}

if (require.main === module) {
	assert.equal(fuelRequired(12), 2)
	assert.equal(fuelRequired(14), 2)
	assert.equal(fuelRequired(1969), 654)
	assert.equal(fuelRequired(100756), 33583)
	assert.equal(fuelRequired(10) + fuelRequired(200) + fuelRequired(3000), sumFuelRequired([10, 200, 3000]))

	console.log(sumFuelRequired(moduleMasses))
}

module.exports = {
	moduleMasses,
	fuelRequired,
	sumFuelRequired,
}
