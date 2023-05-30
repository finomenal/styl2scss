const stylus = require('stylus');
const {
	Selector, Group, Property, Ident, Call, Root, Import, Media, Keyframes, Extend, Comment,
} = require('stylus/lib/nodes');
const parseValue = require('./parseValue');
const getKey = require('./getKey');

const convertStyles = (stylusRaw, targetFile) => {
	const { Parser } = stylus;
	const parser = new Parser(stylusRaw);
	const ast = parser.parse();
	const origRaws = stylusRaw.split(/\r\n|\n/g);

	let lastLineno = 0;
	const parseNode = (node, lvl = 0) => {
		if ((node instanceof Group || node instanceof Root) && node.nodes) {
			const normalizeNodes = node.nodes.reduce((acc, n) => {
				const nodeClone = Object.assign(Object.create(Object.getPrototypeOf(n)), n);
				const { lastItem, list } = acc;
				nodeClone.origLineno = nodeClone.lineno;
				if (lastItem?.block && lastItem.block === n.block) {
					if (n.lineno > lastItem.lineno) {
						lastItem.segments.push(`,\n${'\t'.repeat(lvl)}`, ...nodeClone.segments);
						lastItem.lineno += 1;
					} else {
						lastItem.segments.push(`,${'\t'.repeat(lvl)}`, ...nodeClone.segments);
					}
					return { list, lastItem };
				}
				list.push(nodeClone);
				return { list, lastItem: nodeClone };
			}, { list: [], lastItem: null });
			return normalizeNodes.list.map((n) => parseNode(n, lvl)).join('\n');
		}
		const realLineno = node.origLineno || node.lineno;
		const linesDiff = realLineno - 1 > lastLineno ? origRaws.slice(lastLineno, realLineno - 1).map((l) => `${l}\n`).join('') : '';
		lastLineno = node.lineno;
		if (node instanceof Import) {
			const importPath = node.path.nodes[0].string.replace('.styl', '.scss');
			return `${linesDiff}@import '${importPath}';`;
		}
		if (node instanceof Property) {
			return `${linesDiff}${'\t'.repeat(lvl)}${node.segments.map((segment) => segment.string).join('')}: ${parseValue(node.expr, targetFile)};`;
		}
		if (node instanceof Extend) {
			return `${linesDiff}${'\t'.repeat(lvl)}${node.toString()};`;
		}
		if (node instanceof Comment) {
			const raw = node.toString();
			lastLineno += raw.split('\n').length - 1;
			return `${linesDiff}${raw}`;
		}
		if (node instanceof Ident) {
			return `${linesDiff}${node.toString()}: ${parseValue(node.val, targetFile)};`;
		}
		if (node instanceof Selector || node instanceof Call || node instanceof Media || node instanceof Keyframes) {
			const newRaw = `${linesDiff}${'\t'.repeat(lvl)}${getKey(node, targetFile)} {
${node.block.nodes.map((n) => `${parseNode(n, lvl + 1)}`).join('\n')}
${'\t'.repeat(lvl)}}`;
			return newRaw;
		}
		console.error(`\n${targetFile}\nWe can't convert this node:\n${node.toString()}\nPlease, create an issue at https://github.com/finomenal/styl2scss/issues`);
		process.exit();
		return '';
	};
	return parseNode(ast);
};

module.exports = convertStyles;
