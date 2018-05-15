const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');
const minify = require('uglify-es').minify;


const getSingleOuput = (name, fileName, format) => {
    return {
        file: `./dist/${fileName}.${format}.js`,
        format: format,
        name: name,
        sourcemap: true,
        sourcemapFile: `./dist/${fileName}.${format}.sourcemap.js`,
    }
}

const getOutput = (name, fileName) => {
    return [
        getSingleOuput(name, fileName, "amd"),
        getSingleOuput(name, fileName, "cjs"),
        getSingleOuput(name, fileName, "es"),
        getSingleOuput(name, fileName, "umd"),
    ]
}

const getPlugins = () => {
    return [
        babel({
            exclude: 'node_modules/**',
        }),
        uglify({
            mangle: false
        }, minify),
    ]
}


module.exports = {
    getSingleOuput,
    getOutput,
    getPlugins,
}