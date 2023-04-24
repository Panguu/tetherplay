const spawn = require("child_process").spawn;

function open(config) {
	var executable = config.sink ? config.sink : 'tpinput'
	controller = spawn(executable);
	controller.stderr.setEncoding('ascii')
	controller.stderr.on('data', (data) => process.stdout.write(data))

	return controller
}

module.exports.open = open;
