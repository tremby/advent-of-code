const assert = require('assert').strict

const {
	getInput,
	stringToPixels,
	splitArray,
	pixelsToLayers,
} = require('./08a.js')

const BLACK = 0
const WHITE = 1
const ALPHA = 2

function overlayPixel(background, foreground) {
	if (foreground === ALPHA) {
		return background
	}
	return foreground
}

function overlayLayer(background, foreground) {
	if (background.length !== foreground.length) {
		throw new Error("Background and foreground length mismatch")
	}
	return background.map((bg, index) => overlayPixel(bg, foreground[index]))
}

function pixelToString(pixel) {
	switch (pixel) {
		case BLACK: return '██';
		case WHITE: return '▒▒';
		case ALPHA: return '  ';
		default: throw new Error(`Unexpected pixel value '${pixel}'`);
	}
}

function layerToString(layer, width) {
	return splitArray(layer.map(pixelToString), width).map(line => line.join('')).join('\n');
}

function composite(layers, width, height) {
	return layers.reduceRight(overlayLayer, Array(width * height).fill(ALPHA))
}

if (require.main === module) {
	assert.equal(overlayPixel(ALPHA, ALPHA), ALPHA)
	assert.equal(overlayPixel(ALPHA, BLACK), BLACK)
	assert.equal(overlayPixel(ALPHA, WHITE), WHITE)
	assert.equal(overlayPixel(BLACK, ALPHA), BLACK)
	assert.equal(overlayPixel(BLACK, BLACK), BLACK)
	assert.equal(overlayPixel(BLACK, WHITE), WHITE)
	assert.equal(overlayPixel(WHITE, ALPHA), WHITE)
	assert.equal(overlayPixel(WHITE, BLACK), BLACK)
	assert.equal(overlayPixel(WHITE, WHITE), WHITE)

	assert.deepEqual(overlayLayer(
		[ALPHA, BLACK, WHITE, ALPHA, BLACK, WHITE, ALPHA, BLACK, WHITE],
		[ALPHA, ALPHA, ALPHA, BLACK, BLACK, BLACK, WHITE, WHITE, WHITE]
	), [ALPHA, BLACK, WHITE, BLACK, BLACK, BLACK, WHITE, WHITE, WHITE])

	assert.equal(pixelToString(BLACK), '██')
	assert.equal(pixelToString(WHITE), '▒▒')
	assert.equal(pixelToString(ALPHA), '  ')

	assert.equal(layerToString([BLACK, WHITE, ALPHA, BLACK, WHITE, ALPHA], 2), '██▒▒\n  ██\n▒▒  ')

	assert.deepEqual(composite([[WHITE], [BLACK]], 1, 1), [WHITE])
	assert.deepEqual(composite([[WHITE], [ALPHA], [BLACK]], 1, 1), [WHITE])
	assert.deepEqual(composite([[0,2,2,2], [1,1,2,2], [2,2,1,2], [0,0,0,0]], 2, 2), [0,1,1,0])

	const width = 25
	const height = 6
	const pixels = stringToPixels(getInput())
	const layers = pixelsToLayers(pixels, width, height)
	const composited = composite(layers, width, height)
	console.log(layerToString(composited, width));
}
