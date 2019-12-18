const assert = require('assert').strict

const {
	INPUT,
	toDigits,
	hasNDigits,
	hasAdjacentSame,
	digitsIncreaseOrStaySame,
	getPossibilitiesCount,
} = require('./04a.js')

function hasAdjacentSameMax2(digits) {
	return digits.some((digit, index) => {
		// Skip if the previous digit was the same
		if (index > 0 && digits[index - 1] === digit) return false

		// Skip if this is the last digit
		if (index >= digits.length - 1) return false

		// Skip if the next digit isn't the same
		if (digits[index + 1] !== digit) return false

		// Skip if the digit after that is the same
		if (digits[index + 2] === digit) return false

		// This is the first in a set of exactly two
		return true
	})
}

if (require.main === module) {
	assert.equal(hasAdjacentSameMax2([0]), false)
	assert.equal(hasAdjacentSameMax2([0, 0]), true)
	assert.equal(hasAdjacentSameMax2([0, 0, 0]), false)
	assert.equal(hasAdjacentSameMax2([0, 1, 1]), true)
	assert.equal(hasAdjacentSameMax2([0, 1, 1, 0]), true)
	assert.equal(hasAdjacentSameMax2([0, 0, 1, 1]), true)
	assert.equal(hasAdjacentSameMax2([0, 0, 1, 1, 1]), true)
	assert.equal(hasAdjacentSameMax2([0, 0, 0, 1, 1, 1]), false)

	function matchesCriteria(number) {
		const digits = toDigits(number)
		return hasNDigits(digits, 6)
			&& hasAdjacentSameMax2(digits)
			&& digitsIncreaseOrStaySame(digits)
	}

	assert.equal(matchesCriteria(112233), true)
	assert.equal(matchesCriteria(123444), false)
	assert.equal(matchesCriteria(111122), true)

	console.log(getPossibilitiesCount(matchesCriteria, ...INPUT))
}
