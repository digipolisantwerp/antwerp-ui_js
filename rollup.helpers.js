const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');
const minify = require('uglify-es').minify;
const camelcase = require('lodash.camelcase');
const capitalize = require('lodash.capitalize');

const getSingleOuput = (name, fileName, format, dependencies) => {
    return {
        file: `./dist/${fileName}.${format}.js`,
        format: format,
        name: name,
        sourcemap: true,
		sourcemapFile: `./dist/${fileName}.${format}.sourcemap.js`,
		globals: getGlobals(dependencies),
    };
};

const getOutput = (name, fileName, dependencies) => {
    return [
        getSingleOuput(name, fileName, "amd", dependencies),
        getSingleOuput(name, fileName, "cjs", dependencies),
        getSingleOuput(name, fileName, "es", dependencies),
        getSingleOuput(name, fileName, "umd", dependencies),
    ];
};

const getPlugins = () => {
    return [
        babel({
			exclude: 'node_modules/**',
			plugins: [
				'external-helpers',
			],
			externalHelpers: true,
        }),
        uglify({
            mangle: false
        }, minify),
    ];
};

const getExternal = (dependencies) => {
	return Object.keys(dependencies);
};

const getGlobals = (dependencies = {}) => {
	return Object.keys(dependencies).reduce((globals, dep) => Object.assign(globals, {
		[dep]: capitalize(camelcase(dep)),
	}), {});
};

module.exports = {
    getSingleOuput,
    getOutput,
	getPlugins,
	getExternal,
	getGlobals,
};
