const findUp = require('find-up');

const getConfig = () => {
    const config = {
        ignore: ['node_modules/**'],
        convertStyles: true,
        removeOldStyles: false,
        updateJSX: false,
    };
    const configPath = findUp.sync('styl2scss.config.js');

    if (configPath) {
        const userConfig = require(configPath);
        if (!userConfig) {
            console.error(`Invalid export in ${configPath}`);
            process.exit();
        }
        if (userConfig.hasOwnProperty('ignore')) config.ignore = userConfig.ignore;
        if (userConfig.hasOwnProperty('convertStyles')) config.convertStyles = userConfig.convertStyles;
        if (userConfig.hasOwnProperty('removeOldStyles')) config.removeOldStyles = userConfig.removeOldStyles;
        if (userConfig.hasOwnProperty('updateJSX')) config.updateJSX = userConfig.updateJSX;
    } else {
        console.log('Runs with default config');
    }

    return config;
}

module.exports = getConfig;
