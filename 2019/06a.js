const assert = require('assert').strict

const fs = require('fs')

function parseInput(input) {
	return input
		.trim()
		.split('\n')
		.map(orbit => orbit.trim().split(')'))
}

function readInput() {
	return fs.readFileSync('06.in', { encoding: 'utf8' })
}

function buildTree(orbits) {
	const nodes = {}

	function getNode(id) {
		if (!nodes[id]) {
			nodes[id] = { id, parent: null, children: [] }
		}
		return nodes[id]
	}

	for (const [parentId, childId] of orbits) {
		const parentNode = getNode(parentId)
		const childNode = getNode(childId)
		parentNode.children.push(childNode)
		childNode.parent = parentNode
	}

	for (const node of Object.values(nodes)) {
		if (node.parent === null) return node
	}
}

function countOrbits(tree, depth = 0) {
	return depth + tree.children.reduce((acc, child) => acc + countOrbits(child, depth + 1), 0)
}

if (require.main === module) {
	assert.deepEqual(parseInput('A)B'), [['A', 'B']])
	assert.deepEqual(parseInput('A)B\nB)C'), [['A', 'B'], ['B', 'C']])

	assert.equal(buildTree([['A', 'B'], ['C', 'D'], ['COM', 'A'], ['COM', 'C']]).id, 'COM')

	const tree = buildTree(parseInput(`
		COM)B
		B)C
		C)D
		D)E
		E)F
		B)G
		G)H
		D)I
		E)J
		J)K
		K)L
	`))
	assert.equal(tree.id, 'COM')

	assert.equal(countOrbits(tree), 42)

	console.log(countOrbits(buildTree(parseInput(readInput()))))
}
