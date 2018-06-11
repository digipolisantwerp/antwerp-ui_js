const packageJson = require("./package.json");
const dependencies = packageJson.dependencies;
const rollupProps = packageJson.$rollup;

const rollupHelpers = require("../../rollup.helpers");

export default {
	input: "src/index.js",
	output: rollupHelpers.getOutput(packageJson.name, rollupProps.fileName, dependencies),
	external: rollupHelpers.getExternal(dependencies),
	plugins: rollupHelpers.getPlugins(),
};
