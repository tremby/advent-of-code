const assert = require('assert').strict

const INPUT = [183564, 657474]

function toDigits(num) {
	return num.toString().split('').map(n => parseInt(n, 10))
}

function hasNDigits(digits, n) {
	return digits.length === n
}

function hasAdjacentSame(digits) {
	return digits.some((digit, index) => digits.length > index && digit === digits[index + 1])
}

function digitsIncreaseOrStaySame(digits) {
	return digits.every((digit, index) => index === digits.length - 1 || digit <= digits[index + 1])
}

if (require.main === module) {
	assert.deepEqual(toDigits(1), [1])
	assert.deepEqual(toDigits(12), [1, 2])
	assert.deepEqual(toDigits(999), [9, 9, 9])

	assert.equal(hasNDigits([1], 1), true)
	assert.equal(hasNDigits([1], 0), false)
	assert.equal(hasNDigits([2], 1), true)
	assert.equal(hasNDigits([2], 2), false)
	assert.equal(hasNDigits([1, 2], 2), true)
	assert.equal(hasNDigits([1, 2, 3], 3), true)

	assert.equal(hasAdjacentSame([0]), false)
	assert.equal(hasAdjacentSame([1]), false)
	assert.equal(hasAdjacentSame([1, 2]), false)
	assert.equal(hasAdjacentSame([1, 1]), true)
	assert.equal(hasAdjacentSame([1, 1, 1]), true)
	assert.equal(hasAdjacentSame([1, 1, 2]), true)
	assert.equal(hasAdjacentSame([1, 2, 2]), true)
	assert.equal(hasAdjacentSame([1, 2, 2, 3]), true)
	assert.equal(hasAdjacentSame([1, 2, 3, 4]), false)

	assert.equal(digitsIncreaseOrStaySame([0]), true)
	assert.equal(digitsIncreaseOrStaySame([0, 0]), true)
	assert.equal(digitsIncreaseOrStaySame([0, 1]), true)
	assert.equal(digitsIncreaseOrStaySame([1, 0]), false)
	assert.equal(digitsIncreaseOrStaySame([0, 1, 1]), true)
	assert.equal(digitsIncreaseOrStaySame([0, 1, 2]), true)
	assert.equal(digitsIncreaseOrStaySame([0, 0, 1]), true)
	assert.equal(digitsIncreaseOrStaySame([0, 0, 1, 0]), false)
	assert.equal(digitsIncreaseOrStaySame([0, 0, 1, 1, 2]), true)

	function matchesCriteria(number) {
		const digits = toDigits(number)
		return hasNDigits(digits, 6)
			&& hasAdjacentSame(digits)
			&& digitsIncreaseOrStaySame(digits)
	}

	assert.equal(matchesCriteria(111111), true)
	assert.equal(matchesCriteria(223450), false)
	assert.equal(matchesCriteria(123789), false)

	let possibilities = 0

	for (let number = INPUT[0]; number <= INPUT[1]; number++) {
		if (matchesCriteria(number)) possibilities++
	}

	console.log(possibilities)
}
