const {
	Ident, Unit, Call, Expression, String, Literal, BinOp, RGBA, Function
} = require('stylus/lib/nodes');

const parseValue = (exp, targetFile) => {
	if (exp instanceof Unit) return exp.raw;
	if (exp instanceof Ident || exp instanceof Literal) return exp.string;
	if (exp instanceof String) return `"${exp.string}" `;
	if (exp instanceof BinOp) return `calc(${exp.toString()})`;
	if (exp instanceof Call || exp instanceof RGBA) {
		if (exp.name === 'url') return exp.toString().replace(/ /g, '');
		return exp.toString();
	}
	if (exp instanceof Expression) {
		if (exp.nodes) {
			return exp.nodes.map((node) => parseValue(node, targetFile)).join(' ').replace(/( {2})/g, ' ').replace(/ +$/g, '');
		}
		return exp.toString().replace(/^\(|\)$/g, '')
	}
	if (exp instanceof Function) {
		console.error(`\n${targetFile}\nPlease add this file to ignore list and convert by yourself. We can't convert this expression:\n${exp.toString()}`);
		process.exit();
		return '';
	}
	console.error(`\n${targetFile}\nPlease, create an issue at https://github.com/finomenal/styl2scss/issues\nWe can't convert this expression:\n${exp.toString()}`);
	process.exit();
	return '';
};

module.exports = parseValue;
