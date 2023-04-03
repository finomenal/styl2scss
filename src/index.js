#! /usr/bin/env node
const { glob } = require('glob');
const fs = require('fs');
const path = require('path');
const convertStyles = require('./lib/convertStyles');
const getConfig = require('./lib/getConfig');

const stylToScss = () => {
	const config = getConfig();

	let stylusFiles = [];

	if (config.convertStyles || config.removeOldStyles) {
		stylusFiles = glob.sync('**/*.styl', { ignore: config.ignore })
	}

	if (config.convertStyles) {
		console.log(`\nConvert styles. Total files: ${stylusFiles.length}\n`);
		stylusFiles.forEach((file) => {
			const filePath = path.join(process.cwd(), file);
			const { dir, name } = path.parse(filePath);

			const data = convertStyles(fs.readFileSync(filePath, { encoding: 'utf-8' }), filePath);
			fs.writeFileSync(path.join(dir, `${name}.scss`), data, { encoding: 'utf-8' });
		});
	};

	if (config.removeOldStyles) {
		console.log(`\nRemove old styles. Total files: ${stylusFiles.length}\n`);
		stylusFiles.forEach((file) => {
			const filePath = path.join(process.cwd(), file);
			fs.rmSync(filePath);
		});
	};

	if (config.updateJSX) {
		const jsxFiles = glob.sync('**/*.tsx', { ignore: config.ignore });
		console.log(`\nUpdate JSX files. Total files: ${jsxFiles.length}\n`);
		jsxFiles.forEach((file) => {
			const filePath = path.join(process.cwd(), file);
			const data = fs.readFileSync(filePath, { encoding: 'utf-8' });
			const newData = data.replace(/\.styl(['"]);$/gm, '.scss$1;');
			fs.writeFileSync(filePath, newData, { encoding: 'utf-8' });
		});
	};
}

stylToScss();