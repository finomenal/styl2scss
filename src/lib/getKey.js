const {
	Selector, Call, Media, Keyframes
} = require('stylus/lib/nodes');
const parseArgs = require('./parseArgs');

const getKey = (node, targetFile) => {
	if (node instanceof Call) {
		const args = parseArgs(node.args).join(', ');
		return `@include ${node.name}(${args})`;
	}
	if (node instanceof Selector) {
		return node.segments.map((segment) => {
			if (typeof segment === 'string') return segment;
			return segment.string;
		}).join('');
	}
	if (node instanceof Keyframes) return node.toString();
	if (node instanceof Media) {
		return node.toString().replace(/@media \(/, '@media ').replace(/\)$/, '');
	}

	console.error(`\n${targetFile}\nPlease, create an issue at https://github.com/finomenal/styl2scss/issues\nWe can't convert this key:\n${exp.toString()}`);
	process.exit();
	return '';
};

module.exports = getKey;
