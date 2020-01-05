const assert = require('assert').strict

const fs = require('fs')

function stringToPixels(string) {
	return string
		.trim()
		.split('')
		.map(num => parseInt(num, 10))
}

function splitArray(array, width) {
	const out = []
	for (let pos = 0; pos < array.length; pos += width) {
		if (pos + width > array.length) {
			throw new Error(`Not enough data: ${array.length - pos} extra items`)
		}
		out.push(array.slice(pos, pos + width))
	}
	return out
}

function pixelsToLayers(pixels, width, height) {
	return splitArray(pixels, width * height)
}

function getValueCount(value, pixels) {
	return pixels.filter(pixel => pixel === value).length
}

function getInput() {
	return fs.readFileSync('08.in', { encoding: 'utf8' })
}

if (require.main === module) {
	assert.deepEqual(stringToPixels(''), [])
	assert.deepEqual(stringToPixels('1234'), [1,2,3,4])

	assert.deepEqual(splitArray([0,1], 1), [[0], [1]])
	assert.deepEqual(splitArray([0,1], 2), [[0,1]])
	assert.deepEqual(splitArray([0,1,2,3,4,5], 2), [[0,1], [2,3], [4,5]])
	assert.throws(() => splitArray([0,1,2,3,4], 4))

	assert.deepEqual(pixelsToLayers([0,1,2,3,4,5], 3, 2), [[0,1,2,3,4,5]])
	assert.deepEqual(pixelsToLayers([1,2,3,4,5,6,7,8,9,0,1,2], 3, 2), [[1,2,3,4,5,6],[7,8,9,0,1,2]])
	assert.deepEqual(pixelsToLayers([1,2,3,4,5,6,7,8,9,0,1,2], 2, 3), [[1,2,3,4,5,6],[7,8,9,0,1,2]])
	assert.throws(() => pixelsToLayers([0,1,2,3,4], 2, 2))

	assert.equal(getValueCount(0, []), 0)
	assert.equal(getValueCount(0, [1]), 0)
	assert.equal(getValueCount(0, [0]), 1)
	assert.equal(getValueCount(0, [0,0]), 2)
	assert.equal(getValueCount(0, [0,1,0]), 2)
	assert.equal(getValueCount(0, [1,0,1]), 1)

	const pixels = stringToPixels(getInput())
	const layers = pixelsToLayers(pixels, 25, 6)
	const bestLayer = layers
		.reduce((best, layer) => {
			const zeroCount = getValueCount(0, layer)
			if (zeroCount < best.zeroCount) {
				return { layer, zeroCount }
			}
			return best
		}, { layer: null, zeroCount: Infinity })
		.layer
	console.log(getValueCount(1, bestLayer) * getValueCount(2, bestLayer))
}

module.exports = {
	getInput,
	stringToPixels,
	splitArray,
	pixelsToLayers,
}
