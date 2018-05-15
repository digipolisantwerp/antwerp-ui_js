const packageJson = require('./package.json');
const dependencies = packageJson.dependencies;
const rollupProps = packageJson.$rollup;

const rollupHelpers = require("../../rollup.helpers");
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');
const minify = require('uglify-es').minify;

export default {
    input: 'src/index.js',
    output: rollupHelpers.getOutput(packageJson.name, rollupProps.fileName),
    external: dependencies,
    plugins: rollupHelpers.getPlugins(),
};