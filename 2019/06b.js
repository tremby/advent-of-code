const assert = require('assert').strict

const {
	parseInput,
	readInput,
	buildTree,
} = require('./06a.js')

function findNode(id, tree) {
	if (tree.id === id) {
		return tree
	}
	for (const child of tree.children) {
		const result = findNode(id, child)
		if (result) return result
	}
	return false
}

function pathTo(node) {
	if (node.parent === null) {
		return [node]
	}
	return [...pathTo(node.parent), node]
}

function shortestPath(a, b) {
	if (a === b) {
		return [a]
	}

	// Walk back from each destination one node at a time until we have
	// something in common
	const seen = new Set([a.id, b.id])
	let aChain = [a]
	let bChain = [b]
	let commonAncestor = null
	while (true) {
		// console.log(aChain.map(node => node.id), bChain.map(node => node.id))
		const aTip = aChain[aChain.length - 1]
		const bTip = bChain[bChain.length - 1]
		if (!aTip.parent && !bTip.parent) {
			throw new Error("Found no node in common")
		}
		if (aTip.parent) {
			aChain.push(aTip.parent)
			// console.log(seen)
			if (seen.has(aTip.parent.id)) {
				commonAncestor = aTip.parent
				break
			}
			seen.add(aTip.parent.id)
		}
		if (bTip.parent) {
			bChain.push(bTip.parent)
			// console.log(seen)
			if (seen.has(bTip.parent.id)) {
				commonAncestor = bTip.parent
				break
			}
			seen.add(bTip.parent.id)
		}
	}

	// Cut chains to finish before the common ancestor
	aChain = aChain.slice(0, aChain.indexOf(commonAncestor))
	bChain = bChain.slice(0, bChain.indexOf(commonAncestor))

	// Put full path together
	return [...aChain, commonAncestor, ...bChain.reverse()]
}

if (require.main === module) {
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
		K)YOU
		I)SAN
	`))

	function toId(node) {
		return node.id
	}

	assert.equal(findNode('COM', tree).id, 'COM')
	assert.equal(findNode('D', tree).id, 'D')
	assert.equal(findNode('E', tree).children.length, 2)
	assert.equal(findNode('Z', tree), false)

	assert.deepEqual(pathTo(tree).map(node => node.id), ['COM'])
	assert.deepEqual(pathTo(findNode('COM', tree)).map(toId), ['COM'])
	assert.deepEqual(pathTo(findNode('B', tree)).map(toId), ['COM', 'B'])
	assert.deepEqual(pathTo(findNode('C', tree)).map(toId), ['COM', 'B', 'C'])
	assert.deepEqual(pathTo(findNode('H', tree)).map(toId), ['COM', 'B', 'G', 'H'])

	assert.deepEqual(shortestPath(findNode('COM', tree), findNode('B', tree)).map(toId), ['COM', 'B'])
	assert.deepEqual(shortestPath(findNode('COM', tree), findNode('C', tree)).map(toId), ['COM', 'B', 'C'])
	assert.deepEqual(shortestPath(findNode('H', tree), findNode('C', tree)).map(toId), ['H', 'G', 'B', 'C'])

	assert.deepEqual(shortestPath(findNode('YOU', tree), findNode('SAN', tree)).map(toId), ['YOU', 'K', 'J', 'E', 'D', 'I', 'SAN'])
	assert.deepEqual(shortestPath(findNode('YOU', tree).parent, findNode('SAN', tree).parent).map(toId), ['K', 'J', 'E', 'D', 'I'])
	assert.deepEqual(shortestPath(findNode('E', tree), findNode('I', tree)).map(toId), ['E', 'D', 'I'])
	assert.deepEqual(shortestPath(findNode('E', tree).parent, findNode('I', tree).parent).map(toId), ['D'])
	assert.equal(shortestPath(findNode('YOU', tree).parent, findNode('SAN', tree).parent).length - 1, 4)

	const bigTree = buildTree(parseInput(readInput()))
	console.log(shortestPath(findNode('YOU', bigTree).parent, findNode('SAN', bigTree).parent).length - 1)
}
