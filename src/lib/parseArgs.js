const parseValue = require('./parseValue');

const parseArgs = (argNode) => {
	const argsList = [];
	if (argNode.nodes) argsList.push(...argNode.nodes.map(parseArgs));
	else argsList.push(parseValue(argNode));
	return argsList.flat();
};

module.exports = parseArgs;
