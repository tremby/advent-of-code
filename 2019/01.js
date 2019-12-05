const fs = require('fs')

const moduleMasses = fs.readFileSync('01.in', { encoding: 'utf8' })
	.trim()
	.split('\n')
	.map(num => parseInt(num, 10))

function fuelRequired(mass) {
	return Math.floor(mass / 3) - 2
}

console.log(moduleMasses.reduce((acc, mass) => acc + fuelRequired(mass), 0))
