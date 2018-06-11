const commandLineArgs = require('command-line-args');
const colors = require('colors');
const exec = require('./helpers/bash');

const cmd = commandLineArgs([{
	name: 'name',
	defaultOption: true
}], {
	stopAtFirstUnknown: true
});
const packages = (cmd._unknown || []).filter(opt => opt.indexOf('-') !== 0);
const options = ['--loglevel=silent', ...(cmd._unknown || []).filter(opt => opt.indexOf('-') === 0)];
const scope = packages.map(p => `--scope=@acpaas-ui/js-${p}`);

if (!packages.length || packages.length > 1) {
	options.unshift('--stream');
}

exec(`./node_modules/.bin/lerna`, ['exec', ...scope, ...options, '--', 'npm', 'run', cmd.name, '-s'])
	.then(() => {
		console.info(colors.green(`Task "${cmd.name}" completed${packages.length ? ' on ' + packages.join(', ') : ''}.`));
		process.exit();
	})
	.catch(err => {
		process.exit();
	});
