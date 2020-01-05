const fs = require('fs')

function readFile(filename) {
	return fs.readFileSync(filename, { encoding: 'utf8' }).trim()
}

module.exports = {
	readFile,
}
