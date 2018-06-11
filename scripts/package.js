const fs = require('fs');
const commandLineArgs = require('command-line-args');

const cmd = commandLineArgs([{
	name: 'name',
	defaultOption: true
}], {
	stopAtFirstUnknown: true
});

const packageJson = JSON.parse(fs.readFileSync('./package.json'));
delete packageJson['scripts'];
delete packageJson['private'];
delete packageJson['devDependencies'];
delete packageJson['directories'];
delete packageJson['$rollup'];

fs.writeFileSync('./dist/package.json', JSON.stringify(packageJson, undefined, 2));

process.exit();
