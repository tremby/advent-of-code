const assert = require('assert').strict

const fs = require('fs')

function stringToPixels(string) {
	return string
		.trim()
		.split('')
		.map(num => parseInt(num, 10))
}

function pixelsToLayers(pixels, width, height) {
	const copy = [...pixels]
	const pixelsPerLayer = width * height
	const layers = []
	for (let pos = 0; pos < copy.length; pos += pixelsPerLayer) {
		if (pos + pixelsPerLayer > copy.length) {
			throw new Error(`Incomplete layer: ${copy.length - pos} extra pixels`)
		}
		layers.push(copy.slice(pos, pos + pixelsPerLayer))
	}
	return layers
}

function getValueCount(value, pixels) {
	return pixels.filter(pixel => pixel === value).length
}

if (require.main === module) {
	assert.deepEqual(stringToPixels(''), [])
	assert.deepEqual(stringToPixels('1234'), [1,2,3,4])

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

	const pixels = stringToPixels(fs.readFileSync('08.in', { encoding: 'utf8' }))
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

