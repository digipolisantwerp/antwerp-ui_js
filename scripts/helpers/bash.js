const { spawn } = require('child_process');

module.exports = (cmd, args) => new Promise((resolve, reject) => {
	const child = spawn(cmd, args, {
		stdio: 'inherit',
	});

	// child.stdout.pipe(process.stdout);
	// child.stderr.pipe(process.stderr);

	child.on('close', resolve);
	child.on('error', reject);
});
