const {
	Ident, Unit, Call, Expression, String, Literal, BinOp, RGBA
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
	if (exp instanceof Expression) return exp.toString().replace(/^\(|\)$/g, '');
	console.error(targetFile, 'parseValue', exp);
	process.exit();
	return '';
};

module.exports = parseValue;
